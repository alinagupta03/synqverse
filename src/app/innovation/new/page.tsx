"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const SUPPORT_TYPES = [
  "Mentorship", "Technology", "Funding guidance", 
  "Industry connection", "Research support", 
  "Startup guidance", "Technical review", "Competition guidance"
]

function InnovationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const workspaceId = searchParams?.get("workspaceId")

  const [innovation, setInnovation] = useState("")
  const [prototype, setPrototype] = useState("")
  const [resourcesNeeded, setResourcesNeeded] = useState("")
  const [supportRequested, setSupportRequested] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const toggleSupport = (type: string) => {
    setSupportRequested(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const [toast, setToast] = useState<string | null>(null)

  const submit = async () => {
    if (!workspaceId) return setToast("Missing workspace context.")
    setSubmitting(true)
    try {
      const res = await fetch("/api/innovation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          innovation,
          prototype,
          resourcesNeeded,
          supportRequested
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      router.push(`/innovation/${data.submission.id}`)
    } catch (e: any) {
      setToast(e.message)
      setTimeout(() => setToast(null), 3000)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-foreground pb-20 pt-10 px-6 relative">
      {toast && (
        <div className="fixed bottom-6 right-6 bg-red-900 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-in slide-in-from-bottom-5">
          {toast}
        </div>
      )}
      <div className="max-w-3xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">Submit for Innovation Support</h1>
          <p className="text-gray-500 text-lg">Apply for mentorship, resources, and accelerator guidance for your official project.</p>
        </div>

        <div className="space-y-8 glass p-8 rounded-3xl border border-gray-200">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900/90">What makes this project truly innovative? *</label>
            <textarea value={innovation} onChange={e => setInnovation(e.target.value)} rows={4} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:border-blue-500" placeholder="Describe your unique value proposition..." />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900/90">Prototype / Demo Link</label>
            <input type="text" value={prototype} onChange={e => setPrototype(e.target.value)} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:border-blue-500" placeholder="https://..." />
            <p className="text-xs text-gray-500">Link to GitHub, Figma, or live deployment</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900/90">What resources do you need most right now? *</label>
            <textarea value={resourcesNeeded} onChange={e => setResourcesNeeded(e.target.value)} rows={3} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:border-blue-500" placeholder="Cloud credits, specific APIs, domain expertise..." />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-900/90">Type of Support Requested *</label>
            <div className="flex flex-wrap gap-3">
              {SUPPORT_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => toggleSupport(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    supportRequested.includes(type) 
                      ? 'bg-blue-600 border-blue-500 text-gray-900 shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                      : 'bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-end">
            <button 
              onClick={submit} 
              disabled={submitting || !innovation || !resourcesNeeded || supportRequested.length === 0}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-gray-900 px-8 py-4 rounded-xl font-bold transition-all shadow-lg"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NewInnovationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-900">Loading...</div>}>
      <InnovationForm />
    </Suspense>
  )
}
