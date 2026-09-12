import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_ADMIN_ID = "current-user-id"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { action } = await request.json()

    if (action === 'SUSPEND') {
      await prisma.moderationAction.create({
        data: {
          userId: id,
          level: 5,
          actionType: 'SUSPENSION',
          reason: 'Administrative Suspension',
          source: MOCK_ADMIN_ID
        }
      })
    } else if (action === 'UNSUSPEND') {
      await prisma.moderationAction.updateMany({
        where: { userId: id, actionType: 'SUSPENSION', status: 'ACTIVE' },
        data: { status: 'REVOKED' }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update suspension" }, { status: 500 })
  }
}
