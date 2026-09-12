"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function AdminInnovationQueue() {
  const [submissions, setSubmissions] = useState<any[]>([])

  const fetchSubmissions = async () => {
    const res = await fetch(`/api/admin/innovation`)
    const data = await res.json()
    setSubmissions(Array.isArray(data) ? data : [])
  }

  useEffect(() => { fetchSubmissions() }, [])

  const handleAction = async (id: string, action: string) => {
    const feedback = prompt(`Enter feedback for ${action.replace('_', ' ')} (optional):`)
    if (feedback === null) return // cancelled

    await fetch(`/api/admin/innovation/${id}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, feedback })
    })
    fetchSubmissions()
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/admin" className="text-red-400 text-sm hover:underline mb-2 inline-block">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Innovation Queue</h1>
          <p className="text-gray-500 text-sm">Review, shortlist, and evaluate team project submissions.</p>
        </div>
      </div>

      <div className="glass rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-900">
          <thead className="bg-gray-50/50 border-b border-gray-200 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Team</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Expected Impact</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {submissions.map(sub => (
              <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium">{sub.team?.name || 'Unknown Team'}</td>
                <td className="px-6 py-4 text-gray-500">{sub.team?.category || 'Other'}</td>
                <td className="px-6 py-4 text-gray-500 truncate max-w-[200px]">{sub.expectedImpact}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wide uppercase border ${
                    sub.status === 'SUBMITTED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    sub.status === 'SHORTLISTED' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    sub.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    sub.status === 'NEEDS_CHANGES' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {sub.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleAction(sub.id, 'SHORTLIST')} className="text-xs px-3 py-1 bg-purple-600 hover:bg-purple-700 text-gray-900 rounded transition-colors">Shortlist</button>
                    <button onClick={() => handleAction(sub.id, 'ACCEPT')} className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 text-gray-900 rounded transition-colors">Accept</button>
                    <button onClick={() => handleAction(sub.id, 'REJECT')} className="text-xs px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/20 rounded transition-colors">Reject</button>
                  </div>
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No submissions in queue.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
