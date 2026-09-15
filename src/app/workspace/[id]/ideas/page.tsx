"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { SynqAIPanel } from "@/components/ai/SynqAIPanel"

type Idea = {
  id: string
  title: string
  problem: string
  solution: string
  technology: string
  status: string
  score: number
  feasibility: number
  innovationLevel: number
  upvotes: number
  downvotes: number
  netScore: number
  userVote: number
  author: { anonymousId: string }
  _count: { comments: number }
}

export default function IdeaLab() {
  const params = useParams()
  const id = params?.id as string
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [showModal, setShowModal] = useState(false)
  
  // Form state
  const [title, setTitle] = useState("")
  const [problem, setProblem] = useState("")
  const [solution, setSolution] = useState("")
  const [technology, setTechnology] = useState("")
  const [expectedImpact, setExpectedImpact] = useState("")
  const [targetUsers, setTargetUsers] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const fetchIdeas = async () => {
    const res = await fetch(`/api/workspace/${id}/ideas`)
    const data = await res.json()
    setIdeas(Array.isArray(data) ? data : [])
  }

  useEffect(() => { fetchIdeas() }, [id])

  const submitIdea = async () => {
    if (!title || !problem || !solution) return
    setSubmitting(true)
    await fetch(`/api/workspace/${id}/ideas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, problem, solution, technology, expectedImpact, targetUsers })
    })
    setShowModal(false)
    setSubmitting(false)
    setTitle(""); setProblem(""); setSolution(""); setTechnology(""); setExpectedImpact(""); setTargetUsers("")
    fetchIdeas()
  }

  const vote = async (ideaId: string, value: number) => {
    await fetch(`/api/workspace/${id}/ideas/${ideaId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value })
    })
    fetchIdeas()
  }

  const promote = async (ideaId: string) => {
    if (!confirm("Are you sure you want to promote this Idea to a Project? This makes it the official project for this workspace.")) return
    await fetch(`/api/workspace/${id}/ideas/${ideaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: 'PROMOTE' })
    })
    fetchIdeas()
  }

  const trending = [...ideas].sort((a, b) => b.netScore - a.netScore)[0]
  const mostInnovative = [...ideas].sort((a, b) => b.innovationLevel - a.innovationLevel)[0]

  return (
    <div className="flex-1 overflow-y-auto bg-muted/40 p-6 md:p-12 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Idea Lab</h1>
            <p className="text-muted-foreground">Propose, evaluate, and promote ideas to official projects.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-foreground px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Propose Idea
          </button>
        </div>

        {/* Highlights */}
        {ideas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trending && (
              <div className="glass p-5 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">🔥</div>
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Trending Idea</p>
                <h3 className="text-lg font-bold text-foreground mb-1">{trending.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{trending.solution}</p>
              </div>
            )}
            {mostInnovative && mostInnovative.id !== trending?.id && (
               <div className="glass p-5 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-transparent relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">✨</div>
                 <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">Most Innovative</p>
                 <h3 className="text-lg font-bold text-foreground mb-1">{mostInnovative.title}</h3>
                 <p className="text-sm text-muted-foreground line-clamp-2">{mostInnovative.solution}</p>
               </div>
            )}
          </div>
        )}

        {/* Ideas Feed */}
        <div className="space-y-6">
          {ideas.length === 0 ? (
            <div className="p-12 text-center border border-border rounded-2xl bg-muted">
               <div className="text-4xl mb-4">💡</div>
               <h3 className="text-lg font-medium text-foreground mb-1">No ideas yet</h3>
               <p className="text-muted-foreground text-sm">Be the first to propose a direction for the team.</p>
            </div>
          ) : (
            ideas.map(idea => (
              <div key={idea.id} className="glass p-6 rounded-2xl border border-border flex gap-6">
                {/* Voting Column */}
                <div className="flex flex-col items-center gap-1">
                  <button onClick={() => vote(idea.id, idea.userVote === 1 ? 0 : 1)} className={`p-2 rounded hover:bg-gray-100 ${idea.userVote === 1 ? 'text-blue-400' : 'text-muted-foreground'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <span className={`font-bold ${idea.netScore > 0 ? 'text-foreground' : idea.netScore < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>{idea.netScore}</span>
                  <button onClick={() => vote(idea.id, idea.userVote === -1 ? 0 : -1)} className={`p-2 rounded hover:bg-gray-100 ${idea.userVote === -1 ? 'text-blue-400' : 'text-muted-foreground'}`}>
                    <svg className="w-6 h-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        {idea.title}
                        {idea.status === 'PROMOTED' && <span className="text-xs px-2 py-0.5 rounded border border-green-500/30 bg-green-500/10 text-green-400 font-medium">Official Project</span>}
                      </h2>
                      {idea.status === 'ACTIVE' && (
                        <button onClick={() => promote(idea.id)} className="text-xs px-3 py-1.5 rounded-lg border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 transition-colors">
                          Promote to Project
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Proposed by {idea.author.anonymousId}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-foreground/70 mb-1 uppercase tracking-wider">Problem</p>
                      <p className="text-sm text-foreground/90">{idea.problem}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground/70 mb-1 uppercase tracking-wider">Solution</p>
                      <p className="text-sm text-foreground/90">{idea.solution}</p>
                    </div>
                  </div>

                  {/* Internal Evaluation Score */}
                  <div className="p-4 bg-muted/30 rounded-xl border border-border mt-4">
                    <p className="text-xs font-semibold text-foreground/70 mb-3 uppercase tracking-wider">Internal Evaluation Indicators</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Score</span>
                        <span className="text-sm font-mono text-foreground">{Math.round(idea.score)}/100</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Feasibility</span>
                        <div className="flex gap-0.5">{Array.from({length: 10}).map((_, i) => <div key={i} className={`w-1.5 h-3 rounded-sm ${i < idea.feasibility ? 'bg-blue-500' : 'bg-gray-200'}`} />)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Innovation</span>
                        <div className="flex gap-0.5">{Array.from({length: 10}).map((_, i) => <div key={i} className={`w-1.5 h-3 rounded-sm ${i < idea.innovationLevel ? 'bg-purple-500' : 'bg-gray-200'}`} />)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-muted/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Propose Idea</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Idea Title *</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-card dark:bg-[#1E293B] border border-border rounded-lg px-4 py-2.5 text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" placeholder="e.g., Decentralized Learning Platform" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">The Problem *</label>
                <textarea value={problem} onChange={e => setProblem(e.target.value)} rows={3} className="w-full bg-card dark:bg-[#1E293B] border border-border rounded-lg px-4 py-2.5 text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none" placeholder="What pain point are you solving?" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">The Solution *</label>
                <textarea value={solution} onChange={e => setSolution(e.target.value)} rows={3} className="w-full bg-card dark:bg-[#1E293B] border border-border rounded-lg px-4 py-2.5 text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none" placeholder="How does your idea fix this problem?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Target Users</label>
                  <input type="text" value={targetUsers} onChange={e => setTargetUsers(e.target.value)} className="w-full bg-card dark:bg-[#1E293B] border border-border rounded-lg px-4 py-2.5 text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" placeholder="e.g., College Students" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Technology Stack</label>
                  <input type="text" value={technology} onChange={e => setTechnology(e.target.value)} className="w-full bg-card dark:bg-[#1E293B] border border-border rounded-lg px-4 py-2.5 text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" placeholder="e.g., Next.js, AI" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Expected Impact</label>
                <input type="text" value={expectedImpact} onChange={e => setExpectedImpact(e.target.value)} className="w-full bg-card dark:bg-[#1E293B] border border-border rounded-lg px-4 py-2.5 text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" placeholder="e.g., Reduce dropout rates by 15%" />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
              <button onClick={submitIdea} disabled={!title || !problem || !solution || submitting} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                {submitting ? 'Submitting...' : 'Submit Idea'}
              </button>
            </div>
          </div>
        </div>
      )}

      <SynqAIPanel 
        context="project feedback" 
      />
    </div>
  )
}
