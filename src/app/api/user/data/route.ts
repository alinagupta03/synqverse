import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

export async function GET() {
  try {
    // Generate full data export
    const userData = await prisma.user.findUnique({
      where: { id: MOCK_USER_ID },
      include: {
        profile: true,
        academic: true,
        skills: true,
        interests: true,
        ownedTeams: true,
        teamMemberships: true
      }
    })
    
    // Convert to JSON blob
    return new NextResponse(JSON.stringify(userData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="synqverse-export.json"'
      }
    })
  } catch (error) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    // Cascading delete using Prisma (handles profile, messages, teams if properly configured, else manually)
    // Note: Due to complex relations, real-world apps might use soft-delete. 
    // We update deletedAt for a soft delete here.
    await prisma.user.update({
      where: { id: MOCK_USER_ID },
      data: { deletedAt: new Date() }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 })
  }
}
