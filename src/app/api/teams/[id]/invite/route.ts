import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { rateLimit } from '@/lib/rate-limit'
import { ModerationEngine } from '@/lib/moderation'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

// POST — Send invite
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Safety Enforcement
    const safety = await ModerationEngine.checkRestrictions(MOCK_USER_ID)
    if (safety.isSuspended) {
      return NextResponse.json({ error: "Your account is temporarily restricted." }, { status: 403 })
    }

    const { id: teamId } = await params
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1"

    if (!rateLimit(`invite_${ip}`, 20, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const team = await prisma.team.findUnique({ where: { id: teamId }, include: { members: true, roles: true } })
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 })
    if (team.ownerId !== MOCK_USER_ID) return NextResponse.json({ error: "Only the owner can invite" }, { status: 403 })

    const { inviteeId } = await request.json()
    if (!inviteeId) return NextResponse.json({ error: "inviteeId required" }, { status: 400 })

    // Check active member count vs targetSize
    const activeCount = team.members.filter(m => m.status === 'ACTIVE').length
    if (activeCount >= team.targetSize) {
      return NextResponse.json({ error: "Team is already full" }, { status: 400 })
    }

    // Duplicate invite prevention
    const existing = await prisma.teamInvite.findUnique({
      where: { teamId_inviteeId: { teamId, inviteeId } }
    })
    if (existing) {
      return NextResponse.json({ error: "Invite already sent to this user" }, { status: 400 })
    }

    // Already a member?
    const alreadyMember = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: inviteeId } }
    })
    if (alreadyMember) {
      return NextResponse.json({ error: "User is already a team member" }, { status: 400 })
    }

    const invite = await prisma.teamInvite.create({
      data: { teamId, inviteeId, invitedById: MOCK_USER_ID, status: 'PENDING' }
    })

    // Notify invitee
    await prisma.notification.create({
      data: {
        userId: inviteeId,
        type: "TEAM_INVITE",
        message: `You have been invited to join team "${team.name}".`,
        referenceId: teamId
      }
    })

    return NextResponse.json({ success: true, invite })
  } catch (error) {
    console.error("Invite POST error:", error)
    return NextResponse.json({ error: "Failed to send invite" }, { status: 500 })
  }
}

// PATCH — Accept or Decline invite (invitee only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: teamId } = await params
    const { action } = await request.json() // 'ACCEPT' | 'DECLINE'

    const invite = await prisma.teamInvite.findUnique({
      where: { teamId_inviteeId: { teamId, inviteeId: MOCK_USER_ID } }
    })
    if (!invite) return NextResponse.json({ error: "Invite not found" }, { status: 404 })
    if (invite.inviteeId !== MOCK_USER_ID) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    if (invite.status !== 'PENDING') return NextResponse.json({ error: "Invite already resolved" }, { status: 400 })

    if (action === 'ACCEPT') {
      await prisma.teamInvite.update({ where: { id: invite.id }, data: { status: 'ACCEPTED' } })
      const member = await prisma.teamMember.create({
        data: { teamId, userId: MOCK_USER_ID, status: 'ACTIVE' }
      })

      // Check if team is now complete
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: { members: { where: { status: 'ACTIVE' } } }
      })
      if (team && team.members.length >= team.targetSize) {
        await prisma.team.update({ where: { id: teamId }, data: { isOpen: false } })
      }

      return NextResponse.json({ success: true, member })
    } else if (action === 'DECLINE') {
      await prisma.teamInvite.update({ where: { id: invite.id }, data: { status: 'DECLINED' } })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Invite PATCH error:", error)
    return NextResponse.json({ error: "Failed to update invite" }, { status: 500 })
  }
}

// DELETE — Cancel invite (owner only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: teamId } = await params
    const { inviteeId } = await request.json()

    const team = await prisma.team.findUnique({ where: { id: teamId } })
    if (!team || team.ownerId !== MOCK_USER_ID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await prisma.teamInvite.deleteMany({ where: { teamId, inviteeId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to cancel invite" }, { status: 500 })
  }
}
