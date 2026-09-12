"use client"

import { useState, useEffect } from "react"

export default function AdminModerationQueue() {
  const [reports, setReports] = useState<any[]>([])
  const [selectedReport, setSelectedReport] = useState<any>(null)
  
  // Action state
  const [actionReason, setActionReason] = useState("")
  const [duration, setDuration] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchReports = async () => {
    const res = await fetch('/api/admin/moderation')
    const data = await res.json()
    setReports(Array.isArray(data) ? data : [])
  }

  useEffect(() => { fetchReports() }, [])

  const executeAction = async (actionType: string, level: number) => {
    if (!selectedReport) return
    setLoading(true)
    try {
      await fetch(`/api/admin/moderation/${selectedReport.id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType,
          level,
          reason: actionReason || "Violation of Community Guidelines",
          durationDays: ['TEMP_COMM', 'TEMP_ACCOUNT'].includes(actionType) ? duration : null
        })
      })
      setSelectedReport(null)
      setActionReason("")
      fetchReports()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Queue List */}
      <div className="w-full md:w-1/2 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Moderation Queue ({reports.length})</h2>
        {reports.length === 0 ? (
          <p className="text-gray-500">Queue is clear.</p>
        ) : (
          reports.map(r => (
            <div 
              key={r.id} 
              onClick={() => setSelectedReport(r)}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                selectedReport?.id === r.id ? 'bg-red-500/10 border-red-500/50' : 'bg-gray-100 border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">{r.reason}</span>
                <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-900 mb-2 line-clamp-2">{r.description || 'No description provided.'}</p>
              <div className="text-xs text-gray-500 flex gap-4">
                <span>Reporter: {r.reporter.anonymousId}</span>
                <span>Target: {r.reportedUser.anonymousId}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Panel */}
      <div className="w-full md:w-1/2">
        {selectedReport ? (
          <div className="sticky top-12 p-6 glass border border-red-500/20 rounded-2xl space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Review Report</h3>
              <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200 space-y-2 mb-6 text-sm">
                <p><span className="text-gray-500 w-24 inline-block">Target Type:</span> <span className="text-gray-900 font-medium">{selectedReport.targetType}</span></p>
                <p><span className="text-gray-500 w-24 inline-block">Reason:</span> <span className="text-red-400 font-medium">{selectedReport.reason}</span></p>
                <p><span className="text-gray-500 w-24 inline-block">Description:</span> <span className="text-gray-900/80">{selectedReport.description}</span></p>
                <p><span className="text-gray-500 w-24 inline-block">Reported User:</span> <span className="text-gray-900 font-mono">{selectedReport.reportedUser.anonymousId} ({selectedReport.reportedUserId})</span></p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Execute Enforcement</h3>
              
              <textarea 
                value={actionReason} 
                onChange={e => setActionReason(e.target.value)}
                placeholder="Reason to show the user..."
                className="w-full bg-gray-50/50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:border-red-500"
                rows={2}
              />

              <div className="flex items-center gap-4 text-sm text-gray-900">
                <span>Restriction Duration (Days):</span>
                <input type="number" min="1" max="30" value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="w-20 bg-gray-50/50 border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-red-500" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button disabled={loading} onClick={() => executeAction('WARNING', 1)} className="bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  Level 1: Warning
                </button>
                <button disabled={loading} onClick={() => executeAction('TEMP_COMM', 2)} className="bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-500 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  Level 2: Temp Mute
                </button>
                <button disabled={loading} onClick={() => executeAction('TEMP_ACCOUNT', 3)} className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  Level 3: Temp Ban
                </button>
                <button disabled={loading} onClick={() => executeAction('SUSPENSION', 5)} className="bg-red-700 hover:bg-red-600 border border-red-500 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  Level 5: Perm Ban
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4 text-right">
                <button disabled={loading} onClick={() => executeAction('DISMISS', 0)} className="text-gray-500 hover:text-gray-900 text-sm font-medium">
                  Dismiss Report
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[400px] flex items-center justify-center border border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500">Select a report from the queue.</p>
          </div>
        )}
      </div>
    </div>
  )
}
