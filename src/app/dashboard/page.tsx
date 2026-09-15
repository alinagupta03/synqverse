"use client"

import { BrandLogo } from "@/components/ui/BrandLogo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { StudentCard } from "@/components/dashboard/StudentCard"
import { StudentProfileModal, type StudentProfile } from "@/components/dashboard/StudentProfileModal"
import { ThemeToggle } from "@/components/ThemeToggle"

type ActivityItem = {
  id: string
  type: string
  title: string
  description: string
  timeAgo: string
  timestamp: string
  dotColor: string
}

export default function DashboardPage() {
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [loadingActivity, setLoadingActivity] = useState(true)

  const handleViewProfile = (student: StudentProfile) => {
    setSelectedStudent(student)
    setIsProfileModalOpen(true)
  }

  const syncLiveActivity = useCallback(async () => {
    try {
      const [actRes, connRes] = await Promise.all([
        fetch("/api/dashboard/activity"),
        fetch("/api/connections?type=received")
      ])
      
      if (actRes.ok) {
        const actData = await actRes.json()
        if (actData?.activities) {
          setActivities(actData.activities)
        }
      }

      if (connRes.ok) {
        const connData = await connRes.json()
        if (Array.isArray(connData)) {
          setPendingRequests(connData)
        }
      }
    } catch (error) {
      console.error("Failed to sync live activity:", error)
    } finally {
      setLoadingActivity(false)
    }
  }, [])

  useEffect(() => {
    syncLiveActivity()

    // 1. Listen for instant event triggers across components
    const handleUpdate = () => syncLiveActivity()
    window.addEventListener("synq-activity-update", handleUpdate)
    window.addEventListener("focus", handleUpdate)

    // 2. Real-time background sync polling every 5 seconds
    const interval = setInterval(syncLiveActivity, 5000)

    return () => {
      window.removeEventListener("synq-activity-update", handleUpdate)
      window.removeEventListener("focus", handleUpdate)
      clearInterval(interval)
    }
  }, [syncLiveActivity])

  const handleConnectionAction = async (connectionId: string, action: string) => {
    try {
      await fetch("/api/connections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId, action })
      })
      syncLiveActivity()
    } catch (e) {
      console.error(e)
    }
  }

  const RECOMMENDED_STUDENTS: StudentProfile[] = [
    {
      id: "1",
      name: "Anonymous Student #8271",
      branch: "B.Tech ECE • 2nd Year",
      match: 95,
      description: "Looking for a frontend dev to build an AI SaaS project for an upcoming hackathon.",
      skills: ["Machine Learning", "Python"]
    },
    {
      id: "2",
      name: "Anonymous Student #1920",
      branch: "B.Des Design • 3rd Year",
      match: 88,
      description: "UI/UX designer with experience in Framer. Want to join a fast-paced startup team.",
      skills: ["Figma", "UI Design"]
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <StudentProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        student={selectedStudent} 
      />
      <header className="h-16 border-b border-border flex items-center px-6 justify-between glass sticky top-0 z-40">
        <div className="flex items-center gap-8">
           <Link href="/dashboard"><BrandLogo showText={false} /></Link>
           <nav className="hidden md:flex gap-6 text-sm">
             <Link href="/dashboard" className="text-foreground font-medium">Dashboard</Link>
             <Link href="/discover" className="text-muted-foreground hover:text-foreground transition-colors">Discover</Link>
             <Link href="/teams" className="text-muted-foreground hover:text-foreground transition-colors">Teams</Link>
             <Link href="/connections" className="text-muted-foreground hover:text-foreground transition-colors">Connections</Link>
             <Link href="/messages" className="text-muted-foreground hover:text-foreground transition-colors">Messages</Link>
           </nav>
        </div>
        <div className="flex items-center gap-4 relative">
           <ThemeToggle />
           <button 
             className="w-9 h-9 rounded-full bg-orange-500/10 border border-orange-500 flex items-center justify-center text-xs font-bold text-orange-600 hover:bg-orange-500/20 transition cursor-pointer outline-none focus:ring-2 focus:ring-orange-500/50"
             onClick={(e) => {
                e.stopPropagation()
                const menu = document.getElementById('profile-menu')
                if (menu) menu.classList.toggle('hidden')
             }}
           >
             ME
           </button>
           
           <div 
             id="profile-menu" 
             className="hidden absolute top-12 right-0 w-56 bg-card text-card-foreground border border-border rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
           >
             <div className="px-4 py-2 border-b border-border mb-1">
                <p className="text-sm font-semibold text-foreground">My Account</p>
                <p className="text-xs text-muted-foreground truncate">student@synqverse.com</p>
             </div>
             <Link href="/settings/profile" className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-orange-500 transition-colors">
                View Profile
             </Link>
             <Link href="/settings" className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-orange-500 transition-colors">
                Settings
             </Link>
             <div className="border-t border-border mt-1 pt-1">
               <Link href="/login" className="block px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors font-medium">
                  Log out
               </Link>
             </div>
           </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div>
               <h1 className="text-3xl font-bold mb-2 tracking-tight text-foreground">Welcome back</h1>
               <p className="text-muted-foreground">Here is what's happening in your live network.</p>
            </div>

            <section>
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Recommended Teammates</h2>
                  <Link href="/discover" className="text-sm text-blue-500 hover:text-blue-400 font-medium">View all &rarr;</Link>
               </div>
               
               <div className="grid md:grid-cols-2 gap-4">
                  {RECOMMENDED_STUDENTS.map(student => (
                    <StudentCard 
                      key={student.id} 
                      student={student} 
                      onViewProfile={handleViewProfile} 
                    />
                  ))}
               </div>
            </section>

            <section>
               <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-semibold text-foreground">Pending Connections</h2>
                 {pendingRequests.length > 0 && (
                   <Link href="/connections" className="text-xs font-semibold text-orange-500 hover:underline">
                     Manage ({pendingRequests.length})
                   </Link>
                 )}
               </div>

               {pendingRequests.length === 0 ? (
                 <div className="p-10 glass rounded-2xl border border-border border-dashed text-center bg-card">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
                       <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                       </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-1 text-foreground">No pending requests</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">When you request to connect with someone or they request you, it will appear here.</p>
                    <Link href="/discover"><Button variant="outline" className="border-border text-foreground hover:bg-muted font-medium">Start Networking</Button></Link>
                 </div>
               ) : (
                 <div className="space-y-3">
                   {pendingRequests.slice(0, 3).map((req) => (
                     <div key={req.id} className="p-4 glass rounded-xl border border-border flex items-center justify-between gap-4 bg-card">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-sm font-bold text-orange-500 shrink-0">
                           {(req.sender?.anonymousId || "ST").slice(0, 2).toUpperCase()}
                         </div>
                         <div>
                           <p className="text-sm font-semibold text-foreground">{req.sender?.anonymousId || "Student"}</p>
                           <p className="text-xs text-muted-foreground">{req.sender?.academic?.branch || "Student"} • Wants to connect</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-2 shrink-0">
                         <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3" onClick={() => handleConnectionAction(req.id, "ACCEPT")}>
                           Accept
                         </Button>
                         <Button size="sm" variant="outline" className="border-border hover:bg-muted text-xs px-3" onClick={() => handleConnectionAction(req.id, "DECLINE")}>
                           Decline
                         </Button>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </section>
         </div>

         <div className="space-y-6">
            <div className="p-6 glass rounded-2xl border border-blue-500/30 bg-blue-500/5">
               <h3 className="font-semibold mb-1 text-blue-500 dark:text-blue-400 uppercase tracking-wider text-xs">Current Goal</h3>
               <p className="text-lg font-semibold text-foreground mb-4">Build a Startup Team</p>
               <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                     <span>Profile Completion</span>
                     <span className="text-foreground font-semibold">100%</span>
                  </div>
                  <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                     <div className="bg-blue-500 w-full h-full rounded-full"></div>
                  </div>
               </div>
            </div>

            <div className="p-6 glass rounded-2xl border border-border bg-card text-card-foreground">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="font-bold text-foreground">Recent Activity</h3>
                 <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                   Live Sync
                 </span>
               </div>

               {loadingActivity ? (
                 <div className="py-8 flex justify-center">
                   <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                 </div>
               ) : activities.length === 0 ? (
                 <p className="text-xs text-muted-foreground py-4 text-center">No recent activity found.</p>
               ) : (
                 <div className="space-y-4">
                   {activities.map(act => (
                     <div key={act.id} className="flex gap-3 text-sm items-start">
                        <div className={`w-2 h-2 mt-1.5 rounded-full ${act.dotColor} shrink-0`}></div>
                        <div className="min-w-0 flex-1">
                           <p className="text-foreground font-medium text-xs sm:text-sm">{act.title}</p>
                           <p className="text-muted-foreground text-xs line-clamp-1">{act.description}</p>
                           <p className="text-muted-foreground text-[10px] mt-0.5">{act.timeAgo}</p>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
         </div>
      </main>
    </div>
  )
}
