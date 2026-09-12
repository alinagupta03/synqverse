import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

// PATCH — Owner approve/remove; member leave
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: teamId } = await params
    const { userId, action } = await request.json() // action: 'REMOVE' | 'APPROVE'

    const team = await prisma.team.findUnique({ where: { id: teamId } })
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 })

    // Only owner can remove/approve
    if (team.ownerId !== MOCK_USER_ID) {
      return NextResponse.json({ error: "Only the team owner can manage members" }, { status: 403 })
    }

    if (userId === team.ownerId) {
      return NextResponse.json({ error: "Cannot remove the team owner" }, { status: 400 })
    }

    if (action === 'REMOVE') {
      await prisma.teamMember.updateMany({
        where: { teamId, userId },
        data: { status: 'REMOVED' }
      })
      // Re-open team if it was closed due to being full
      const activeCount = await prisma.teamMember.count({ where: { teamId, status: 'ACTIVE' } })
      if (activeCount < team.targetSize) {
        await prisma.team.update({ where: { id: teamId }, data: { isOpen: true } })
      }
    } else if (action === 'APPROVE') {
      await prisma.teamMember.updateMany({
        where: { teamId, userId, status: 'PENDING' },
        data: { status: 'ACTIVE' }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 })
  }
}

// DELETE — Self-leave
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: teamId } = await params

    const team = await prisma.team.findUnique({ where: { id: teamId } })
    if (!team) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (team.ownerId === MOCK_USER_ID) {
      return NextResponse.json({ error: "Owner cannot leave; delete the team instead" }, { status: 400 })
    }

    await prisma.teamMember.updateMany({
      where: { teamId, userId: MOCK_USER_ID },
      data: { status: 'REMOVED' }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to leave team" }, { status: 500 })
  }
}
