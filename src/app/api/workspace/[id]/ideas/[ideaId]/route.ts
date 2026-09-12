import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

async function verifyMember(workspaceId: string) {
  return await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: MOCK_USER_ID } }
  })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; ideaId: string }> }
) {
  const { id, ideaId } = await params
  const member = await verifyMember(id)
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const { status, action } = await request.json() // action can be 'PROMOTE'
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } })
  if (!idea || idea.workspaceId !== id) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (action === 'PROMOTE') {
    if (!['OWNER', 'ADMIN'].includes(member.role)) {
      return NextResponse.json({ error: "Only admins can promote ideas to projects" }, { status: 403 })
    }

    // Convert Idea to Project
    const project = await prisma.project.create({
      data: {
        workspaceId: id,
        ideaId: idea.id,
        problem: idea.problem,
        solution: idea.solution,
        targetUsers: idea.targetUsers,
        technology: idea.technology,
        stage: 'Idea'
      }
    })

    await prisma.idea.update({ where: { id: ideaId }, data: { status: 'PROMOTED' } })

    await prisma.workspaceActivity.create({
      data: { workspaceId: id, actorId: MOCK_USER_ID, type: 'PROJECT_CREATED', message: `Promoted idea "${idea.title}" to an official Project`, referenceId: project.id }
    })

    return NextResponse.json({ success: true, project })
  }

  // Normal edit
  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: { ...(status !== undefined && { status }) }
  })

  return NextResponse.json({ success: true, idea: updated })
}
