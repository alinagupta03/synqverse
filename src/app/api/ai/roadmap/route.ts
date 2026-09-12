import { NextResponse } from 'next/server'
import { SynqAI } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const { description } = await request.json()
    const milestones = await SynqAI.generateRoadmap(description)
    return NextResponse.json({ milestones })
  } catch (e) {
    return NextResponse.json({ error: "AI failed to process" }, { status: 500 })
  }
}
