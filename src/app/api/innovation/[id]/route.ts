import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const submission = await prisma.innovationSubmission.findUnique({
      where: { id },
      include: {
        team: { select: { name: true } },
        project: { include: { idea: { select: { title: true, score: true } } } },
        reviews: { orderBy: { createdAt: 'desc' }, include: { reviewer: { select: { anonymousId: true } } } }
      }
    })

    if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // Verify access (must be in team)
    const member = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId: submission.teamId, userId: MOCK_USER_ID } }
    })
    if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

    return NextResponse.json(submission)
  } catch (error: any) {
    return NextResponse.json({
      error: "Internal Server Error",
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { status, feedback } = await request.json()

  // In a real app, verify MOCK_USER_ID is an ADMIN.
  // For this MVP, we allow the patch.

  const submission = await prisma.innovationSubmission.update({
    where: { id },
    data: { status }
  })

  if (feedback) {
    await prisma.submissionReview.create({
      data: {
        submissionId: id,
        reviewerId: MOCK_USER_ID,
        statusChange: status,
        feedback
      }
    })
  }

  return NextResponse.json({ success: true, submission })
}
