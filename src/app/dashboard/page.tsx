"use client"

import { BrandLogo } from "@/components/ui/BrandLogo"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-foreground flex flex-col">
      <header className="h-16 border-b border-gray-200 flex items-center px-6 justify-between glass sticky top-0 z-50">
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
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-xs font-bold text-blue-400">
             ME
           </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div>
               <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome back</h1>
               <p className="text-gray-500">Here is what's happening in your network.</p>
            </div>

            <section>
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Recommended Teammates</h2>
                  <Link href="/discover" className="text-sm text-blue-400 hover:text-blue-300">View all &rarr;</Link>
               </div>
               
               <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 glass rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <h3 className="font-bold text-lg text-gray-900">Anonymous Student #8271</h3>
                          <p className="text-sm text-gray-500">B.Tech ECE • 2nd Year</p>
                       </div>
                       <div className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">
                          95% Match
                       </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">"Looking for a frontend dev to build an AI SaaS project for an upcoming hackathon."</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                       <span className="text-xs px-2 py-1 rounded bg-gray-100 border border-gray-200">Machine Learning</span>
                       <span className="text-xs px-2 py-1 rounded bg-gray-100 border border-gray-200">Python</span>
                    </div>
                    <Link href="/discover"><Button variant="outline" className="w-full border-gray-200 text-gray-900 hover:bg-gray-100">View Profile</Button></Link>
                  </div>

                  <div className="p-6 glass rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <h3 className="font-bold text-lg text-gray-900">Anonymous Student #1920</h3>
                          <p className="text-sm text-gray-500">B.Des Design • 3rd Year</p>
                       </div>
                       <div className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">
                          88% Match
                       </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">"UI/UX designer with experience in Framer. Want to join a fast-paced startup team."</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                       <span className="text-xs px-2 py-1 rounded bg-gray-100 border border-gray-200">Figma</span>
                       <span className="text-xs px-2 py-1 rounded bg-gray-100 border border-gray-200">UI Design</span>
                    </div>
                    <Link href="/discover"><Button variant="outline" className="w-full border-gray-200 text-gray-900 hover:bg-gray-100">View Profile</Button></Link>
                  </div>
               </div>
            </section>

            <section>
               <h2 className="text-xl font-semibold mb-4">Pending Connections</h2>
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

            <div className="p-6 glass rounded-2xl border border-gray-200">
               <h3 className="font-semibold mb-4">Recent Activity</h3>
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
