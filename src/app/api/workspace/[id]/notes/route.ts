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
  const notes = await prisma.workspaceNote.findMany({
    where: { workspaceId: id },
    include: { author: { select: { anonymousId: true } } },
    orderBy: { updatedAt: 'desc' }
  })
  return NextResponse.json(notes)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  const { title, content } = await request.json()
  const note = await prisma.workspaceNote.create({
    data: { workspaceId: id, authorId: MOCK_USER_ID, title: title || 'Untitled Note', content: content || '' }
  })
  await prisma.workspaceActivity.create({
    data: { workspaceId: id, actorId: MOCK_USER_ID, type: 'NOTE_CREATED', message: `Created note "${note.title}"`, referenceId: note.id }
  })
  return NextResponse.json({ success: true, note })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  const { noteId, title, content } = await request.json()
  const note = await prisma.workspaceNote.findUnique({ where: { id: noteId } })
  if (!note || note.workspaceId !== id || note.authorId !== MOCK_USER_ID) {
    return NextResponse.json({ error: "Unauthorized or not found" }, { status: 403 })
  }
  const updated = await prisma.workspaceNote.update({
    where: { id: noteId },
    data: { ...(title !== undefined && { title }), ...(content !== undefined && { content }) }
  })
  return NextResponse.json({ success: true, note: updated })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  const { noteId } = await request.json()
  const note = await prisma.workspaceNote.findUnique({ where: { id: noteId } })
  if (!note || note.workspaceId !== id || note.authorId !== MOCK_USER_ID) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  await prisma.workspaceNote.delete({ where: { id: noteId } })
  return NextResponse.json({ success: true })
}
