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
  const activities = await prisma.workspaceActivity.findMany({
    where: { workspaceId: id },
    include: { actor: { select: { anonymousId: true } } },
    orderBy: { createdAt: 'desc' },
    take: 30
  })
  return NextResponse.json(activities)
}
