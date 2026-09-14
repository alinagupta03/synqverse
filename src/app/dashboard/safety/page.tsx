"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function UserSafetyDashboard() {
  const [data, setData] = useState<{ activeActions: any[], badges: any[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/safety')
      .then(r => r.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-12 text-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>

  return (
    <div className="min-h-screen bg-background text-foreground pt-10 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <Link href="/dashboard" className="text-blue-400 text-sm hover:underline mb-4 inline-block">← Back to Dashboard</Link>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">Trust & Safety Hub</h1>
          <p className="text-muted-foreground">Manage your account standing and earned reputation.</p>
        </div>

        {/* Active Restrictions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Account Status</h2>
          {!data || data.activeActions.length === 0 ? (
            <div className="glass p-6 rounded-2xl border border-green-500/20 bg-green-500/5 flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xl">✓</div>
              <div>
                <h3 className="font-bold text-foreground">Good Standing</h3>
                <p className="text-sm text-green-400/80">You have no active warnings or restrictions.</p>
              </div>
            </div>
          ) : (
            data.activeActions.map(action => (
              <div key={action.id} className="glass p-6 rounded-2xl border border-red-500/30 bg-red-500/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                      ⚠️ Community {action.actionType.replace('_', ' ')}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Issued {new Date(action.createdAt).toLocaleDateString()}</p>
                  </div>
                  {action.endTime && (
                    <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                      Expires {new Date(action.endTime).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="bg-muted/50 p-4 rounded-xl border border-border space-y-2">
                  <p className="text-sm"><span className="text-muted-foreground">Reason:</span> <span className="text-foreground">{action.reason}</span></p>
                  <p className="text-sm"><span className="text-muted-foreground">Restriction:</span> <span className="text-foreground">
                    {action.actionType === 'TEMP_COMM' ? 'Messaging disabled.' : 
                     action.actionType === 'TEMP_ACCOUNT' ? 'Account login temporarily restricted.' :
                     action.actionType === 'SUSPENSION' ? 'Permanent suspension.' : 'Warning only.'}
                  </span></p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Trust Badges */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Trust Badges</h2>
          <p className="text-sm text-muted-foreground mb-4">Badges earned through meaningful behavior and collaboration.</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(!data || data.badges.length === 0) && (
              <div className="col-span-full p-8 text-center glass border border-border rounded-2xl">
                <p className="text-muted-foreground">No badges earned yet.</p>
              </div>
            )}
            
            {data?.badges.map(badge => (
              <div key={badge.id} className="glass p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  {badge.badgeName.includes('Student') ? '🎓' : 
                   badge.badgeName.includes('Collaborator') ? '🤝' : 
                   badge.badgeName.includes('Builder') ? '🛠️' : '✨'}
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">{badge.badgeName}</p>
                  <p className="text-[10px] text-blue-400 mt-1">Earned {new Date(badge.earnedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
