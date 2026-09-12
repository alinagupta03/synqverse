import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

const ALLOWED_TYPES = ['image/png','image/jpeg','image/gif','image/webp','application/pdf','text/plain','application/zip','video/mp4']
const MAX_SIZE = 50 * 1024 * 1024 // 50MB

async function verifyMember(workspaceId: string) {
  return !!(await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: MOCK_USER_ID } }
  }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  const files = await prisma.workspaceFile.findMany({
    where: { workspaceId: id },
    include: { uploader: { select: { anonymousId: true } } },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(files)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const { name, fileType, size, url } = await request.json()

  // Validate
  if (!ALLOWED_TYPES.includes(fileType)) {
    return NextResponse.json({ error: `File type "${fileType}" is not allowed.` }, { status: 400 })
  }
  if (size > MAX_SIZE) {
    return NextResponse.json({ error: "File exceeds 50MB limit." }, { status: 400 })
  }

  const file = await prisma.workspaceFile.create({
    data: { workspaceId: id, uploaderId: MOCK_USER_ID, name, fileType, size, url: url || '#' }
  })
  await prisma.workspaceActivity.create({
    data: { workspaceId: id, actorId: MOCK_USER_ID, type: 'FILE_UPLOADED', message: `Uploaded file "${name}"`, referenceId: file.id }
  })
  return NextResponse.json({ success: true, file })
}
