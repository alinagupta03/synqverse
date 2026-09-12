import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

async function verifyMember(workspaceId: string) {
  return await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: MOCK_USER_ID } }
  })
}

// Evaluate internal score based on text lengths and keywords (simulated engine)
function calculateIdeaScore(data: any) {
  let score = 0
  if (data.problem?.length > 50) score += 20
  if (data.solution?.length > 100) score += 25
  if (data.targetUsers?.length > 10) score += 15
  if (data.technology?.length > 10) score += 15
  if (data.expectedImpact?.length > 20) score += 25
  return Math.min(score, 100)
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const ideas = await prisma.idea.findMany({
    where: { workspaceId: id },
    include: {
      author: { select: { anonymousId: true } },
      votes: { select: { userId: true, value: true } },
      _count: { select: { comments: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Format ideas with net votes
  const formatted = ideas.map(idea => ({
    ...idea,
    upvotes: idea.votes.filter(v => v.value === 1).length,
    downvotes: idea.votes.filter(v => v.value === -1).length,
    netScore: idea.votes.reduce((acc, v) => acc + v.value, 0),
    userVote: idea.votes.find(v => v.userId === MOCK_USER_ID)?.value || 0
  }))

  return NextResponse.json(formatted)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!await verifyMember(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const body = await request.json()
  const { title, problem, solution, targetUsers, technology, expectedImpact } = body

  if (!title || !problem || !solution) {
    return NextResponse.json({ error: "Title, problem, and solution are required" }, { status: 400 })
  }

  // AI-simulated evaluation vectors
  const score = calculateIdeaScore(body)
  const feasibility = Math.ceil((score / 100) * 10)
  const businessPotential = Math.ceil(((score + 10) / 100) * 10)
  const innovationLevel = Math.ceil(((score + 5) / 100) * 10)

  const idea = await prisma.idea.create({
    data: {
      workspaceId: id,
      authorId: MOCK_USER_ID,
      title, problem, solution, targetUsers, technology, expectedImpact,
      score, feasibility, businessPotential, innovationLevel,
      status: 'ACTIVE'
    }
  })

  await prisma.workspaceActivity.create({
    data: { workspaceId: id, actorId: MOCK_USER_ID, type: 'IDEA_CREATED', message: `Proposed a new idea: "${title}"`, referenceId: idea.id }
  })

  return NextResponse.json({ success: true, idea })
}
