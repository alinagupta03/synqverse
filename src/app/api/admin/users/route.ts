import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    let whereClause = {}
    if (query) {
      whereClause = {
        OR: [
          { email: { contains: query } },
          { anonymousId: { contains: query } }
        ]
      }
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        profile: { select: { experienceLevel: true } },
        moderationActions: { where: { status: 'ACTIVE' } }
      },
      take: 50,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
