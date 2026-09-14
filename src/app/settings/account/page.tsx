"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AccountSettingsPage() {
  const router = useRouter()
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const res = await fetch('/api/user/data')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'synqverse-export.json'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmDelete = prompt("This action is irreversible. Type 'DELETE' to confirm:")
    if (confirmDelete === 'DELETE') {
      setIsDeleting(true)
      await fetch('/api/user/data', { method: 'DELETE' })
      router.push('/login')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Account & Data</h1>
        <p className="text-muted-foreground">Manage your data export and account lifecycle.</p>
      </div>

      <div className="glass p-6 rounded-2xl border border-border space-y-6">
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2">Export Data</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Download a copy of all your data on Synqverse, including your profile, academic records, and team memberships in JSON format.
          </p>
          <button 
            onClick={handleExportData} 
            disabled={isExporting}
            className="bg-gray-200 hover:bg-gray-300 text-foreground px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {isExporting ? 'Exporting...' : 'Export My Data'}
          </button>
        </div>
      </div>

      <div className="glass p-6 rounded-2xl border border-red-500/30 bg-red-500/5 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-red-400 mb-2">Danger Zone</h3>
          <p className="text-sm text-red-400/80 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button 
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-foreground px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  )
}
