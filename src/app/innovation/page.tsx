"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function InnovationDashboard() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/innovation')
      .then(r => r.json())
      .then(d => {
        setSubmissions(Array.isArray(d) ? d : [])
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-12 text-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>

  return (
    <div className="min-h-screen bg-gray-50 text-foreground pt-10 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="relative p-10 glass rounded-3xl border border-gray-200 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-[100px] rounded-full pointer-events-none -z-10" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">Innovation Accelerator</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Take your team's project to the next level. Get mentorship, technical resources, and startup guidance.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Applications</h2>
          
          {submissions.length === 0 ? (
            <div className="p-12 text-center border border-gray-200 rounded-2xl bg-gray-50">
              <p className="text-lg font-medium text-gray-900 mb-2">No active applications</p>
              <p className="text-gray-500">Promote an idea to a project in your workspace, then submit it for support.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {submissions.map(sub => (
                <Link key={sub.id} href={`/innovation/${sub.id}`}>
                  <div className="glass p-6 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                    <div>
                      <p className="text-sm font-medium text-blue-400 mb-1">{sub.team.name}</p>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-300 transition-colors">{sub.project.idea.title}</h3>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                      sub.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                      sub.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                      sub.status === 'SHORTLISTED' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                      'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {sub.status.replace('_', ' ')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
