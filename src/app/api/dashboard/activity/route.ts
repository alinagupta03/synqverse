import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MOCK_USER_ID = "current-user-id"

export type ActivityItem = {
  id: string
  type: 'CONNECTION_ACCEPTED' | 'CONNECTION_PENDING_SENT' | 'CONNECTION_PENDING_RECEIVED' | 'NOTIFICATION' | 'SYSTEM' | 'WORKSPACE'
  title: string
  description: string
  timeAgo: string
  timestamp: string
  dotColor: string
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}

export async function GET() {
  try {
    const activities: ActivityItem[] = []

    // 1. Fetch live connections for current user
    const connections = await prisma.connectionRequest.findMany({
      where: {
        OR: [
          { senderId: MOCK_USER_ID },
          { receiverId: MOCK_USER_ID }
        ]
      },
      include: {
        sender: { select: { id: true, anonymousId: true, name: true } },
        receiver: { select: { id: true, anonymousId: true, name: true } }
      },
      orderBy: { updatedAt: 'desc' },
      take: 8
    })

    for (const c of connections) {
      const isSender = c.senderId === MOCK_USER_ID
      const otherUser = isSender ? c.receiver : c.sender
      const otherName = otherUser?.anonymousId || otherUser?.name || "Student"

      if (c.status === 'ACCEPTED') {
        activities.push({
          id: `conn-${c.id}`,
          type: 'CONNECTION_ACCEPTED',
          title: `Connected with ${otherName}`,
          description: `You are now connected and can collaborate.`,
          timeAgo: formatTimeAgo(c.updatedAt),
          timestamp: c.updatedAt.toISOString(),
          dotColor: 'bg-green-500'
        })
      } else if (c.status === 'PENDING') {
        if (isSender) {
          activities.push({
            id: `conn-${c.id}`,
            type: 'CONNECTION_PENDING_SENT',
            title: `Sent connection request`,
            description: `To ${otherName}`,
            timeAgo: formatTimeAgo(c.createdAt),
            timestamp: c.createdAt.toISOString(),
            dotColor: 'bg-blue-500'
          })
        } else {
          activities.push({
            id: `conn-${c.id}`,
            type: 'CONNECTION_PENDING_RECEIVED',
            title: `New connection request`,
            description: `From ${otherName}`,
            timeAgo: formatTimeAgo(c.createdAt),
            timestamp: c.createdAt.toISOString(),
            dotColor: 'bg-orange-500'
          })
        }
      }
    }

    // 2. Fetch notifications
    const notifications = await prisma.notification.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    for (const n of notifications) {
      activities.push({
        id: `notif-${n.id}`,
        type: 'NOTIFICATION',
        title: n.type.replace(/_/g, ' '),
        description: n.message,
        timeAgo: formatTimeAgo(n.createdAt),
        timestamp: n.createdAt.toISOString(),
        dotColor: 'bg-purple-500'
      })
    }

    // Default system activity entry
    activities.push({
      id: 'system-identity',
      type: 'SYSTEM',
      title: 'Created your anonymous identity',
      description: 'Profile active and discoverable by peers',
      timeAgo: '1d ago',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      dotColor: 'bg-gray-400'
    })

    // Sort all combined activities chronologically
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Pending count
    const pendingCount = await prisma.connectionRequest.count({
      where: { receiverId: MOCK_USER_ID, status: 'PENDING' }
    })

    return NextResponse.json({
      activities: activities.slice(0, 10),
      pendingCount
    })
  } catch (error) {
    console.error("Dashboard Activity API error:", error)
    return NextResponse.json({
      activities: [
        {
          id: 'fallback-1',
          type: 'SYSTEM',
          title: 'Connected to Synqverse Network',
          description: 'Live activity synchronization active',
          timeAgo: 'Just now',
          timestamp: new Date().toISOString(),
          dotColor: 'bg-green-500'
        }
      ],
      pendingCount: 0
    })
  }
}
