import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

export async function GET(request: Request) {
  try {
    // Return all submissions for the user's teams
    const submissions = await prisma.innovationSubmission.findMany({
      where: {
        team: { members: { some: { userId: MOCK_USER_ID } } }
      },
      include: {
        project: { include: { idea: { select: { title: true } } } },
        team: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(submissions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { workspaceId, innovation, prototype, resourcesNeeded, supportRequested } = await request.json()
    
    // Find project
    const project = await prisma.project.findUnique({
      where: { workspaceId },
      include: { workspace: true }
    })

    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })

    // Check membership
    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: MOCK_USER_ID } }
    })
    if (!member || !['OWNER', 'ADMIN'].includes(member.role)) {
      return NextResponse.json({ error: "Only admins can submit for support" }, { status: 403 })
    }

    const submission = await prisma.innovationSubmission.create({
      data: {
        teamId: project.workspace.teamId,
        projectId: project.id,
        problem: project.problem,
        solution: project.solution,
        innovation,
        technology: project.technology || "N/A",
        prototype,
        targetUsers: project.targetUsers || "General Audience",
        expectedImpact: project.impact || "TBD",
        currentStage: project.stage,
        resourcesNeeded,
        supportRequested: Array.isArray(supportRequested) ? supportRequested.join(',') : supportRequested,
        status: 'SUBMITTED',
        links: null
      }
    })

    return NextResponse.json({ success: true, submission })
  } catch (error) {
    console.error("Innovation POST error:", error)
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 })
  }
}
