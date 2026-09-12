import { NextResponse } from 'next/server'
import { SynqAI } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const { notes } = await request.json()
    const summary = await SynqAI.summarizeMeeting(notes)
    return NextResponse.json({ summary })
  } catch (e) {
    return NextResponse.json({ error: "AI failed to process" }, { status: 500 })
  }
}
