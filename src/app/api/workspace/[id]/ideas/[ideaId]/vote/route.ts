import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

async function verifyMember(workspaceId: string) {
  return await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: MOCK_USER_ID } }
  })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; ideaId: string }> }
) {
  const { id, ideaId } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const { value } = await request.json() // 1 or -1 or 0 (remove vote)
  if (![1, -1, 0].includes(value)) return NextResponse.json({ error: "Invalid vote" }, { status: 400 })

  const idea = await prisma.idea.findUnique({ where: { id: ideaId } })
  if (!idea || idea.workspaceId !== id) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (value === 0) {
    await prisma.ideaVote.deleteMany({ where: { ideaId, userId: MOCK_USER_ID } })
  } else {
    await prisma.ideaVote.upsert({
      where: { ideaId_userId: { ideaId, userId: MOCK_USER_ID } },
      update: { value },
      create: { ideaId, userId: MOCK_USER_ID, value }
    })
  }

  return NextResponse.json({ success: true })
}
