import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "students"
    const branch = searchParams.get('branch')
    const skill = searchParams.get('skill')
    const query = searchParams.get('q')

    // Get current user's profile to adapt recommendations (Phase 8: Personalization)
    const currentUserProfile = await prisma.profile.findUnique({
      where: { userId: MOCK_USER_ID }
    })
    const userExp = currentUserProfile?.experienceLevel || "Beginner"

    if (type === "students") {
      const users = await prisma.user.findMany({
        where: { 
          id: { not: MOCK_USER_ID }
        },
        include: { 
          profile: true, 
          academic: true,
          skills: { include: { skill: true } },
          interests: { include: { interest: true } }
        }
      })

      // Map to expected Frontend Profile Shape
      const mappedProfiles = users.map(user => {
        const p = user.profile
        const a = user.academic
        return {
          id: user.id,
          userId: user.id,
          anonymousId: user.anonymousId || `Student #${user.id.slice(0, 4)}`,
          branch: a?.branch || "Computer Science",
          stream: a?.stream || "B.Tech",
          year: a?.year || "3rd Year",
          skills: user.skills && user.skills.length > 0 
            ? user.skills.map(s => s.skill.name) 
            : ["React", "TypeScript", "Node.js", "UI/UX"],
          interests: user.interests && user.interests.length > 0 
            ? user.interests.map(i => i.interest.name) 
            : ["Web3", "AI/ML", "Startups"],
          bio: p?.bio || "Passionate student looking to collaborate on impactful tech projects and hackathons.",
          experienceLevel: p?.experienceLevel || "Intermediate",
          portfolioUrl: null,
          githubUrl: null,
          linkedinUrl: null,
          matchScore: Math.floor(Math.random() * 20) + 80 // Mock 80-99% match
        }
      })

      // Simple recommendation engine: Randomize but prioritize similar experience levels
      const sorted = mappedProfiles.sort((a, b) => {
         const aMatch = a.experienceLevel === userExp ? 1 : 0
         const bMatch = b.experienceLevel === userExp ? 1 : 0
         
         // Random jitter for variety
         const jitterA = Math.random() * 0.5
         const jitterB = Math.random() * 0.5
         
         return (bMatch + jitterB) - (aMatch + jitterA)
      })

      return NextResponse.json(sorted)
    }

    // --- TEAMS DISCOVERY LOGIC ---
    
    // Get IDs of users who blocked me or I have blocked
    const blocks = await prisma.block.findMany({
      where: {
        OR: [
          { blockerId: MOCK_USER_ID },
          { blockedId: MOCK_USER_ID }
        ]
      }
    })
    
    const blockedUserIds = blocks.map(b => 
      b.blockerId === MOCK_USER_ID ? b.blockedId : b.blockerId
    )

    const whereClause: any = {
      isRecruiting: true,
      members: {
        none: { userId: { in: [MOCK_USER_ID, ...blockedUserIds] } }
      }
    }

    if (branch) whereClause.branchPref = branch
    if (query) {
      whereClause.OR = [
        { name: { contains: query } },
        { projectIdea: { contains: query } }
      ]
    }

    // We can't filter JSON skill gaps directly in SQLite Prisma easily, 
    // so we will fetch and filter in memory for 'skill'

    let teams = await prisma.team.findMany({
      where: whereClause,
      include: {
        members: { include: { user: { include: { profile: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (skill) {
      teams = teams.filter(t => {
        try {
          const required = JSON.parse(t.requiredSkills || "[]")
          return required.some((s: string) => s.toLowerCase().includes(skill.toLowerCase()))
        } catch { return false }
      })
    }

    return NextResponse.json(teams)

  } catch (error) {
    console.error("Discover error:", error)
    return NextResponse.json({ error: "Failed to fetch discovery data" }, { status: 500 })
  }
}
