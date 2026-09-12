import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

async function verifyMember(workspaceId: string) {
  return await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: MOCK_USER_ID } }
  })
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId: id },
    include: { user: { select: { id: true, anonymousId: true, academic: true } } },
    orderBy: { joinedAt: 'asc' }
  })
  return NextResponse.json(members)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const self = await verifyMember(id)
  if (!self || !['OWNER', 'ADMIN'].includes(self.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  const { targetUserId, role, action } = await request.json()

  if (action === 'PROMOTE') {
    if (self.role !== 'OWNER') return NextResponse.json({ error: "Only OWNER can promote" }, { status: 403 })
    await prisma.workspaceMember.updateMany({
      where: { workspaceId: id, userId: targetUserId },
      data: { role: role || 'ADMIN' }
    })
  } else if (action === 'REMOVE') {
    const target = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: id, userId: targetUserId } }
    })
    if (target?.role === 'OWNER') return NextResponse.json({ error: "Cannot remove owner" }, { status: 400 })
    await prisma.workspaceMember.deleteMany({ where: { workspaceId: id, userId: targetUserId } })
  }

  return NextResponse.json({ success: true })
}
