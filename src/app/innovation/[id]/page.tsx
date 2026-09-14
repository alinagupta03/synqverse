"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

const JOURNEY_STAGES = [
  "Project Review",
  "Mentor Matching",
  "Technical Guidance",
  "Prototype Improvement",
  "Impact Evaluation",
  "Opportunity Matching",
  "Demo Preparation"
]

export default function InnovationDetail() {
  const params = useParams()
  const id = params?.id as string
  const [data, setData] = useState<any>(null)

  // Admin mock controls
  const [adminMode, setAdminMode] = useState(false)
  const [feedback, setFeedback] = useState("")

  const fetchDetail = async () => {
    const res = await fetch(`/api/innovation/${id}`)
    const d = await res.json()
    setData(d)
  }

  useEffect(() => { fetchDetail() }, [id])

  const updateStatus = async (status: string) => {
    await fetch(`/api/innovation/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, feedback })
    })
    setFeedback("")
    fetchDetail()
  }

  if (!data) return <div className="p-12 text-center text-white">Loading...</div>

  const isAccepted = data.status === 'ACCEPTED'

  return (
    <div className="min-h-screen bg-black text-foreground pt-10 pb-20 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <Link href="/innovation" className="text-blue-400 text-sm hover:underline mb-4 inline-block">← Back to Dashboard</Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{data.project.idea.title}</h1>
            <p className="text-muted-foreground">{data.team.name}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${data.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]' :
                data.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                  data.status === 'SHORTLISTED' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 animate-pulse'
              }`}>
              Status: {data.status.replace('_', ' ')}
            </span>
            <button onClick={() => setAdminMode(!adminMode)} className="text-xs text-muted-foreground hover:text-white underline">Toggle Admin Mock</button>
          </div>
        </div>

        {/* Admin Mock Panel */}
        {adminMode && (
          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl space-y-4">
            <h3 className="text-red-400 font-bold flex items-center gap-2">⚠️ Admin Review Panel (Mock)</h3>
            <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Review feedback..." className="w-full bg-black/50 border border-red-500/20 rounded-lg p-3 text-white text-sm focus:outline-none" rows={3} />
            <div className="flex flex-wrap gap-2">
              {['UNDER_REVIEW', 'SHORTLISTED', 'NEEDS_CHANGES', 'ACCEPTED', 'REJECTED'].map(s => (
                <button key={s} onClick={() => updateStatus(s)} className="bg-card text-card-foreground/10 hover:bg-card text-card-foreground/20 text-white px-3 py-1.5 rounded-lg text-sm transition-colors">{s}</button>
              ))}
            </div>
          </div>
        )}

        {/* The Innovation Journey (Visual Timeline) */}
        {isAccepted ? (
          <div className="glass p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-500/5 to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            <h2 className="text-2xl font-bold text-white mb-8">The Innovation Journey</h2>

            <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-[15px] before:w-0.5 before:bg-card text-card-foreground/10">
              {JOURNEY_STAGES.map((stage, idx) => {
                // Mocking current stage at index 2 (Technical Guidance) for demonstration
                const isCompleted = idx < 2
                const isCurrent = idx === 2

                return (
                  <div key={stage} className="relative">
                    {/* Dot */}
                    <div className={`absolute -left-[39px] w-4 h-4 rounded-full border-4 border-black ${isCompleted ? 'bg-green-400' : isCurrent ? 'bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]' : 'bg-card text-card-foreground/20'
                      }`} />

                    <div className={`p-5 rounded-2xl border transition-all ${isCurrent ? 'bg-blue-500/10 border-blue-500/30' : 'glass border-white/5 opacity-70'
                      }`}>
                      <h3 className={`font-bold ${isCurrent ? 'text-blue-400 text-lg' : isCompleted ? 'text-white' : 'text-muted-foreground'}`}>{stage}</h3>
                      {isCurrent && <p className="text-sm text-white/80 mt-2">You are currently paired with an industry mentor to refine your system architecture.</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="glass p-8 rounded-3xl border border-white/10 text-center">
            <div className="text-5xl mb-4 opacity-50">🔒</div>
            <h3 className="text-xl font-bold text-white mb-2">Innovation Journey Locked</h3>
            <p className="text-muted-foreground">The full accelerator journey unlocks once your submission is Accepted.</p>
          </div>
        )}

        {/* Submission Details & Reviews */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="glass p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Submission Details</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Innovation Value</p>
                  <p className="text-sm text-white/90 leading-relaxed">{data.innovation}</p>
                </div>
                <div className="h-px bg-card text-card-foreground/10" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Resources Needed</p>
                  <p className="text-sm text-white/90 leading-relaxed">{data.resourcesNeeded}</p>
                </div>
                <div className="h-px bg-card text-card-foreground/10" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Support Requested</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.supportRequested.split(',').map((req: string) => (
                      <span key={req} className="px-3 py-1 bg-card text-card-foreground/5 border border-white/10 rounded-full text-xs text-white">{req}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl border border-white/10 h-full">
              <h3 className="text-lg font-bold text-white mb-4">Admin Feedback</h3>
              {data.reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No feedback yet. Your submission is waiting for admin review.</p>
              ) : (
                <div className="space-y-4">
                  {data.reviews.map((rev: any) => (
                    <div key={rev.id} className="p-4 bg-card text-card-foreground/5 rounded-xl border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-blue-400">Reviewer: {rev.reviewer.anonymousId}</span>
                        <span className="text-[10px] text-muted-foreground">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      {rev.statusChange && <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-card text-card-foreground/10 text-white mb-2">→ {rev.statusChange.replace('_', ' ')}</span>}
                      <p className="text-sm text-white/80">{rev.feedback}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
