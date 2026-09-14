"use client"

import { useState } from "react"

export function SynqAIPanel({ context, onApply }: { context: string, onApply?: (data: any) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [query, setQuery] = useState("")

  const runAnalysis = async () => {
    setLoading(true)
    try {
      let res;
      if (context === 'tasks') {
        res = await fetch('/api/ai/task-breakdown', { method: 'POST', body: JSON.stringify({ description: query }) })
      } else if (context === 'roadmap') {
        res = await fetch('/api/ai/roadmap', { method: 'POST', body: JSON.stringify({ description: query }) })
      } else if (context === 'team') {
        res = await fetch('/api/ai/team-analysis', { method: 'POST', body: JSON.stringify({ teamRoles: [], members: [] }) })
      }
      
      const data = await res?.json()
      setResult(data)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-110 transition-transform z-50 border border-gray-300"
      >
        ✨
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-muted/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center bg-gray-100">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <span className="text-xl">✨</span> SYNQ AI
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
      </div>
      
      <div className="p-4 flex-1 max-h-[60vh] overflow-y-auto space-y-4">
        {!result && !loading && (
          <div className="space-y-4">
            <p className="text-sm text-foreground/80">How can I help you with your {context}?</p>
            <textarea 
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={`Describe your ${context}...`}
              className="w-full bg-gray-100 border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none focus:border-blue-500 resize-none h-24"
            />
            <button 
              onClick={runAnalysis}
              disabled={!query}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-foreground py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Analyze
            </button>
          </div>
        )}

        {loading && (
          <div className="py-8 text-center space-y-4">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-purple-400 animate-pulse">SYNQ AI is thinking...</p>
          </div>
        )}

        {result && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {result.analysis || "I have generated a structure for you. Review it below."}
            </div>

            {/* Render Tasks if context was tasks */}
            {result.tasks && (
               <div className="space-y-2">
                 {result.tasks.map((t: any, i: number) => (
                   <div key={i} className="p-2 bg-gray-100 rounded text-xs border border-border flex justify-between">
                     <span>{t.title}</span>
                     <span className="text-blue-400">{t.priority}</span>
                   </div>
                 ))}
                 <button onClick={() => { onApply?.(result.tasks); setResult(null); setIsOpen(false) }} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-foreground py-2 rounded-lg text-sm font-medium">
                   Apply Tasks to Board
                 </button>
               </div>
            )}

            {/* Render Roadmaps if context was roadmap */}
            {result.milestones && (
               <div className="space-y-2">
                 {result.milestones.map((m: any, i: number) => (
                   <div key={i} className="p-2 bg-gray-100 rounded text-xs border border-border">
                     <div className="font-bold text-blue-400">{m.phase}</div>
                     <div>{m.title}</div>
                   </div>
                 ))}
                 <button onClick={() => { onApply?.(result.milestones); setResult(null); setIsOpen(false) }} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-foreground py-2 rounded-lg text-sm font-medium">
                   Apply Roadmap
                 </button>
               </div>
            )}

            <button onClick={() => setResult(null)} className="w-full py-2 text-muted-foreground hover:text-foreground text-sm">
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
