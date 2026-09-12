import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

export async function POST(request: Request) {
  try {
    const { blockedId } = await request.json()

    if (!blockedId) return NextResponse.json({ error: "Missing blockedId" }, { status: 400 })

    await prisma.block.create({
      data: { blockerId: MOCK_USER_ID, blockedId }
    })

    // Optionally: delete pending connections
    await prisma.connectionRequest.deleteMany({
      where: {
        OR: [
          { senderId: MOCK_USER_ID, receiverId: blockedId },
          { senderId: blockedId, receiverId: MOCK_USER_ID }
        ],
        status: 'PENDING'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Block API POST error:", error)
    return NextResponse.json({ error: "Failed to block user" }, { status: 500 })
  }
}
