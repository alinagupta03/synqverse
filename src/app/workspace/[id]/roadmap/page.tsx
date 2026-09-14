"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { SynqAIPanel } from "@/components/ai/SynqAIPanel"

type Milestone = {
  id: string
  title: string
  description: string | null
  phase: string
  status: string
  dueDate: string | null
  order: number
}

const PHASES = ["Research", "Prototype", "MVP", "Testing", "Presentation", "Launch"]

export default function WorkspaceRoadmap() {
  const params = useParams()
  const id = params?.id as string
  const [milestones, setMilestones] = useState<Milestone[]>([])
  
  const [showNewModal, setShowNewModal] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [newPhase, setNewPhase] = useState(PHASES[0])

  const fetchMilestones = async () => {
    const res = await fetch(`/api/workspace/${id}/milestones`)
    const data = await res.json()
    setMilestones(Array.isArray(data) ? data : [])
  }

  useEffect(() => { fetchMilestones() }, [id])

  const completeMilestone = async (milestoneId: string) => {
    await fetch(`/api/workspace/${id}/milestones`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ milestoneId, status: "COMPLETED" })
    })
    fetchMilestones()
  }

  const createMilestone = async () => {
    await fetch(`/api/workspace/${id}/milestones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, description: newDesc, phase: newPhase })
    })
    setShowNewModal(false)
    setNewTitle("")
    setNewDesc("")
    fetchMilestones()
  }

  return (
    <div className="flex-1 overflow-y-auto bg-muted/40 p-6 md:p-12 relative">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Roadmap</h1>
            <p className="text-muted-foreground">Track the lifecycle of your project from idea to launch.</p>
          </div>
          <button onClick={() => setShowNewModal(true)} className="bg-gray-200 hover:bg-gray-300 text-foreground px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
            <span>+</span> Add Milestone
          </button>
        </div>

        <div className="relative border-l-2 border-border pl-8 ml-4 space-y-12">
          {milestones.length === 0 ? (
            <p className="text-muted-foreground">No milestones defined.</p>
          ) : (
            milestones.map((m, i) => {
              const isDone = m.status === 'COMPLETED'
              const isInProgress = m.status === 'IN_PROGRESS' || (!isDone && i === 0) || (!isDone && milestones[i-1]?.status === 'COMPLETED')
              
              return (
                <div key={m.id} className="relative group">
                  <div className={`absolute -left-[41px] top-1.5 w-5 h-5 rounded-full border-4 border-black ${
                    isDone ? "bg-green-500" : isInProgress ? "bg-blue-500 animate-pulse" : "bg-gray-300"
                  }`} />

                  <div className={`glass p-6 rounded-2xl border transition-all ${
                    isInProgress ? "border-blue-500/30 bg-blue-500/5 shadow-[0_0_30px_rgba(59,130,246,0.1)]" : "border-border hover:border-gray-300"
                  }`}>
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded border mb-2 inline-block ${
                          isDone ? "bg-green-500/10 text-green-400 border-green-500/20" :
                          isInProgress ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                          "bg-gray-100 text-muted-foreground border-border"
                        }`}>
                          {m.phase}
                        </span>
                        <h2 className={`text-xl font-bold ${isDone ? "text-foreground/70 line-through decoration-white/30" : "text-foreground"}`}>
                          {m.title}
                        </h2>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {m.dueDate && (
                          <div className="text-sm text-muted-foreground bg-gray-100 px-3 py-1 rounded-lg flex items-center gap-2">
                            <span>📅</span> {new Date(m.dueDate).toLocaleDateString()}
                          </div>
                        )}
                        {!isDone && isInProgress && (
                          <button onClick={() => completeMilestone(m.id)} className="bg-blue-600 hover:bg-blue-700 text-foreground text-sm px-4 py-1.5 rounded-lg transition-colors">
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {m.description && (
                      <p className={`text-sm ${isDone ? "text-muted-foreground/60" : "text-muted-foreground"}`}>
                        {m.description}
                      </p>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
      
      {showNewModal && (
        <div className="fixed inset-0 bg-muted/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111] border border-border rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-foreground mb-4">New Milestone</h3>
            <div className="space-y-4">
              <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Milestone title..." className="w-full bg-gray-100 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-blue-500" />
              <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description..." className="w-full bg-gray-100 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-blue-500" rows={3} />
              <select value={newPhase} onChange={e => setNewPhase(e.target.value)} className="w-full bg-gray-100 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-blue-500">
                {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowNewModal(false)} className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                <button onClick={createMilestone} disabled={!newTitle} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-foreground px-4 py-2 rounded-xl font-medium transition-colors">Create Milestone</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <SynqAIPanel 
        context="roadmap" 
        onApply={async (generatedMilestones) => {
          for (const m of generatedMilestones) {
             await fetch(`/api/workspace/${id}/milestones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                   title: `${m.phase}: ${m.title}`,
                   description: m.description,
                   dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                   phase: m.phase
                })
             })
          }
          fetchMilestones()
        }}
      />
    </div>
  )
}
