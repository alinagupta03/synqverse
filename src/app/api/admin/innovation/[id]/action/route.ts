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
    const { action, feedback } = await request.json()

    // Status map: SHORTLIST, REQUEST_CHANGES, ACCEPT, REJECT
    const statusMap: Record<string, string> = {
      SHORTLIST: 'SHORTLISTED',
      REQUEST_CHANGES: 'NEEDS_CHANGES',
      ACCEPT: 'ACCEPTED',
      REJECT: 'REJECTED'
    }

    const newStatus = statusMap[action]
    if (!newStatus) return NextResponse.json({ error: "Invalid action" }, { status: 400 })

    await prisma.innovationSubmission.update({
      where: { id },
      data: { status: newStatus }
    })

    if (feedback) {
      await prisma.submissionReview.create({
        data: {
          submissionId: id,
          reviewerId: MOCK_ADMIN_ID,
          statusChange: newStatus,
          feedback
        }
      })
    }

    return NextResponse.json({ success: true, status: newStatus })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process action" }, { status: 500 })
  }
}
