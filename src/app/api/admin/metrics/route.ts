import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const totalUsers = await prisma.user.count()
    const totalTeams = await prisma.team.count()
    const totalWorkspaces = await prisma.workspace.count()
    const totalProjects = await prisma.project.count()
    const totalSubmissions = await prisma.innovationSubmission.count()
    const openReports = await prisma.report.count({ where: { status: 'OPEN' } })

    // Aggregate recent analytics events for growth chart mock
    const recentSignups = await prisma.analyticsEvent.count({
      where: {
        eventName: 'USER_SIGNUP',
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    })

    return NextResponse.json({
      metrics: {
        totalUsers,
        totalTeams,
        totalWorkspaces,
        totalProjects,
        totalSubmissions,
        openReports,
        recentSignups
      }
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
