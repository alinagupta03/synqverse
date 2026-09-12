import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

async function verifyMember(workspaceId: string) {
  return !!(await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: MOCK_USER_ID } }
  }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  const milestones = await prisma.workspaceMilestone.findMany({
    where: { workspaceId: id },
    orderBy: { order: 'asc' }
  })
  return NextResponse.json(milestones)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  const { title, description, phase, dueDate } = await request.json()
  const count = await prisma.workspaceMilestone.count({ where: { workspaceId: id } })
  const m = await prisma.workspaceMilestone.create({
    data: { workspaceId: id, title, description, phase: phase || 'Research', dueDate: dueDate ? new Date(dueDate) : null, order: count }
  })
  return NextResponse.json({ success: true, milestone: m })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  const { milestoneId, status, title, description, dueDate } = await request.json()
  const m = await prisma.workspaceMilestone.findUnique({ where: { id: milestoneId } })
  if (!m || m.workspaceId !== id) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const updated = await prisma.workspaceMilestone.update({
    where: { id: milestoneId },
    data: {
      ...(status !== undefined && { status }),
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
    }
  })

  if (status === 'COMPLETED' && m.status !== 'COMPLETED') {
    await prisma.workspaceActivity.create({
      data: { workspaceId: id, actorId: MOCK_USER_ID, type: 'MILESTONE_COMPLETED', message: `Milestone "${updated.title}" completed! 🎉`, referenceId: milestoneId }
    })
  }
  return NextResponse.json({ success: true, milestone: updated })
}
