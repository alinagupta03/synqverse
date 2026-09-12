import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { rateLimit } from '@/lib/rate-limit'
import { ModerationEngine } from '@/lib/moderation'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      // Return list of conversations for inbox
      const convos = await prisma.conversation.findMany({
        where: {
          participants: { some: { userId: MOCK_USER_ID } }
        },
        include: {
          participants: {
             include: { user: { include: { profile: true } } }
          },
          messages: {
             orderBy: { createdAt: 'desc' },
             take: 1
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
      
      return NextResponse.json(convos)
    }

    // Verify participation
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId: MOCK_USER_ID } }
    })

    if (!participant) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

    // Update last read
    await prisma.conversationParticipant.update({
       where: { conversationId_userId: { conversationId, userId: MOCK_USER_ID } },
       data: { lastReadAt: new Date() }
    })

    const messages = await prisma.message.findMany({
      where: { conversationId, isDeleted: false },
      include: {
         sender: { select: { id: true, anonymousId: true } }
      },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Messages API GET error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1"
    if (!rateLimit(`msg_${ip}`, 30, 60 * 1000)) { // 30 messages per minute
      return NextResponse.json({ error: "Rate limit exceeded. Too many messages." }, { status: 429 })
    }

    const { conversationId, content, replyToId } = await request.json()

    // Safety Enforcement: Temp Comm Restriction
    const safety = await ModerationEngine.checkRestrictions(MOCK_USER_ID)
    if (safety.isMuted || safety.isSuspended) {
      return NextResponse.json({ error: "Your account is temporarily restricted from sending messages." }, { status: 403 })
    }

    // Verify participation and include conversation participants for block checks
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId: MOCK_USER_ID } },
      include: { conversation: { include: { participants: true } } }
    })

    if (!participant) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

    const otherParticipant = participant.conversation.participants.find(p => p.userId !== MOCK_USER_ID)
    
    if (otherParticipant) {
       const isBlocked = await prisma.block.findFirst({
         where: { blockerId: otherParticipant.userId, blockedId: MOCK_USER_ID }
       })
       if (isBlocked) {
         return NextResponse.json({ error: "Cannot send message. You have been blocked." }, { status: 403 })
       }
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: MOCK_USER_ID,
        content,
        replyToId
      },
      include: { sender: { select: { id: true, anonymousId: true } } }
    })

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    })

    // Notify other participant (if they exist and haven't blocked)
    if (otherParticipant) {
       await prisma.notification.create({
         data: {
           userId: otherParticipant.userId,
           type: "NEW_MESSAGE",
           message: "sent you a new message.",
           referenceId: conversationId
         }
       })
    }

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error("Messages API POST error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  // Handle edit / delete
  try {
     const { messageId, content, isDeleted } = await request.json()
     
     const existing = await prisma.message.findUnique({ where: { id: messageId } })
     if (!existing || existing.senderId !== MOCK_USER_ID) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
     }

     const updated = await prisma.message.update({
        where: { id: messageId },
        data: isDeleted ? { isDeleted: true, content: "[Message Deleted]" } : { content, isEdited: true }
     })

     return NextResponse.json({ success: true, message: updated })
  } catch (error) {
     return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
  }
}
