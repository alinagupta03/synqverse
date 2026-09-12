import { NextResponse } from 'next/server'
import { SynqAI } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const { problem, solution } = await request.json()
    const feedback = await SynqAI.improveProjectIdea(problem, solution)
    return NextResponse.json({ feedback })
  } catch (e) {
    return NextResponse.json({ error: "AI failed to process" }, { status: 500 })
  }
}
