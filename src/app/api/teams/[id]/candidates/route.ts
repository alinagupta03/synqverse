import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { calculateMatchScore } from '@/lib/matching'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: teamId } = await params

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: { select: { userId: true } },
        invites: { select: { inviteeId: true } },
        roles: true,
      }
    })
    if (!team || team.ownerId !== MOCK_USER_ID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Exclude current members and pending invitees
    const excludeIds = [
      ...team.members.map(m => m.userId),
      ...team.invites.map(i => i.inviteeId),
    ]

    const candidates = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        id: { notIn: excludeIds },
      },
      include: {
        academic: true,
        profile: true,
        skills: { include: { skill: true } },
        interests: { include: { interest: true } },
      },
      take: 20,
    })

    const teamSkills = team.requiredSkills ? team.requiredSkills.split(',').filter(Boolean) : []
    const teamRoles = team.roles.map(r => r.roleName)

    const currentUser = {
      id: MOCK_USER_ID,
      anonymousId: "Team",
      branch: team.branchPreference || null,
      stream: team.streamPreference || null,
      year: null,
      skills: teamSkills,
      interests: [],
      lookingFor: null,
      availability: team.availability || null,
      projectTypes: [team.category],
    }

    const scored = candidates.map(c => {
      const profile = {
        id: c.id,
        anonymousId: c.anonymousId || "Anonymous Student",
        branch: c.academic?.branch || null,
        stream: c.academic?.stream || null,
        year: c.academic?.year || null,
        skills: c.skills.map(s => s.skill.name),
        interests: c.interests.map(i => i.interest.name),
        lookingFor: c.profile?.lookingFor || null,
        availability: c.profile?.availability || null,
        projectTypes: c.profile?.projectTypes ? c.profile.projectTypes.split(',').filter(Boolean) : [],
      }

      const match = calculateMatchScore(currentUser as any, profile as any)

      // Determine best-fit role
      const matchedRole = teamRoles.find(r =>
        profile.skills.some(s => s.toLowerCase().includes(r.toLowerCase()))
      ) || null

      return { ...profile, matchScore: match.score, matchExplanation: match.explanation, suggestedRole: matchedRole }
    })

    scored.sort((a, b) => b.matchScore - a.matchScore)

    return NextResponse.json(scored)
  } catch (error) {
    console.error("Candidates GET error:", error)
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 })
  }
}
