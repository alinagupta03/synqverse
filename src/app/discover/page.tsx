"use client"

import { useEffect, useState } from "react"
import { BrandLogo } from "@/components/ui/BrandLogo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

type Profile = {
  id: string
  anonymousId: string
  branch: string | null
  stream: string | null
  year: string | null
  skills: string[]
  interests: string[]
  lookingFor: string | null
  availability: string | null
  projectTypes: string[]
  matchScore: number
  matchExplanation: string
}

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  // Connect Modal State
  const [connectModalOpen, setConnectModalOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [connectNote, setConnectNote] = useState("")
  
  // Filters
  const [branchFilter, setBranchFilter] = useState("")

  useEffect(() => {
    fetchProfiles()
  }, [search, branchFilter])

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('q', search)
      if (branchFilter) params.append('branch', branchFilter)
      
      const res = await fetch(`/api/discover?${params.toString()}`)
      const data = await res.json()
      setProfiles(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const [toast, setToast] = useState<string | null>(null)

  const handleAction = (actionName: string, p?: Profile) => {
    if (actionName === 'Connect' && p) {
      setSelectedProfile(p)
      setConnectModalOpen(true)
      return
    }
    setToast(`${actionName} successful.`)
    setTimeout(() => setToast(null), 3000)
  }

  const sendConnectionRequest = async () => {
    if (!selectedProfile) return
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: selectedProfile.id })
      })
      const data = await res.json()
      if (data.error) {
        setToast(data.error)
      } else {
        setToast(`Connection request sent to ${selectedProfile.anonymousId}!`)
        // Trigger live activity sync across pages
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("synq-activity-update"))
        }
      }
    } catch {
      setToast("Failed to send connection request. Please try again.")
    } finally {
      setConnectModalOpen(false)
      setConnectNote("")
      setTimeout(() => setToast(null), 3000)
    }
  }

  const ALL_BRANCHES = [
    "CSE", "IT", "ECE", "EEE", "Mechanical", "Civil", 
    "Chemical", "Aerospace", "AI & Data Science", "Biotechnology", "Design"
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-in slide-in-from-bottom-5">
          {toast}
        </div>
      )}
      {/* Connect Modal */}
      {connectModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConnectModalOpen(false)} />
           <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-2xl max-w-md w-full relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6">
                 <h2 className="text-xl font-bold mb-1">{selectedProfile.anonymousId}</h2>
                 <p className="text-sm text-gray-500 mb-6">{selectedProfile.stream} {selectedProfile.branch} • {selectedProfile.year}</p>
                 
                 <div className="mb-6">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Interests & Skills</label>
                    <div className="flex flex-wrap gap-2">
                       {[...(selectedProfile.skills || []), ...(selectedProfile.interests || [])].slice(0, 6).map(tag => (
                          <span key={tag} className="text-xs px-2.5 py-1 bg-gray-100 rounded-md border border-gray-300 text-black font-semibold shadow-sm">{tag}</span>
                       ))}
                    </div>
                 </div>

                 <div className="mb-6">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Add a note (optional)</label>
                    <textarea 
                       className="w-full bg-card dark:bg-[#1E293B] border border-border rounded-xl p-3 text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none h-24"
                       placeholder="Hi! I saw we share an interest in..."
                       value={connectNote}
                       onChange={(e) => setConnectNote(e.target.value)}
                    ></textarea>
                 </div>
                 
                 <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setConnectModalOpen(false)}>Cancel</Button>
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold" onClick={sendConnectionRequest}>
                       Send Connection Request
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <header className="h-16 border-b border-border flex items-center px-6 justify-between glass sticky top-0 z-50">
        <div className="flex items-center gap-8">
           <Link href="/dashboard"><BrandLogo showText={false} /></Link>
           <nav className="hidden md:flex gap-6 text-sm">
             <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 transition-colors">Dashboard</Link>
             <Link href="/discover" className="text-gray-900 font-medium">Discover</Link>
             <Link href="/connections" className="text-gray-500 hover:text-gray-900 transition-colors">My Network</Link>
           </nav>
        </div>
        <div className="flex items-center gap-4 relative">
           <button 
             className="w-9 h-9 rounded-full bg-orange-500/10 border border-orange-500 flex items-center justify-center text-xs font-bold text-orange-600 hover:bg-orange-500/20 transition cursor-pointer outline-none focus:ring-2 focus:ring-orange-500/50"
             onClick={(e) => {
                e.stopPropagation()
                const menu = document.getElementById('discover-profile-menu')
                if (menu) menu.classList.toggle('hidden')
             }}
           >
             ME
           </button>
           
           <div 
             id="discover-profile-menu" 
             className="hidden absolute top-12 right-0 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
           >
             <Link href="/settings/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors">
                View Profile
             </Link>
             <div className="border-t border-gray-100 mt-1 pt-1">
               <Link href="/login" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
                  Log out
               </Link>
             </div>
           </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8 p-6">
         {/* Filters Sidebar */}
         <aside className="w-full md:w-64 space-y-8 flex-shrink-0">
            <div>
               <h2 className="font-semibold mb-4">Search</h2>
               <Input 
                 placeholder="Search skills, interests..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="bg-muted border-border"
               />
            </div>
            
            <div className="space-y-4">
               <h2 className="font-semibold border-b border-gray-200 pb-2">Filters</h2>
               
               <div className="space-y-2">
                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch</label>
                 <div className="flex flex-wrap gap-2 mt-2">
                    <button 
                       className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${branchFilter === "" ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                       onClick={() => setBranchFilter("")}
                    >
                       All
                    </button>
                    {ALL_BRANCHES.map(branch => (
                       <button 
                         key={branch}
                         className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${branchFilter === branch ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                         onClick={() => setBranchFilter(branch)}
                       >
                         {branch}
                       </button>
                    ))}
                 </div>
               </div>
               
               <div className="space-y-2">
                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Type</label>
                 <select className="w-full bg-card dark:bg-[#1E293B] border border-border rounded-md p-2 text-sm text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors">
                    <option value="">All Projects</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Startup">Startup</option>
                 </select>
               </div>
               
               <Button variant="outline" className="w-full border-gray-200 text-gray-900" onClick={() => { setSearch(""); setBranchFilter(""); }}>
                 Clear Filters
               </Button>
            </div>
         </aside>

         {/* Results Area */}
         <div className="flex-1 flex flex-col min-w-0">
            <div className="flex justify-between items-center mb-6">
               <h1 className="text-2xl font-bold tracking-tight">Discover Students</h1>
               <div className="flex bg-gray-100 rounded-md border border-gray-200 p-1">
                  <button 
                     onClick={() => setViewMode("grid")}
                     className={`px-3 py-1 rounded text-sm transition-colors ${viewMode === "grid" ? "bg-gray-200 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
                  >
                     Grid
                  </button>
                  <button 
                     onClick={() => setViewMode("list")}
                     className={`px-3 py-1 rounded text-sm transition-colors ${viewMode === "list" ? "bg-gray-200 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
                  >
                     List
                  </button>
               </div>
            </div>

            {loading ? (
               <div className="flex-1 flex items-center justify-center min-h-[400px]">
                 <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
               </div>
            ) : profiles.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center border border-border rounded-2xl bg-card">
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                     <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                     </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No matches found</h3>
                  <p className="text-gray-500 max-w-sm">Your next teammate is out there. Try adjusting your filters or search terms.</p>
               </div>
            ) : (
               <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                 {profiles.map(p => (
                   <div key={p.id} className="p-6 glass rounded-2xl border border-border hover:border-blue-400 hover:shadow-xl transition-all duration-300 group flex flex-col h-full bg-card text-card-foreground relative overflow-hidden">
                     {/* Premium decorative gradient orb */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                     
                     <div className="flex justify-between items-start mb-4 relative z-10">
                        <div>
                           <h3 className="font-bold text-lg text-[#111827] dark:text-white mb-1 group-hover:text-blue-600 transition-colors">{p.anonymousId}</h3>
                           <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              {p.stream} {p.branch} • {p.year}
                           </p>
                        </div>
                        <div className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border ${p.matchScore > 75 ? 'text-green-700 bg-green-50 border-green-200' : p.matchScore > 40 ? 'text-yellow-700 bg-yellow-50 border-yellow-200' : 'text-slate-700 bg-slate-50 border-slate-200'}`}>
                           {p.matchScore}% Match
                        </div>
                     </div>
                     
                     {p.matchExplanation && (
                       <div className="text-xs text-blue-800 mb-5 bg-blue-50 p-3 rounded-lg italic border border-blue-100 shadow-inner relative z-10">
                          "{p.matchExplanation}"
                       </div>
                     )}

                     <div className="space-y-5 flex-1 relative z-10">
                        <div>
                           <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Top Skills</div>
                           <div className="flex flex-wrap gap-2">
                              {(p.skills || []).slice(0, 4).map(s => (
                                 <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-muted border border-border text-foreground shadow-sm hover:border-blue-300 transition-colors cursor-default">
                                    {s}
                                 </span>
                              ))}
                              {(p.skills || []).length > 4 && <span className="text-xs px-2 py-1 text-gray-400 font-medium">+{(p.skills || []).length - 4}</span>}
                           </div>
                        </div>
                        <div>
                           <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Interests</div>
                           <div className="flex flex-wrap gap-2">
                              {(p.interests || []).slice(0, 3).map(i => (
                                 <span key={i} className="text-xs text-gray-500 hover:text-blue-500 transition-colors cursor-pointer">
                                    #{i}
                                 </span>
                              ))}
                           </div>
                        </div>
                        {p.lookingFor && (
                           <div>
                              <div className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Looking for</div>
                              <p className="text-sm text-gray-700 leading-relaxed">{p.lookingFor}</p>
                           </div>
                        )}
                     </div>

                     <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-gray-100 relative z-10">
                        <Button variant="outline" size="sm" className="w-full border-gray-200 hover:bg-gray-50 hover:text-red-600 transition-colors text-xs font-semibold" onClick={() => handleAction('Pass')}>Pass</Button>
                        <Button variant="outline" size="sm" className="w-full border-gray-200 hover:bg-gray-50 hover:text-orange-600 transition-colors text-xs font-semibold" onClick={() => handleAction('Save')}>Save</Button>
                        <Button size="sm" className="w-full col-span-2 bg-orange-500 hover:bg-orange-600 text-white mt-1 font-bold shadow-md hover:shadow-lg transition-all" onClick={() => handleAction('Connect', p)}>Connect</Button>
                     </div>
                   </div>
                 ))}
               </div>
            )}
         </div>
      </main>
    </div>
  )
}
