"use client"

import { BrandLogo } from "@/components/ui/BrandLogo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { StudentCard } from "@/components/dashboard/StudentCard"
import { StudentProfileModal, type StudentProfile } from "@/components/dashboard/StudentProfileModal"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function DashboardPage() {
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const handleViewProfile = (student: StudentProfile) => {
    setSelectedStudent(student)
    setIsProfileModalOpen(true)
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
      <header className="h-16 border-b border-gray-200 flex items-center px-6 justify-between glass sticky top-0 z-40">
        <div className="flex items-center gap-8">
           <Link href="/dashboard"><BrandLogo showText={false} /></Link>
           <nav className="hidden md:flex gap-6 text-sm">
             <Link href="/dashboard" className="text-gray-900 font-medium">Dashboard</Link>
             <Link href="/discover" className="text-gray-500 hover:text-gray-900 transition-colors">Discover</Link>
             <Link href="/teams" className="text-gray-500 hover:text-gray-900 transition-colors">Teams</Link>
             <Link href="/connections" className="text-gray-500 hover:text-gray-900 transition-colors">Connections</Link>
             <Link href="/messages" className="text-gray-500 hover:text-gray-900 transition-colors">Messages</Link>
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
           
           {/* Robust click-based dropdown menu (no hover disappearing) */}
           <div 
             id="profile-menu" 
             className="hidden absolute top-12 right-0 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
           >
             <div className="px-4 py-2 border-b border-gray-100 mb-1">
                <p className="text-sm font-semibold text-gray-900">My Account</p>
                <p className="text-xs text-gray-500 truncate">student@synqverse.com</p>
             </div>
             <Link href="/settings/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors">
                View Profile
             </Link>
             <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors">
                Settings
             </Link>
             <div className="border-t border-gray-100 mt-1 pt-1">
               <Link href="/login" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
                  Log out
               </Link>
             </div>
           </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div>
               <h1 className="text-3xl font-bold mb-2 tracking-tight text-[#111827] dark:text-white">Welcome back</h1>
               <p className="text-gray-700 dark:text-gray-300">Here is what's happening in your network.</p>
            </div>

            <section>
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-[#111827] dark:text-white">Recommended Teammates</h2>
                  <Link href="/discover" className="text-sm text-blue-400 hover:text-blue-300">View all &rarr;</Link>
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
               <h2 className="text-xl font-semibold mb-4 text-[#111827] dark:text-white">Pending Connections</h2>
               <div className="p-12 glass rounded-2xl border border-gray-200 border-dashed text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 border border-gray-200">
                     <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                     </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No pending requests</h3>
                  <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">When you request to connect with someone or they request you, it will appear here.</p>
                  <Link href="/discover"><Button variant="outline" className="border-gray-200 text-gray-900">Start Networking</Button></Link>
               </div>
            </section>
         </div>

         <div className="space-y-6">
            <div className="p-6 glass rounded-2xl border border-blue-500/30 bg-blue-500/5">
               <h3 className="font-semibold mb-1 text-blue-400 uppercase tracking-wider text-xs">Current Goal</h3>
               <p className="text-lg font-semibold text-gray-900 mb-4">Build a Startup Team</p>
               <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                     <span>Profile Completion</span>
                     <span className="text-gray-900">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-blue-500 w-full h-full rounded-full"></div>
                  </div>
               </div>
            </div>

            <div className="p-6 glass rounded-2xl border border-border bg-card text-card-foreground">
               <h3 className="font-bold mb-4 text-[#111827] dark:text-white">Recent Activity</h3>
               <div className="space-y-4">
                  <div className="flex gap-3 text-sm">
                     <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500"></div>
                     <div>
                        <p className="text-gray-900">Created your anonymous identity</p>
                        <p className="text-gray-500 text-xs">2 hours ago</p>
                     </div>
                  </div>
                  <div className="flex gap-3 text-sm">
                     <div className="w-2 h-2 mt-1.5 rounded-full bg-gray-300"></div>
                     <div>
                        <p className="text-gray-900">Completed onboarding</p>
                        <p className="text-gray-500 text-xs">2 hours ago</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </main>
    </div>
  )
}
