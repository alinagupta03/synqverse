import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_ADMIN_ID = "current-user-id" // Using current mock user as admin for Phase 7

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { action, level, reason, durationDays } = await request.json()

    const report = await prisma.report.findUnique({ where: { id } })
    if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 })

    if (action === 'DISMISS') {
      await prisma.report.update({ where: { id }, data: { status: 'DISMISSED' } })
      return NextResponse.json({ success: true })
    }

    // Determine end time if a duration is specified
    let endTime = null
    if (durationDays) {
      endTime = new Date()
      endTime.setDate(endTime.getDate() + durationDays)
    }

    // Create the Moderation Action
    const modAction = await prisma.moderationAction.create({
      data: {
        userId: report.reportedUserId,
        level: level || 1,
        actionType: action,
        reason: reason || "Violation of community guidelines",
        endTime,
        source: MOCK_ADMIN_ID,
      }
    })

    // Create Immutable Audit Log
    await prisma.moderationAuditLog.create({
      data: {
        actionId: modAction.id,
        adminId: MOCK_ADMIN_ID,
        details: `Issued ${action} (Level ${level}) to user ${report.reportedUserId} for report ${report.id}. Reason: ${reason}`
      }
    })

    // Close the report
    await prisma.report.update({ where: { id }, data: { status: 'RESOLVED' } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Moderation action error:", error)
    return NextResponse.json({ error: "Failed to execute action" }, { status: 500 })
  }
}
