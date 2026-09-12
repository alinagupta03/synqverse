import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { rateLimit } from '@/lib/rate-limit'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

async function verifyMember(workspaceId: string) {
  return !!(await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: MOCK_USER_ID } }
  }))
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; channelId: string }> }
) {
  const { id, channelId } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const channel = await prisma.channel.findUnique({ where: { id: channelId } })
  if (!channel || channel.workspaceId !== id) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const messages = await prisma.channelMessage.findMany({
    where: { channelId, isDeleted: false },
    include: { sender: { select: { id: true, anonymousId: true } } },
    orderBy: { createdAt: 'asc' },
    take: 100
  })
  return NextResponse.json(messages)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; channelId: string }> }
) {
  const { id, channelId } = await params
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1"

  if (!rateLimit(`chan_msg_${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
  }
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const channel = await prisma.channel.findUnique({ where: { id: channelId } })
  if (!channel || channel.workspaceId !== id) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { content, replyToId } = await request.json()
  if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 })

  const message = await prisma.channelMessage.create({
    data: { channelId, senderId: MOCK_USER_ID, content: content.trim(), replyToId },
    include: { sender: { select: { id: true, anonymousId: true } } }
  })

  await prisma.workspaceActivity.create({
    data: { workspaceId: id, actorId: MOCK_USER_ID, type: 'MESSAGE_SENT', message: `Sent a message in #${channel.name}`, referenceId: channelId }
  })

  return NextResponse.json({ success: true, message })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; channelId: string }> }
) {
  const { id } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const { messageId, content, isDeleted } = await request.json()
  const msg = await prisma.channelMessage.findUnique({ where: { id: messageId } })
  if (!msg || msg.senderId !== MOCK_USER_ID) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const updated = await prisma.channelMessage.update({
    where: { id: messageId },
    data: isDeleted ? { isDeleted: true, content: "[Message Deleted]" } : { content, isEdited: true }
  })
  return NextResponse.json({ success: true, message: updated })
}
