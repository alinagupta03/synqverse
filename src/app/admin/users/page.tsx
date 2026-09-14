"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [query, setQuery] = useState("")

  const fetchUsers = async (q = "") => {
    const res = await fetch(`/api/admin/users?q=${q}`)
    const data = await res.json()
    setUsers(Array.isArray(data) ? data : [])
  }

  useEffect(() => { fetchUsers() }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers(query)
  }

  const toggleSuspension = async (userId: string, isSuspended: boolean) => {
    await fetch(`/api/admin/users/${userId}/suspend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: isSuspended ? 'UNSUSPEND' : 'SUSPEND' })
    })
    fetchUsers(query)
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/admin" className="text-red-400 text-sm hover:underline mb-2 inline-block">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">User Management</h1>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="text" 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            placeholder="Search email or anonymous ID..." 
            className="w-80 bg-gray-100 border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-red-500" 
          />
          <button type="submit" className="bg-gray-200 hover:bg-gray-300 text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors">Search</button>
        </form>
      </div>

      <div className="glass rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-left text-sm text-foreground">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Anonymous ID</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Tier</th>
              <th className="px-6 py-4 font-medium">Experience</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(user => {
              const isSuspended = user.moderationActions.some((a: any) => a.actionType === 'SUSPENSION')
              return (
                <tr key={user.id} className="hover:bg-muted transition-colors">
                  <td className="px-6 py-4 font-mono text-blue-400">{user.anonymousId || 'N/A'}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.tier === 'PRO' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-gray-100 text-muted-foreground'}`}>
                      {user.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{user.profile?.experienceLevel || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    {isSuspended ? (
                      <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold">SUSPENDED</span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold">ACTIVE</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toggleSuspension(user.id, isSuspended)}
                      className={`text-xs font-medium px-3 py-1.5 rounded transition-colors ${isSuspended ? 'bg-gray-200 hover:bg-gray-300 text-foreground' : 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30'}`}
                    >
                      {isSuspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              )
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
