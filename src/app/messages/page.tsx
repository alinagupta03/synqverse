"use client"

import { useState, useEffect } from "react"
import { BrandLogo } from "@/components/ui/BrandLogo"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type ConversationPreview = {
  id: string
  updatedAt: string
  participants: { userId: string; user: { anonymousId: string | null; profile: { anonymousMode: boolean } | null } }[]
  messages: { content: string; senderId: string; createdAt: string }[]
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationPreview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/messages")
      const data = await res.json()
      setConversations(Array.isArray(data) ? data : [])
    } catch {
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-border flex items-center px-6 justify-between glass sticky top-0 z-50">
        <div className="flex items-center gap-8">
           <Link href="/dashboard"><BrandLogo showText={false} /></Link>
           <nav className="hidden md:flex gap-6 text-sm">
             <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
             <Link href="/discover" className="text-muted-foreground hover:text-foreground transition-colors">Discover</Link>
             <Link href="/connections" className="text-muted-foreground hover:text-foreground transition-colors">Connections</Link>
             <Link href="/messages" className="text-foreground font-medium">Messages</Link>
           </nav>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-xs font-bold text-blue-400">ME</div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Messages</h1>
          <p className="text-muted-foreground">Your private conversations.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-border rounded-2xl bg-muted">
            <div className="w-16 h-16 rounded-full bg-gray-100 border border-border flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Connect with students to start a conversation. Every great team starts with a message.
            </p>
            <Link href="/discover">
              <Button className="bg-orange-500 text-white hover:bg-orange-600">Discover Students</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map(convo => {
              const other = convo.participants.find(p => p.userId !== "current-user-id")
              const lastMsg = convo.messages[0]
              return (
                <Link href={`/messages/${convo.id}`} key={convo.id}>
                  <div className="p-4 glass rounded-2xl border border-border hover:border-gray-300 transition-all flex items-center gap-4 cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-400 flex-shrink-0">
                      {(other?.user.anonymousId || "?").charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{other?.user.anonymousId || "Anonymous Student"}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {lastMsg ? (lastMsg.senderId === "current-user-id" ? "You: " : "") + lastMsg.content : "No messages yet"}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {lastMsg ? new Date(lastMsg.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
