"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/metrics')
      .then(res => res.json())
      .then(data => setMetrics(data.metrics))
  }, [])

  if (!metrics) return <div className="p-12 text-center text-gray-900">Loading SaaS Metrics...</div>

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center border-b border-red-500/20 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Platform Overview</h1>
          <p className="text-gray-500">High-level operational metrics and SaaS performance.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/users" className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Manage Users</Link>
          <Link href="/admin/innovation" className="bg-purple-600 hover:bg-purple-700 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Innovation Queue</Link>
          <Link href="/admin/moderation" className="bg-red-600 hover:bg-red-700 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Review Reports</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="glass p-6 rounded-2xl border border-gray-200">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Students</p>
          <p className="text-4xl font-bold text-gray-900">{metrics.totalUsers}</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-gray-200">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Teams Formed</p>
          <p className="text-4xl font-bold text-blue-400">{metrics.totalTeams}</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-gray-200">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Active Workspaces</p>
          <p className="text-4xl font-bold text-green-400">{metrics.totalWorkspaces}</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-gray-200">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Official Projects</p>
          <p className="text-4xl font-bold text-purple-400">{metrics.totalProjects}</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-gray-200">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Innovation Apps</p>
          <p className="text-4xl font-bold text-pink-400">{metrics.totalSubmissions}</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-red-500/30 bg-red-500/5">
          <p className="text-sm font-medium text-red-400/80 uppercase tracking-wider mb-2">Open Reports</p>
          <p className="text-4xl font-bold text-red-400">{metrics.openReports}</p>
        </div>
      </div>

      {/* Simulated Charts Section */}
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <div className="glass p-6 rounded-2xl border border-gray-200 h-80 flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">User Growth (Last 30 Days)</h3>
          <div className="flex-1 flex items-end justify-between gap-2 border-b border-l border-gray-200 p-4 relative">
             {/* Simulated bars */}
             {[4, 12, 18, 25, 32, 45, 60, 80, 110, 150].map((h, i) => (
               <div key={i} className="w-full bg-blue-500 hover:bg-blue-400 transition-colors rounded-t-sm" style={{ height: `${(h/150)*100}%` }} />
             ))}
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-gray-200 h-80 flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Funnel Conversion</h3>
          <div className="flex-1 flex flex-col justify-center gap-4">
             <div className="space-y-1">
               <div className="flex justify-between text-xs text-gray-500"><span>Signups</span><span>{metrics.totalUsers}</span></div>
               <div className="h-4 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-full" /></div>
             </div>
             <div className="space-y-1">
               <div className="flex justify-between text-xs text-gray-500"><span>Teams Created</span><span>{metrics.totalTeams}</span></div>
               <div className="h-4 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-green-500" style={{ width: '60%' }} /></div>
             </div>
             <div className="space-y-1">
               <div className="flex justify-between text-xs text-gray-500"><span>Projects Promoted</span><span>{metrics.totalProjects}</span></div>
               <div className="h-4 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-purple-500" style={{ width: '25%' }} /></div>
             </div>
             <div className="space-y-1">
               <div className="flex justify-between text-xs text-gray-500"><span>Innovation Submitted</span><span>{metrics.totalSubmissions}</span></div>
               <div className="h-4 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-pink-500" style={{ width: '5%' }} /></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
