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
  sender: { anonymousId: string | null; academic?: { branch: string | null; year: string | null } | null }
  receiver: { anonymousId: string | null; academic?: { branch: string | null; year: string | null } | null }
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
    await fetch("/api/connections", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connectionId, action })
    })
    fetchConnections()
  }

  return (
    <div className="min-h-screen bg-gray-50 text-foreground flex flex-col">
      <header className="h-16 border-b border-gray-200 flex items-center px-6 justify-between glass sticky top-0 z-50">
        <div className="flex items-center gap-8">
           <Link href="/dashboard"><BrandLogo showText={false} /></Link>
           <nav className="hidden md:flex gap-6 text-sm">
             <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 transition-colors">Dashboard</Link>
             <Link href="/discover" className="text-gray-500 hover:text-gray-900 transition-colors">Discover</Link>
             <Link href="/connections" className="text-gray-900 font-medium">Connections</Link>
             <Link href="/messages" className="text-gray-500 hover:text-gray-900 transition-colors">Messages</Link>
           </nav>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-xs font-bold text-blue-400">ME</div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Connections</h1>
          <p className="text-gray-500">Manage your network requests and connections.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                tab === t
                  ? "border-blue-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {t === "connections" ? "My Connections" : t === "received" ? "Received" : "Sent"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-gray-200 rounded-2xl bg-gray-50">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {tab === "received" ? "No pending requests" : tab === "sent" ? "No sent requests" : "No connections yet"}
            </h3>
            <p className="text-gray-500 max-w-sm mb-6">
              {tab === "connections" ? "Your next teammate is out there." : "Nothing here yet."}
            </p>
            {tab === "connections" && (
              <Link href="/discover">
                <Button className="bg-orange-500 text-white hover:bg-orange-600">Discover Students</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(item => {
              const isReceived = tab === "received"
              const otherUser = isReceived ? item.sender : item.receiver
              return (
                <div key={item.id} className="p-5 glass rounded-2xl border border-gray-200 hover:border-gray-300 transition-all flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-0.5">{otherUser.anonymousId || "Anonymous Student"}</h3>
                    <p className="text-sm text-gray-500">
                      {otherUser.academic?.branch} • {otherUser.academic?.year}
                    </p>
                    {isReceived && (
                      <p className="text-xs text-gray-500 mt-1">wants to connect with you.</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {tab === "received" && (
                      <>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-gray-900" onClick={() => handleAction(item.id, "ACCEPT")}>Accept</Button>
                        <Button size="sm" variant="outline" className="border-gray-200 text-gray-900 hover:bg-gray-100" onClick={() => handleAction(item.id, "DECLINE")}>Decline</Button>
                      </>
                    )}
                    {tab === "sent" && (
                      <Button size="sm" variant="outline" className="border-gray-200 text-gray-900 hover:bg-gray-100" onClick={() => handleAction(item.id, "CANCEL")}>Cancel</Button>
                    )}
                    {tab === "connections" && (
                      <Link href="/messages">
                        <Button size="sm" className="bg-orange-500 text-white hover:bg-orange-600">Message</Button>
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
