"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar"

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const id = params?.id as string
  const [workspaceName, setWorkspaceName] = useState("Workspace")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (id) {
      fetch(`/api/workspace/${id}`)
        .then(r => r.json())
        .then(d => { if (d.name) setWorkspaceName(d.name) })
        .catch(() => {})
    }
  }, [id])

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden">
      {/* Mobile Toggle Bar */}
      <div className="md:hidden absolute top-0 left-0 w-full h-14 border-b border-border bg-[#0a0a0a] z-50 flex items-center px-4 justify-between">
        <span className="font-bold text-foreground text-sm">{workspaceName}</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-foreground p-2">
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${mobileMenuOpen ? 'absolute inset-0 z-40 bg-muted pt-14 flex' : 'hidden'} md:relative md:pt-0 md:flex w-full md:w-auto h-full`}>
        <WorkspaceSidebar workspaceName={workspaceName} />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0">
        {children}
      </main>
    </div>
  )
}
