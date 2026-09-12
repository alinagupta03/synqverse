import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

async function verifyMember(workspaceId: string) {
  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: MOCK_USER_ID } }
  })
  return !!member
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const workspace = await prisma.workspace.findUnique({
    where: { id },
    include: {
      team: { select: { name: true, category: true, projectIdea: true } },
      members: { include: { user: { select: { id: true, anonymousId: true, academic: true } } } },
      tasks: { orderBy: { updatedAt: 'desc' }, take: 5 },
      milestones: { orderBy: { order: 'asc' } },
      activities: { orderBy: { createdAt: 'desc' }, take: 10, include: { actor: { select: { anonymousId: true } } } },
      channels: { where: { isDefault: true } },
      files: { orderBy: { createdAt: 'desc' }, take: 5 },
    }
  })

  if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(workspace)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: id, userId: MOCK_USER_ID } }
  })
  if (!member || !['OWNER', 'ADMIN'].includes(member.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { name, description, deadline } = await request.json()
  const updated = await prisma.workspace.update({
    where: { id },
    data: { name, description, deadline: deadline ? new Date(deadline) : undefined }
  })
  return NextResponse.json(updated)
}
