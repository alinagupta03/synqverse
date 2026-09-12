import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

export async function POST(request: Request) {
  try {
    const { eventName, metadata } = await request.json()

    if (!eventName) {
      return NextResponse.json({ error: "Missing eventName" }, { status: 400 })
    }

    // Server-side logging to the AnalyticsEvent table
    await prisma.analyticsEvent.create({
      data: {
        eventName,
        userId: MOCK_USER_ID, // Link for aggregated metrics, but metadata avoids PII
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 })
  }
}
