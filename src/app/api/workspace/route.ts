import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

export async function POST(request: Request) {
  try {
    const { teamId } = await request.json()
    if (!teamId) return NextResponse.json({ error: "teamId required" }, { status: 400 })

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: { where: { status: 'ACTIVE' } }, workspace: true }
    })

    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 })
    if (team.ownerId !== MOCK_USER_ID) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    if (team.workspace) return NextResponse.json({ workspaceId: team.workspace.id }, { status: 200 }) // already exists

    const workspace = await prisma.workspace.create({
      data: {
        teamId,
        name: team.name,
        description: team.projectIdea || team.description,
        deadline: team.deadline,
        // Auto-add all active team members
        members: {
          create: team.members.map(m => ({
            userId: m.userId,
            role: m.userId === team.ownerId ? 'OWNER' : 'MEMBER'
          }))
        },
        // Create default channels
        channels: {
          create: [
            { name: 'general', description: 'Team-wide announcements and conversations', isDefault: true },
            { name: 'ideas', description: 'Brainstorm and share ideas' },
            { name: 'technical', description: 'Technical discussions and code reviews' },
            { name: 'design', description: 'Design discussions and feedback' },
            { name: 'research', description: 'Research notes and references' },
            { name: 'random', description: 'Off-topic conversations' },
          ]
        },
        // Default roadmap milestones
        milestones: {
          create: [
            { title: 'Research & Planning', phase: 'Research', status: 'UPCOMING', order: 0 },
            { title: 'Prototype', phase: 'Prototype', status: 'UPCOMING', order: 1 },
            { title: 'MVP Build', phase: 'MVP', status: 'UPCOMING', order: 2 },
            { title: 'Testing & QA', phase: 'Testing', status: 'UPCOMING', order: 3 },
            { title: 'Demo Preparation', phase: 'Presentation', status: 'UPCOMING', order: 4 },
            { title: 'Launch', phase: 'Launch', status: 'UPCOMING', order: 5 },
          ]
        },
        // Initial activity
        activities: {
          create: {
            actorId: MOCK_USER_ID,
            type: 'WORKSPACE_CREATED',
            message: `Workspace "${team.name}" was created.`,
          }
        }
      }
    })

    return NextResponse.json({ success: true, workspaceId: workspace.id })
  } catch (error) {
    console.error("Workspace create error:", error)
    return NextResponse.json({ error: "Failed to create workspace" }, { status: 500 })
  }
}
