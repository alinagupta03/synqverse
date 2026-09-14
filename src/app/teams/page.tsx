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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-border flex items-center px-6 justify-between glass sticky top-0 z-50">
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
          <div className="flex flex-col items-center justify-center py-24 text-center border border-border rounded-2xl bg-card">
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
                <Link href={`/teams/${team.id}`} key={team.id} className="block h-full group">
                  <div className="p-6 glass bg-card text-card-foreground rounded-2xl border border-border hover:border-orange-500 hover:shadow-xl transition-all h-full flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-orange-500/10 transition-colors"></div>
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <span className={`text-xs px-2.5 py-1 rounded-md border font-semibold tracking-wide uppercase ${catColor}`}>{team.category}</span>
                    </div>

                    <h2 className="font-extrabold text-xl text-[#111827] dark:text-white mb-2 group-hover:text-orange-600 transition-colors relative z-10">{team.name}</h2>
                    
                    <div className="mb-4 relative z-10">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Project Vision</p>
                       <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                         {team.projectIdea || team.description || "No vision provided."}
                       </p>
                    </div>

                    {/* Progress Status */}
                    <div className="mb-5 relative z-10">
                      <div className="flex justify-between items-end mb-1.5">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress Status</p>
                         <span className="text-xs font-semibold text-gray-700">{pct}% Complete</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    {/* Open Roles */}
                    <div className="mb-5 relative z-10">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Open Roles</p>
                      {team.roles.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {team.roles.slice(0, 4).map(r => (
                            <span key={r.roleName} className={`text-xs px-2.5 py-1 rounded-md border shadow-sm ${r.filled >= r.count ? "bg-green-50 border-green-200 text-green-700 font-medium" : "bg-white border-gray-200 text-gray-700"}`}>
                              {r.roleName} {r.filled}/{r.count}
                            </span>
                          ))}
                          {team.roles.length > 4 && <span className="text-xs text-gray-500 px-2 py-1 bg-gray-50 rounded-md border border-gray-200">+{team.roles.length - 4}</span>}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 italic">No specific roles listed</p>
                      )}
                    </div>

                    {/* Tech Stack Tags */}
                    <div className="mb-5 relative z-10">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tech Stack</p>
                      {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {skills.slice(0, 3).map(s => (
                            <span key={s} className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted border border-border text-foreground">{s}</span>
                          ))}
                          {skills.length > 3 && <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted border border-border text-foreground">+{skills.length - 3}</span>}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 italic">No tech stack specified</p>
                      )}
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-[10px] font-bold text-orange-600">
                            {team.owner.anonymousId?.substring(0,2).toUpperCase() || "AN"}
                         </div>
                         <span className="text-xs text-gray-600 font-medium">{team.owner.anonymousId || "Anonymous"}</span>
                      </div>
                      <div className="text-xs font-semibold px-2.5 py-1 bg-gray-50 rounded-md border border-gray-200 text-gray-600 shadow-sm flex items-center gap-1.5">
                         <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                         {activeCount} / {team.targetSize} Size
                      </div>
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
