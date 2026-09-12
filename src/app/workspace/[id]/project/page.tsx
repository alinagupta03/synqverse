"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

const STAGES = ["Idea", "Research", "Prototype", "MVP", "Testing", "Launch"]

export default function WorkspaceProject() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchProject = async () => {
    const res = await fetch(`/api/workspace/${id}/projects`)
    const data = await res.json()
    setProject(data)
    setLoading(false)
  }

  useEffect(() => { fetchProject() }, [id])

  if (loading) return <div className="p-12 text-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>

  if (!project) {
    return (
      <div className="flex-1 overflow-y-auto bg-gray-50/40 p-6 md:p-12">
        <div className="max-w-4xl mx-auto space-y-8 text-center pt-24">
          <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/30 rounded-3xl mx-auto flex items-center justify-center text-4xl mb-6">🚀</div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">No Active Project</h1>
          <p className="text-gray-500 max-w-lg mx-auto mb-8">
            This workspace hasn't promoted an official project yet. Head over to the Idea Lab to propose and vote on ideas.
          </p>
          <Link href={`/workspace/${id}/ideas`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors">Go to Idea Lab</button>
          </Link>
        </div>
      </div>
    )
  }

  const submission = project.innovationSubmissions?.[0]

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/40 p-6 md:p-12 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">Official Project</span>
              <span className="text-sm text-gray-500">Workspace Core</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">{project.idea.title}</h1>
          </div>
          
          {!submission ? (
            <Link href={`/innovation/new?workspaceId=${id}`}>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-gray-900 px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/20 border border-gray-200">
                Submit for Innovation Support
              </button>
            </Link>
          ) : (
            <Link href={`/innovation/${submission.id}`}>
              <button className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                submission.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20' :
                submission.status === 'UNDER_REVIEW' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20' :
                'bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200'
              }`}>
                View Application ({submission.status.replace('_', ' ')})
              </button>
            </Link>
          )}
        </div>

        {/* Stage Tracker */}
        <div className="glass p-6 rounded-2xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-900">Project Stage</h3>
          </div>
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100 -z-10" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-500 -z-10 transition-all duration-500" style={{ width: `${(STAGES.indexOf(project.stage) / (STAGES.length - 1)) * 100}%` }} />
            
            {STAGES.map((s, i) => {
              const active = i <= STAGES.indexOf(project.stage)
              const current = s === project.stage
              return (
                <div key={s} className="flex flex-col items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 ${current ? 'bg-gray-50 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] scale-125' : active ? 'bg-blue-500 border-blue-500' : 'bg-gray-50 border-gray-300'} transition-all`} />
                  <span className={`text-xs font-medium ${current ? 'text-blue-400' : active ? 'text-gray-900' : 'text-gray-500'}`}>{s}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="glass p-6 rounded-2xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Core Definition</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Problem</h4>
                  <p className="text-sm text-gray-900/90 leading-relaxed">{project.problem}</p>
                </div>
                <div className="h-px bg-gray-200" />
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Solution</h4>
                  <p className="text-sm text-gray-900/90 leading-relaxed">{project.solution}</p>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Target & Technology</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Target Users</h4>
                  <p className="text-sm text-gray-900/90">{project.targetUsers}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Technology Stack</h4>
                  <p className="text-sm text-gray-900/90">{project.technology}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5">
              <h3 className="font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Innovation Indicators
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Overall Score</span>
                    <span className="text-gray-900 font-mono">{Math.round(project.idea.score)}/100</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${project.idea.score}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Innovation Level</span>
                    <span className="text-gray-900 font-mono">{project.idea.innovationLevel}/10</span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({length: 10}).map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-sm ${i < project.idea.innovationLevel ? 'bg-purple-500' : 'bg-gray-200'}`} />)}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              {project.links ? (
                <a href={project.links} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline break-all">
                  {project.links}
                </a>
              ) : (
                <p className="text-sm text-gray-500">No links provided yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
