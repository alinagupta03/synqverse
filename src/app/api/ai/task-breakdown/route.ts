import { NextResponse } from 'next/server'
import { SynqAI } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const { description } = await request.json()
    const tasks = await SynqAI.breakdownTask(description)
    return NextResponse.json({ tasks })
  } catch (e) {
    return NextResponse.json({ error: "AI failed to process" }, { status: 500 })
  }
}
