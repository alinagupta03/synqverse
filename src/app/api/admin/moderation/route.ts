import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      where: { status: 'OPEN' },
      include: {
        reporter: { select: { anonymousId: true } },
        reportedUser: { select: { anonymousId: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(reports)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}
