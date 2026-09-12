import { NextResponse } from 'next/server'
import { SynqAI } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const { teamRoles, members } = await request.json()
    const analysis = await SynqAI.analyzeTeamGap(teamRoles || [], members || [])
    return NextResponse.json({ analysis })
  } catch (e) {
    return NextResponse.json({ error: "AI failed to process" }, { status: 500 })
  }
}
