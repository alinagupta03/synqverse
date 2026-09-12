import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, anonymousId: true } },
        members: {
          include: { user: { select: { id: true, anonymousId: true, academic: true, skills: { include: { skill: true } } } } }
        },
        roles: true,
        invites: {
          where: { status: 'PENDING' },
          include: { invitee: { select: { id: true, anonymousId: true } } }
        },
      },
    })

    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 })

    return NextResponse.json(team)
  } catch (error) {
    console.error("Team GET error:", error)
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const team = await prisma.team.findUnique({ where: { id } })
    if (!team) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (team.ownerId !== MOCK_USER_ID) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

    const { name, projectIdea, description, category, targetSize, isOpen } = body

    const updated = await prisma.team.update({
      where: { id },
      data: { name, projectIdea, description, category, targetSize, isOpen }
    })

    return NextResponse.json({ success: true, team: updated })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update team" }, { status: 500 })
  }
}
