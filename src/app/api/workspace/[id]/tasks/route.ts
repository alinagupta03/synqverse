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

  const tasks = await prisma.workspaceTask.findMany({
    where: { workspaceId: id },
    include: {
      assignee: { select: { id: true, anonymousId: true } },
      creator: { select: { id: true, anonymousId: true } },
      comments: { include: { author: { select: { anonymousId: true } } }, orderBy: { createdAt: 'asc' } },
      checklists: { orderBy: { order: 'asc' } }
    },
    orderBy: [{ status: 'asc' }, { order: 'asc' }]
  })
  return NextResponse.json(tasks)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const { title, description, assigneeId, priority, deadline, labels, status, checklists } = await request.json()
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 })

  const task = await prisma.workspaceTask.create({
    data: {
      workspaceId: id,
      title,
      description,
      assigneeId,
      creatorId: MOCK_USER_ID,
      priority: priority || 'MEDIUM',
      deadline: deadline ? new Date(deadline) : null,
      labels: Array.isArray(labels) ? labels.join(',') : (labels || ''),
      status: status || 'BACKLOG',
      checklists: checklists?.length ? {
        create: checklists.map((c: string, i: number) => ({ label: c, order: i }))
      } : undefined
    },
    include: { assignee: { select: { id: true, anonymousId: true } }, creator: { select: { id: true, anonymousId: true } }, checklists: true }
  })

  await prisma.workspaceActivity.create({
    data: { workspaceId: id, actorId: MOCK_USER_ID, type: 'TASK_CREATED', message: `Created task "${title}"`, referenceId: task.id }
  })

  return NextResponse.json({ success: true, task })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const { taskId, status, title, description, assigneeId, priority, deadline, labels, order } = await request.json()
  const existing = await prisma.workspaceTask.findUnique({ where: { id: taskId } })
  if (!existing || existing.workspaceId !== id) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const updated = await prisma.workspaceTask.update({
    where: { id: taskId },
    data: {
      ...(status !== undefined && { status }),
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(assigneeId !== undefined && { assigneeId }),
      ...(priority !== undefined && { priority }),
      ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
      ...(labels !== undefined && { labels: Array.isArray(labels) ? labels.join(',') : labels }),
      ...(order !== undefined && { order }),
    },
    include: { assignee: { select: { id: true, anonymousId: true } }, creator: { select: { id: true, anonymousId: true } } }
  })

  if (status === 'DONE' && existing.status !== 'DONE') {
    await prisma.workspaceActivity.create({
      data: { workspaceId: id, actorId: MOCK_USER_ID, type: 'TASK_COMPLETED', message: `Completed task "${updated.title}"`, referenceId: taskId }
    })
  }

  return NextResponse.json({ success: true, task: updated })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  const { taskId } = await request.json()
  const task = await prisma.workspaceTask.findUnique({ where: { id: taskId } })
  if (!task || task.workspaceId !== id) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (task.creatorId !== MOCK_USER_ID) return NextResponse.json({ error: "Only creator can delete" }, { status: 403 })
  await prisma.workspaceTask.delete({ where: { id: taskId } })
  return NextResponse.json({ success: true })
}
