"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  if (!isOpen) return null

  const actions = [
    { label: "Go to Dashboard", href: "/dashboard", section: "Navigation" },
    { label: "Discover Students", href: "/discover", section: "Navigation" },
    { label: "Create Team", href: "/teams/new", section: "Actions" },
    { label: "Profile Settings", href: "/settings/profile", section: "Settings" },
    { label: "Admin Panel", href: "/admin", section: "Settings" },
  ]

  const filtered = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="fixed inset-0 bg-gray-50/80 flex items-start justify-center pt-[20vh] z-[100]" onClick={() => setIsOpen(false)}>
      <div className="bg-[#111] border border-gray-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <span className="text-gray-500">🔍</span>
          <input 
            autoFocus
            type="text" 
            placeholder="Type a command or search..." 
            className="flex-1 bg-transparent border-none text-gray-900 focus:outline-none focus:ring-0"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <kbd className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">ESC</kbd>
        </div>
        
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 p-8">No results found.</p>
          ) : (
            filtered.map((action, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsOpen(false)
                  router.push(action.href)
                }}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-900 text-sm transition-colors flex items-center justify-between group"
              >
                <span>{action.label}</span>
                <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{action.section}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
