import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

export async function GET() {
  try {
    const activeActions = await prisma.moderationAction.findMany({
      where: {
        userId: MOCK_USER_ID,
        status: 'ACTIVE',
        OR: [
          { endTime: null },
          { endTime: { gt: new Date() } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })

    const badges = await prisma.trustBadge.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { earnedAt: 'desc' }
    })

    return NextResponse.json({ activeActions, badges })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch safety status" }, { status: 500 })
  }
}
