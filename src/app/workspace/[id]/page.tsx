"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function WorkspaceOverview() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/workspace/${id}`)
      .then(r => {
        if (!r.ok) throw new Error("Unauthorized")
        return r.json()
      })
      .then(d => {
        if (d.error) throw new Error(d.error)
        setData(d)
      })
      .catch(() => router.push("/teams"))
      .finally(() => setLoading(false))
  }, [id, router])

  if (loading) return <div className="p-8 flex justify-center"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!data) return null

  // Calculate progress
  const completedTasks = data.tasks?.filter((t: any) => t.status === 'DONE').length || 0
  const totalTasks = data.tasks?.length || 0
  const taskProgress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0

  const activeMilestone = data.milestones?.find((m: any) => m.status === 'IN_PROGRESS') || data.milestones?.find((m: any) => m.status === 'UPCOMING')

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {data.team.category}
          </span>
          <span className="text-sm text-muted-foreground">Active Workspace</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">{data.name}</h1>
        {data.description && <p className="text-muted-foreground max-w-3xl">{data.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Stats & Current Status */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 glass rounded-2xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">Members</p>
              <p className="text-2xl font-bold text-foreground">{data.members.length}</p>
            </div>
            <div className="p-4 glass rounded-2xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">Tasks Done</p>
              <p className="text-2xl font-bold text-foreground">{completedTasks}/{totalTasks}</p>
            </div>
            <div className="p-4 glass rounded-2xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">Files</p>
              <p className="text-2xl font-bold text-foreground">{data.files.length}</p>
            </div>
            <div className="p-4 glass rounded-2xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">Deadline</p>
              <p className="text-lg font-bold text-foreground truncate">{data.deadline ? new Date(data.deadline).toLocaleDateString() : 'None'}</p>
            </div>
          </div>

          <div className="p-6 glass rounded-2xl border border-border relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <h2 className="font-semibold text-foreground mb-4 flex items-center justify-between">
                Current Milestone
                <Link href={`/workspace/${id}/roadmap`} className="text-xs text-blue-400 hover:underline">View Roadmap</Link>
             </h2>
             {activeMilestone ? (
               <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-400 mb-1">{activeMilestone.phase}</p>
                    <p className="text-xl font-bold text-foreground">{activeMilestone.title}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    activeMilestone.status === 'IN_PROGRESS' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-gray-100 border-border text-muted-foreground'
                  }`}>
                    {activeMilestone.status.replace('_', ' ')}
                  </div>
               </div>
             ) : (
               <p className="text-muted-foreground text-sm">No active milestones.</p>
             )}
          </div>

          <div className="p-6 glass rounded-2xl border border-border">
            <h2 className="font-semibold text-foreground mb-4 flex items-center justify-between">
               Task Progress
               <Link href={`/workspace/${id}/tasks`} className="text-xs text-blue-400 hover:underline">View Board</Link>
            </h2>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all" style={{ width: `${taskProgress}%` }} />
              </div>
              <span className="text-sm font-mono text-foreground">{taskProgress}%</span>
            </div>
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="space-y-6">
          <div className="p-6 glass rounded-2xl border border-border h-[500px] flex flex-col">
            <h2 className="font-semibold text-foreground mb-4">Recent Activity</h2>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {data.activities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center mt-10">No activity yet.</p>
              ) : (
                data.activities.map((act: any) => (
                  <div key={act.id} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-border flex items-center justify-center flex-shrink-0 text-xs text-foreground">
                      {act.actor.anonymousId?.slice(-2) || '?'}
                    </div>
                    <div>
                      <p className="text-sm text-foreground leading-tight">
                        <span className="font-medium">{act.actor.anonymousId}</span> {act.message.replace(act.actor.anonymousId, '')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{new Date(act.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
