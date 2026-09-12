import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

async function verifyMember(workspaceId: string) {
  return await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: MOCK_USER_ID } }
  })
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const project = await prisma.project.findUnique({
    where: { workspaceId: id },
    include: {
      idea: { select: { title: true, score: true, innovationLevel: true } },
      submissions: { orderBy: { createdAt: 'desc' }, take: 1 }
    }
  })

  if (!project) return NextResponse.json(null)

  return NextResponse.json(project)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const member = await verifyMember(id)
  if (!member || !['OWNER', 'ADMIN'].includes(member.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { stage, links, documents, impact } = await request.json()

  const project = await prisma.project.update({
    where: { workspaceId: id },
    data: {
      ...(stage !== undefined && { stage }),
      ...(links !== undefined && { links }),
      ...(documents !== undefined && { documents }),
      ...(impact !== undefined && { impact }),
    }
  })

  return NextResponse.json({ success: true, project })
}
