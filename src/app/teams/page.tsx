"use client"

import { useState, useEffect } from "react"
import { BrandLogo } from "@/components/ui/BrandLogo"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const CATEGORIES = ["All", "Hackathon", "Startup", "Research", "College Project", "Competition", "Open Source", "Other"]
const CATEGORY_COLORS: Record<string, string> = {
  Hackathon: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  Startup: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Research: "text-green-400 bg-green-400/10 border-green-400/20",
  "College Project": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Competition: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "Open Source": "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  Other: "text-slate-400 bg-slate-400/10 border-slate-400/20",
}

type Team = {
  id: string
  name: string
  projectIdea: string | null
  description: string | null
  category: string
  targetSize: number
  requiredSkills: string
  branchPreference: string | null
  owner: { anonymousId: string | null }
  members: { status: string }[]
  roles: { roleName: string; count: number; filled: number }[]
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("All")

  useEffect(() => {
    const params = new URLSearchParams()
    if (category !== "All") params.set("category", category)
    fetch(`/api/teams?${params}`)
      .then(r => r.json())
      .then(d => setTeams(Array.isArray(d) ? d : []))
      .catch(() => setTeams([]))
      .finally(() => setLoading(false))
  }, [category])

  return (
    <div className="min-h-screen bg-gray-50 text-foreground flex flex-col">
      <header className="h-16 border-b border-gray-200 flex items-center px-6 justify-between glass sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/dashboard"><BrandLogo showText={false} /></Link>
          <nav className="hidden md:flex gap-6 text-sm">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 transition-colors">Dashboard</Link>
            <Link href="/discover" className="text-gray-500 hover:text-gray-900 transition-colors">Discover</Link>
            <Link href="/teams" className="text-gray-900 font-medium">Teams</Link>
            <Link href="/messages" className="text-gray-500 hover:text-gray-900 transition-colors">Messages</Link>
          </nav>
        </div>
        <Link href="/teams/new">
          <Button className="bg-orange-500 text-white hover:bg-orange-600 gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Create Team
          </Button>
        </Link>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Open Teams</h1>
          <p className="text-gray-500">Find a team looking for your skills, or create your own.</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                category === c
                  ? "bg-white text-black border-white"
                  : "border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-gray-200 rounded-2xl bg-gray-50">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">No open teams yet</h3>
            <p className="text-gray-500 max-w-sm mb-6">Be the first to create a team and find your collaborators.</p>
            <Link href="/teams/new">
              <Button className="bg-orange-500 text-white hover:bg-orange-600">Create a Team</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {teams.map(team => {
              const activeCount = team.members.filter(m => m.status === "ACTIVE").length
              const pct = Math.round((activeCount / team.targetSize) * 100)
              const catColor = CATEGORY_COLORS[team.category] || CATEGORY_COLORS.Other
              const skills = team.requiredSkills ? team.requiredSkills.split(",").filter(Boolean) : []

              return (
                <Link href={`/teams/${team.id}`} key={team.id}>
                  <div className="p-6 glass rounded-2xl border border-gray-200 hover:border-gray-300 transition-all h-full flex flex-col group cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-xs px-2 py-1 rounded border font-medium ${catColor}`}>{team.category}</span>
                      <span className="text-xs text-gray-500">{activeCount}/{team.targetSize} members</span>
                    </div>

                    <h2 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-400 transition-colors">{team.name}</h2>
                    {team.projectIdea && (
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{team.projectIdea}</p>
                    )}

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    {/* Role slots */}
                    {team.roles.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {team.roles.slice(0, 4).map(r => (
                          <span key={r.roleName} className={`text-xs px-2 py-0.5 rounded border ${r.filled >= r.count ? "border-green-500/30 text-green-400" : "border-gray-200 text-gray-500"}`}>
                            {r.roleName}
                          </span>
                        ))}
                        {team.roles.length > 4 && <span className="text-xs text-gray-500">+{team.roles.length - 4}</span>}
                      </div>
                    )}

                    {/* Required skills */}
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {skills.slice(0, 3).map(s => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-900/70">{s}</span>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                      by {team.owner.anonymousId || "Anonymous"}
                    </div>
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
