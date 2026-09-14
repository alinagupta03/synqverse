"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

type Member = {
  id: string
  role: string
  joinedAt: string
  user: { id: string; anonymousId: string; academic: { branch: string | null; year: string | null } | null }
}

export default function WorkspaceMembers() {
  const params = useParams()
  const id = params?.id as string
  const [members, setMembers] = useState<Member[]>([])
  
  const fetchMembers = async () => {
    const res = await fetch(`/api/workspace/${id}/members`)
    const data = await res.json()
    setMembers(Array.isArray(data) ? data : [])
  }

  useEffect(() => { fetchMembers() }, [id])

  const handleAction = async (targetUserId: string, action: 'PROMOTE' | 'REMOVE') => {
    if (action === 'REMOVE' && !confirm("Are you sure you want to remove this member?")) return
    
    await fetch(`/api/workspace/${id}/members`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId, action })
    })
    fetchMembers()
  }

  return (
    <div className="flex-1 overflow-y-auto bg-muted/40 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Members</h1>
          <p className="text-muted-foreground">Manage workspace access and roles.</p>
        </div>

        <div className="glass rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Member</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-muted transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-sm font-bold text-blue-400">
                        {m.user.anonymousId.slice(-2)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{m.user.anonymousId}</p>
                        <p className="text-xs text-muted-foreground">{m.user.academic?.branch || 'Unknown'} • {m.user.academic?.year || 'Unknown'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded border font-medium ${
                      m.role === 'OWNER' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                      m.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      'bg-gray-100 text-muted-foreground border-border'
                    }`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">
                    {new Date(m.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {m.role !== 'OWNER' && (
                      <div className="flex items-center justify-end gap-3">
                        {m.role === 'MEMBER' && (
                          <button onClick={() => handleAction(m.user.id, 'PROMOTE')} className="text-blue-400 hover:text-blue-300 font-medium text-xs">Promote to Admin</button>
                        )}
                        <button onClick={() => handleAction(m.user.id, 'REMOVE')} className="text-red-400 hover:text-red-300 font-medium text-xs">Remove</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
