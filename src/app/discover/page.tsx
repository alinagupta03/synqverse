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

  const handleAction = (actionName: string, id: string) => {
    setToast(`${actionName} successful for ${id}.`)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-foreground flex flex-col relative">
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-in slide-in-from-bottom-5">
          {toast}
        </div>
      )}
      <header className="h-16 border-b border-gray-200 flex items-center px-6 justify-between glass sticky top-0 z-50">
        <div className="flex items-center gap-8">
           <Link href="/dashboard"><BrandLogo showText={false} /></Link>
           <nav className="hidden md:flex gap-6 text-sm">
             <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 transition-colors">Dashboard</Link>
             <Link href="/discover" className="text-gray-900 font-medium">Discover</Link>
             <Link href="/network" className="text-gray-500 hover:text-gray-900 transition-colors">My Network</Link>
           </nav>
        </div>
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-xs font-bold text-blue-400">
             ME
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
                 className="bg-gray-100 border-gray-200"
               />
            </div>
            
            <div className="space-y-4">
               <h2 className="font-semibold border-b border-gray-200 pb-2">Filters</h2>
               
               <div className="space-y-2">
                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch</label>
                 <select 
                    className="w-full bg-gray-100 border border-gray-200 rounded-md p-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                 >
                    <option value="">All Branches</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Design">Design</option>
                 </select>
               </div>
               
               <div className="space-y-2">
                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Type</label>
                 <select className="w-full bg-gray-100 border border-gray-200 rounded-md p-2 text-sm text-gray-900 focus:outline-none">
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
               <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center border border-gray-200 rounded-2xl bg-gray-50">
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
                   <div key={p.id} className="p-6 glass rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 group flex flex-col h-full bg-white/50 backdrop-blur-md relative overflow-hidden">
                     {/* Premium decorative gradient orb */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                     
                     <div className="flex justify-between items-start mb-4 relative z-10">
                        <div>
                           <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{p.anonymousId}</h3>
                           <p className="text-sm text-gray-500 font-medium">
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
                                 <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-700 shadow-sm hover:border-blue-300 transition-colors cursor-default">
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
                        <Button variant="outline" size="sm" className="w-full border-gray-200 hover:bg-gray-50 hover:text-red-600 transition-colors text-xs font-semibold" onClick={() => handleAction('Pass', p.anonymousId)}>Pass</Button>
                        <Button variant="outline" size="sm" className="w-full border-gray-200 hover:bg-gray-50 hover:text-blue-600 transition-colors text-xs font-semibold" onClick={() => handleAction('Save', p.anonymousId)}>Save</Button>
                        <Button size="sm" className="w-full col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white mt-1 font-bold shadow-md hover:shadow-lg transition-all" onClick={() => handleAction('Connect', p.anonymousId)}>Connect</Button>
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
