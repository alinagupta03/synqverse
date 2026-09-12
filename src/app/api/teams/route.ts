import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { rateLimit } from '@/lib/rate-limit'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const branch = searchParams.get('branch')
    const stream = searchParams.get('stream')

    const teams = await prisma.team.findMany({
      where: {
        isOpen: true,
        ...(category && { category }),
        ...(branch && { branchPreference: branch }),
        ...(stream && { streamPreference: stream }),
      },
      include: {
        owner: { select: { anonymousId: true } },
        members: { where: { status: 'ACTIVE' } },
        roles: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(teams)
  } catch (error) {
    console.error("Teams GET error:", error)
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1"
    if (!rateLimit(`create_team_${ip}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const body = await request.json()
    const {
      name, projectIdea, description, category, targetSize,
      requiredSkills, branchPreference, streamPreference,
      availability, deadline, roles
    } = body

    if (!name || !category) {
      return NextResponse.json({ error: "Name and category are required" }, { status: 400 })
    }

    const team = await prisma.team.create({
      data: {
        ownerId: MOCK_USER_ID,
        name,
        projectIdea,
        description,
        category,
        targetSize: targetSize || 6,
        requiredSkills: Array.isArray(requiredSkills) ? requiredSkills.join(',') : (requiredSkills || ''),
        branchPreference,
        streamPreference,
        availability,
        deadline: deadline ? new Date(deadline) : null,
        isOpen: true,
        // Add owner as first active member
        members: {
          create: {
            userId: MOCK_USER_ID,
            role: "TEAM_OWNER",
            status: "ACTIVE",
          }
        },
        // Create role slots
        roles: roles?.length ? {
          create: roles.map((r: { roleName: string; count: number }) => ({
            roleName: r.roleName,
            count: r.count,
            filled: 0,
          }))
        } : undefined,
      },
      include: { members: true, roles: true },
    })

    return NextResponse.json({ success: true, team })
  } catch (error) {
    console.error("Teams POST error:", error)
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 })
  }
}
