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

  const channels = await prisma.channel.findMany({
    where: { workspaceId: id },
    orderBy: [{ isDefault: 'desc' }, { name: 'asc' }]
  })
  return NextResponse.json(channels)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: id, userId: MOCK_USER_ID } }
  })
  if (!member || !['OWNER', 'ADMIN'].includes(member.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { name, description } = await request.json()
  if (!name) return NextResponse.json({ error: "Channel name required" }, { status: 400 })

  const channel = await prisma.channel.create({
    data: { workspaceId: id, name: name.toLowerCase().replace(/\s+/g, '-'), description }
  })
  return NextResponse.json({ success: true, channel })
}
