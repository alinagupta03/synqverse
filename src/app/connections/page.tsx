"use client"

import { useState, useEffect } from "react"
import { BrandLogo } from "@/components/ui/BrandLogo"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Connection = {
  id: string
  senderId: string
  receiverId: string
  status: string
  createdAt: string
  sender: { anonymousId: string | null; academic?: { branch: string | null; stream?: string | null; year: string | null; universityName?: string | null } | null }
  receiver: { anonymousId: string | null; academic?: { branch: string | null; stream?: string | null; year: string | null; universityName?: string | null } | null }
}

const TABS = ["received", "sent", "connections"] as const
type Tab = typeof TABS[number]

export default function ConnectionsPage() {
  const [tab, setTab] = useState<Tab>("received")
  const [items, setItems] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConnections()
  }, [tab])

  const fetchConnections = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/connections?type=${tab}`)
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (connectionId: string, action: string) => {
    try {
      await fetch("/api/connections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId, action })
      })
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("synq-activity-update"))
      }
      fetchConnections()
    } catch (err) {
      console.error("Failed to update connection:", err)
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
             <Link href="/connections" className="text-foreground font-medium">Connections</Link>
             <Link href="/messages" className="text-muted-foreground hover:text-foreground transition-colors">Messages</Link>
           </nav>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-xs font-bold text-blue-400">ME</div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">My Network & Connections</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your incoming requests, pending invites, and active connections.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 sm:px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px whitespace-nowrap ${
                tab === t
                  ? "border-orange-500 text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "connections" ? "My Connections" : t === "received" ? "Received" : "Sent"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center border border-border rounded-2xl bg-card p-6">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {tab === "received" ? "No pending requests" : tab === "sent" ? "No sent requests" : "No connections yet"}
            </h3>
            <p className="text-muted-foreground max-w-sm mb-6 text-sm sm:text-base">
              {tab === "connections" ? "Connect with talented peers in the Discover section." : "Nothing here yet."}
            </p>
            {tab === "connections" && (
              <Link href="/discover">
                <Button className="bg-orange-500 text-white hover:bg-orange-600 font-bold">Discover Students</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(item => {
              const otherUser = tab === "received"
                ? item.sender
                : tab === "sent"
                  ? item.receiver
                  : (item.senderId === "current-user-id" ? item.receiver : item.sender)

              const displayName = otherUser?.anonymousId || (otherUser as any)?.name || "Anonymous Student"
              const branch = otherUser?.academic?.branch || "Engineering"
              const stream = otherUser?.academic?.stream || ""
              const year = otherUser?.academic?.year || ""
              const academicSummary = [branch, stream, year].filter(Boolean).join(" • ")

              return (
                <div 
                  key={item.id} 
                  className="p-4 sm:p-5 glass rounded-2xl border border-border hover:border-border/80 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card text-card-foreground"
                >
                  <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-sm font-bold text-orange-500 shrink-0">
                      {displayName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "ST"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground truncate text-base">{displayName}</h3>
                      <p className="text-sm text-muted-foreground truncate">{academicSummary}</p>
                      {tab === "received" && (
                        <p className="text-xs text-orange-500 dark:text-orange-400 mt-0.5 font-medium">Wants to connect with you</p>
                      )}
                      {tab === "sent" && (
                        <p className="text-xs text-muted-foreground mt-0.5">Request pending approval</p>
                      )}
                      {tab === "connections" && (
                        <p className="text-xs text-green-500 dark:text-green-400 mt-0.5 font-medium">Active Connection</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    {tab === "received" && (
                      <>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4" 
                          onClick={() => handleAction(item.id, "ACCEPT")}
                        >
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-border hover:bg-muted font-medium px-4" 
                          onClick={() => handleAction(item.id, "DECLINE")}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {tab === "sent" && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-border hover:bg-muted font-medium px-4 text-xs" 
                        onClick={() => handleAction(item.id, "CANCEL")}
                      >
                        Cancel Request
                      </Button>
                    )}
                    {tab === "connections" && (
                      <Link href="/messages" className="w-full sm:w-auto">
                        <Button size="sm" className="w-full sm:w-auto bg-orange-500 text-white hover:bg-orange-600 font-bold px-4">
                          Message
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
