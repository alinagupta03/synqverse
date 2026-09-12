import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { rateLimit } from '@/lib/rate-limit'
import { ModerationEngine } from '@/lib/moderation'

const prisma = new PrismaClient()

// Current logged in user (Mocked for Demo)
const MOCK_USER_ID = "current-user-id"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'received' // 'received', 'sent', 'connections'

    let whereClause = {}
    
    if (type === 'received') {
       whereClause = { receiverId: MOCK_USER_ID, status: 'PENDING' }
    } else if (type === 'sent') {
       whereClause = { senderId: MOCK_USER_ID, status: 'PENDING' }
    } else if (type === 'connections') {
       whereClause = {
         OR: [
           { senderId: MOCK_USER_ID, status: 'ACCEPTED' },
           { receiverId: MOCK_USER_ID, status: 'ACCEPTED' }
         ]
       }
    }

    const connections = await prisma.connectionRequest.findMany({
      where: whereClause,
      include: {
        sender: { include: { profile: true, academic: true } },
        receiver: { include: { profile: true, academic: true } },
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(connections)
  } catch (error) {
    console.error("Connections API GET error:", error)
    return NextResponse.json({ error: "Failed to fetch connections" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Safety Enforcement
    const safety = await ModerationEngine.checkRestrictions(MOCK_USER_ID)
    if (safety.isSuspended) {
      return NextResponse.json({ error: "Your account is temporarily restricted." }, { status: 403 })
    }

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1"
    if (!rateLimit(`connect_${ip}`, 10, 60 * 60 * 1000)) { // 10 requests per hour
      return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 })
    }

    const { targetUserId } = await request.json()
    if (!targetUserId) return NextResponse.json({ error: "Target User ID is required" }, { status: 400 })

    // Check if target has blocked sender
    const isBlocked = await prisma.block.findFirst({
      where: { blockerId: targetUserId, blockedId: MOCK_USER_ID }
    })
    
    if (isBlocked) {
      return NextResponse.json({ error: "Cannot send connection request." }, { status: 403 })
    }

    // Check existing request
    const existing = await prisma.connectionRequest.findFirst({
      where: {
        OR: [
          { senderId: MOCK_USER_ID, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: MOCK_USER_ID }
        ]
      }
    })

    if (existing) {
       return NextResponse.json({ error: "Connection already exists or is pending" }, { status: 400 })
    }

    const connection = await prisma.connectionRequest.create({
      data: {
        senderId: MOCK_USER_ID,
        receiverId: targetUserId,
        status: 'PENDING'
      }
    })

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: "CONNECTION_REQUEST",
        message: "wants to connect with you.",
        referenceId: connection.id
      }
    })

    return NextResponse.json({ success: true, connection })
  } catch (error) {
    console.error("Connections API POST error:", error)
    return NextResponse.json({ error: "Failed to create connection" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { connectionId, action } = await request.json() // action: 'ACCEPT', 'DECLINE', 'CANCEL'

    const connection = await prisma.connectionRequest.findUnique({ where: { id: connectionId } })
    if (!connection) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // Auth check
    if (connection.receiverId !== MOCK_USER_ID && connection.senderId !== MOCK_USER_ID) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (action === 'CANCEL' && connection.senderId === MOCK_USER_ID) {
      await prisma.connectionRequest.delete({ where: { id: connectionId } })
      return NextResponse.json({ success: true, deleted: true })
    }

    if (connection.receiverId !== MOCK_USER_ID) {
      return NextResponse.json({ error: "Only receiver can accept/decline" }, { status: 403 })
    }

    if (action === 'ACCEPT') {
      const updated = await prisma.connectionRequest.update({
        where: { id: connectionId },
        data: { status: 'ACCEPTED' }
      })

      // Create a Conversation seamlessly upon acceptance
      const convo = await prisma.conversation.create({
         data: {
            participants: {
               create: [
                 { userId: connection.senderId },
                 { userId: connection.receiverId }
               ]
            }
         }
      })

      // Notify Sender
      await prisma.notification.create({
        data: {
          userId: connection.senderId,
          type: "CONNECTION_ACCEPTED",
          message: "accepted your connection request.",
          referenceId: convo.id
        }
      })

      return NextResponse.json({ success: true, connection: updated, conversationId: convo.id })
    } else if (action === 'DECLINE') {
      const updated = await prisma.connectionRequest.update({
        where: { id: connectionId },
        data: { status: 'DECLINED' }
      })
      return NextResponse.json({ success: true, connection: updated })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Connections API PATCH error:", error)
    return NextResponse.json({ error: "Failed to update connection" }, { status: 500 })
  }
}
