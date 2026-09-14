import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const submissions = await prisma.innovationSubmission.findMany({
      include: {
        team: { select: { name: true, category: true } },
        project: { select: { stage: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(submissions)
  } catch (error: any) {
    return NextResponse.json({ 
      error: "Failed to fetch submissions",
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
