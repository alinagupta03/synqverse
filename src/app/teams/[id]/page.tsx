"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { BrandLogo } from "@/components/ui/BrandLogo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

const CATEGORY_COLORS: Record<string, string> = {
  Hackathon: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  Startup: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Research: "text-green-400 bg-green-400/10 border-green-400/20",
  "College Project": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Competition: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "Open Source": "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  Other: "text-slate-400 bg-slate-400/10 border-slate-400/20",
}

type TeamDetail = {
  id: string
  name: string
  projectIdea: string | null
  description: string | null
  category: string
  targetSize: number
  isOpen: boolean
  ownerId: string
  owner: { id: string; anonymousId: string | null }
  members: { id: string; status: string; role: string; user: { id: string; anonymousId: string | null; academic: { branch: string | null; year: string | null } | null; skills: { skill: { name: string } }[] } }[]
  roles: { id: string; roleName: string; count: number; filled: number }[]
  invites: { id: string; status: string; invitee: { id: string; anonymousId: string | null } }[]
}

type Candidate = {
  id: string
  anonymousId: string
  branch: string | null
  year: string | null
  skills: string[]
  matchScore: number
  matchExplanation: string
  suggestedRole: string | null
}

const MOCK_USER_ID = "current-user-id"

export default function TeamDetailPage() {
  const params = useParams()
  const teamId = params?.id as string

  const [team, setTeam] = useState<TeamDetail | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"members" | "candidates" | "invites">("members")

  const fetchTeam = async () => {
    const res = await fetch(`/api/teams/${teamId}`)
    const data = await res.json()
    if (!data.error) setTeam(data)
    setLoading(false)
  }

  const fetchCandidates = async () => {
    const res = await fetch(`/api/teams/${teamId}/candidates`)
    const data = await res.json()
    setCandidates(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    fetchTeam()
    fetchCandidates()
  }, [teamId])

  const handleInvite = async (inviteeId: string) => {
    setInviting(inviteeId)
    try {
      const res = await fetch(`/api/teams/${teamId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteeId })
      })
      const data = await res.json()
      if (data.error) alert(data.error)
      else { fetchTeam(); fetchCandidates() }
    } finally {
      setInviting(null)
    }
  }

  const handleCancelInvite = async (inviteeId: string) => {
    await fetch(`/api/teams/${teamId}/invite`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteeId })
    })
    fetchTeam()
  }

  const handleRemoveMember = async (userId: string) => {
    await fetch(`/api/teams/${teamId}/members`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: "REMOVE" })
    })
    fetchTeam()
  }

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!team) {
    return (
      <div className="h-screen bg-background flex items-center justify-center text-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Team not found</h2>
          <Link href="/teams"><Button variant="outline" className="border-border text-foreground">Back to Teams</Button></Link>
        </div>
      </div>
    )
  }

  const activeMembers = team.members.filter(m => m.status === "ACTIVE")
  const isComplete = activeMembers.length >= team.targetSize
  const isOwner = team.ownerId === MOCK_USER_ID
  const pct = Math.round((activeMembers.length / team.targetSize) * 100)
  const catColor = CATEGORY_COLORS[team.category] || CATEGORY_COLORS.Other

  // Premium team completion state
  if (isComplete) {
    return (
      <div className="h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          {/* Glow orb */}
          <div className="relative mx-auto w-32 h-32 mb-8">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl animate-pulse" />
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-blue-500/40 flex items-center justify-center text-5xl">
              🎯
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Your team is ready.
          </h1>
          <p className="text-xl text-muted-foreground mb-2">{team.name}</p>
          <p className="text-lg text-blue-400 mb-8">
            {activeMembers.length} builders. 1 idea. Let&apos;s make it real.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {activeMembers.map(m => (
              <div key={m.id} className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">
                {(m.user.anonymousId || "?").slice(-2)}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-orange-500 text-white hover:bg-orange-600 px-8" onClick={async () => {
              const res = await fetch('/api/workspace', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamId })
              })
              const data = await res.json()
              if (data.workspaceId) {
                window.location.href = `/workspace/${data.workspaceId}`
              } else if (data.error) {
                alert(data.error)
              }
            }}>
              Create Workspace
            </Button>
            <Link href="/teams">
              <Button variant="outline" className="border-border text-foreground hover:bg-gray-100">
                Browse Teams
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-border flex items-center px-6 justify-between glass sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/teams" className="text-muted-foreground hover:text-foreground transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <BrandLogo showText={false} />
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-xs font-bold text-blue-400">ME</div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Team info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={`text-xs px-2 py-1 rounded border font-medium ${catColor}`}>{team.category}</span>
                <h1 className="text-3xl font-bold tracking-tight mt-2">{team.name}</h1>
                {team.projectIdea && <p className="text-muted-foreground mt-1 italic">&ldquo;{team.projectIdea}&rdquo;</p>}
              </div>
              {isOwner && (
                <span className="text-xs px-2 py-1 rounded border border-yellow-500/30 text-yellow-400 bg-yellow-400/10 whitespace-nowrap">Team Owner</span>
              )}
            </div>
            {team.description && <p className="text-sm text-muted-foreground leading-relaxed">{team.description}</p>}
          </div>

          {/* Progress */}
          <div className="p-5 glass rounded-2xl border border-border">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">Team Completion</h2>
              <span className="text-sm font-mono text-muted-foreground">{activeMembers.length} / {team.targetSize}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, type: "spring" }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
            </div>
            <p className="text-xs text-muted-foreground">{team.targetSize - activeMembers.length} spots remaining</p>
          </div>

          {/* Required Roles */}
          {team.roles.length > 0 && (
            <div className="p-5 glass rounded-2xl border border-border">
              <h2 className="font-semibold mb-4">Required Roles</h2>
              <div className="space-y-3">
                {team.roles.map(r => (
                  <div key={r.id} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{r.roleName}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {Array.from({ length: r.count }).map((_, i) => (
                          <div key={i} className={`w-3 h-3 rounded-full border ${i < r.filled ? "bg-green-500 border-green-500" : "bg-transparent border-gray-300"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{r.filled}/{r.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-border flex">
            {(["members", ...(isOwner ? ["candidates", "invites"] : [])] as typeof activeTab[]).map(t => (
              <button key={t} onClick={() => setActiveTab(t as typeof activeTab)}
                className={`px-5 py-3 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${activeTab === t ? "border-blue-500 text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                {t === "candidates" ? "Smart Matches" : t.charAt(0).toUpperCase() + t.slice(1)}
                {t === "invites" && team.invites.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400">{team.invites.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Members Tab */}
          {activeTab === "members" && (
            <div className="space-y-3">
              {activeMembers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No active members yet.</div>
              ) : (
                activeMembers.map(m => (
                  <div key={m.id} className="p-4 glass rounded-xl border border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">
                        {(m.user.anonymousId || "?").slice(-2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{m.user.anonymousId || "Anonymous"}</p>
                        <p className="text-xs text-muted-foreground">{m.user.academic?.branch} • {m.user.academic?.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {m.role === "TEAM_OWNER" && (
                        <span className="text-xs px-2 py-0.5 rounded border border-yellow-500/30 text-yellow-400">Owner</span>
                      )}
                      {isOwner && m.user.id !== MOCK_USER_ID && (
                        <button onClick={() => handleRemoveMember(m.user.id)} className="text-xs text-muted-foreground hover:text-red-400 transition-colors px-2">Remove</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Candidates Tab */}
          {activeTab === "candidates" && isOwner && (
            <div className="space-y-3">
              {candidates.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No candidates available.</div>
              ) : (
                candidates.map(c => (
                  <div key={c.id} className="p-5 glass rounded-xl border border-border hover:border-gray-300 transition-all">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{c.anonymousId}</h3>
                        <p className="text-xs text-muted-foreground">{c.branch} • {c.year}</p>
                        {c.suggestedRole && (
                          <span className="text-xs px-2 py-0.5 rounded border border-blue-500/30 text-blue-400 mt-1 inline-block">{c.suggestedRole}</span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs font-mono px-2 py-0.5 rounded ${c.matchScore > 70 ? "text-green-400 bg-green-400/10" : "text-yellow-400 bg-yellow-400/10"}`}>{c.matchScore}%</span>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-foreground text-xs"
                          disabled={inviting === c.id}
                          onClick={() => handleInvite(c.id)}
                        >
                          {inviting === c.id ? "Sending..." : "Invite"}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-blue-200/60 bg-blue-900/20 p-2 rounded border border-blue-900/30 italic">{c.matchExplanation}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {c.skills.slice(0, 4).map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded bg-gray-100 border border-border text-foreground/70">{s}</span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Invites Tab */}
          {activeTab === "invites" && isOwner && (
            <div className="space-y-3">
              {team.invites.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No pending invites.</div>
              ) : (
                team.invites.map(inv => (
                  <div key={inv.id} className="p-4 glass rounded-xl border border-border flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{inv.invitee.anonymousId || "Anonymous"}</p>
                      <p className="text-xs text-yellow-400">Pending</p>
                    </div>
                    <button onClick={() => handleCancelInvite(inv.invitee.id)} className="text-xs text-muted-foreground hover:text-red-400 transition-colors">Cancel</button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          <div className="p-5 glass rounded-2xl border border-border">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`text-xs px-2 py-0.5 rounded border ${team.isOpen ? "border-green-500/30 text-green-400" : "border-red-500/30 text-red-400"}`}>
                  {team.isOpen ? "Open" : "Closed"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target Size</span>
                <span className="text-foreground">{team.targetSize} members</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current</span>
                <span className="text-foreground">{activeMembers.length} active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Owner</span>
                <span className="text-foreground">{team.owner.anonymousId || "Anonymous"}</span>
              </div>
            </div>
          </div>

          {!isOwner && team.isOpen && (
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-foreground">
              Request to Join
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
