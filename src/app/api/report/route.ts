import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { ModerationEngine } from '@/lib/moderation'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

export async function POST(request: Request) {
  try {
    const { targetId, targetType, reason, description, reportedUserId } = await request.json()

    if (!reportedUserId || !reason || !targetType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const report = await prisma.report.create({
      data: {
        reporterId: MOCK_USER_ID,
        reportedUserId,
        targetType,
        targetId,
        reason,
        description,
        status: "OPEN"
      }
    })

    // Async trigger automated moderation check
    ModerationEngine.processReport(report.id).catch(console.error)

    return NextResponse.json({ success: true, report })
  } catch (error) {
    console.error("Report POST error:", error)
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 })
  }
}
