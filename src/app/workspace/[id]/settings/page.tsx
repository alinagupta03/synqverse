"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function WorkspaceSettings() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/workspace/${id}`)
      .then(r => r.json())
      .then(d => {
        if (!d.error) {
          setName(d.name || "")
          setDescription(d.description || "")
          if (d.deadline) setDeadline(new Date(d.deadline).toISOString().split('T')[0])
        }
      })
  }, [id])

  const [toast, setToast] = useState<string | null>(null)

  const saveSettings = async () => {
    setSaving(true)
    try {
      await fetch(`/api/workspace/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, deadline: deadline || null })
      })
      setToast("Settings saved successfully.")
      setTimeout(() => setToast(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-muted/40 p-6 md:p-12 relative">
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-in slide-in-from-bottom-5">
          {toast}
        </div>
      )}
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage workspace preferences and details.</p>
        </div>

        <div className="space-y-6 glass p-6 rounded-2xl border border-border">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Workspace Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              rows={4}
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Project Deadline</label>
            <input 
              type="date" 
              value={deadline} 
              onChange={e => setDeadline(e.target.value)} 
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              onClick={saveSettings} 
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-foreground px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="space-y-4 glass p-6 rounded-2xl border border-red-500/30 bg-red-500/5 mt-12">
          <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">Archive or delete this workspace. This action cannot be undone.</p>
          <button className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 px-6 py-2 rounded-lg text-sm font-medium transition-colors">
            Archive Workspace
          </button>
        </div>
      </div>
    </div>
  )
}
