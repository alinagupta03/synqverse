"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/ui/BrandLogo"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Check auth state (basic check for demonstration)
    setIsAuthenticated(document.cookie.includes("supabase-auth-token") || localStorage.getItem("auth-token") !== null)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-orange-500/30 overflow-x-hidden font-sans">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 glass bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <BrandLogo />
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Link href="#how-it-works" className="hover:text-[#FF6B00] dark:hover:text-[#FF6B00] transition-colors duration-200">How it works</Link>
            <Link href="#why-synqverse" className="hover:text-[#FF6B00] dark:hover:text-[#FF6B00] transition-colors duration-200">Why Synqverse?</Link>
            <Link href="#idea-impact" className="hover:text-[#FF6B00] dark:hover:text-[#FF6B00] transition-colors duration-200">Idea &rarr; Impact</Link>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/discover" className="text-gray-700 dark:text-gray-300 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] transition-colors duration-200 font-medium text-sm">
              Discover
            </Link>
            <ThemeToggle />
            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] font-semibold">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-orange-500 text-white hover:bg-orange-600 font-semibold shadow-md">Sign up</Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard">
                <div className="w-9 h-9 rounded-full bg-orange-500/10 border border-orange-500 flex items-center justify-center text-xs font-bold text-orange-600 hover:bg-orange-500/20 transition cursor-pointer">
                  ME
                </div>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle & Theme Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button className="p-2 text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                 )}
               </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
           <div className="md:hidden bg-white dark:bg-[#0F172A] border-b border-gray-200 dark:border-gray-800 px-6 py-4 shadow-lg flex flex-col gap-4">
             <Link href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-[#111827] dark:text-gray-300 font-medium py-2 border-b border-gray-100 dark:border-gray-800 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] transition-colors duration-200">How it works</Link>
             <Link href="#why-synqverse" onClick={() => setIsMobileMenuOpen(false)} className="text-[#111827] dark:text-gray-300 font-medium py-2 border-b border-gray-100 dark:border-gray-800 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] transition-colors duration-200">Why Synqverse?</Link>
             <Link href="#idea-impact" onClick={() => setIsMobileMenuOpen(false)} className="text-[#111827] dark:text-gray-300 font-medium py-2 border-b border-gray-100 dark:border-gray-800 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] transition-colors duration-200">Idea &rarr; Impact</Link>
             <Link href="/discover" onClick={() => setIsMobileMenuOpen(false)} className="text-[#111827] dark:text-gray-300 font-medium py-2 border-b border-gray-100 dark:border-gray-800 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] transition-colors duration-200">Discover</Link>
             
             {!isAuthenticated ? (
               <div className="flex flex-col gap-3 mt-2">
                 <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                   <Button variant="outline" className="w-full border-gray-300 text-gray-900 font-semibold">Log in</Button>
                 </Link>
                 <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                   <Button className="w-full bg-orange-500 text-white font-semibold">Sign up</Button>
                 </Link>
               </div>
             ) : (
               <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                 <Button className="w-full bg-orange-500 text-white font-semibold">Go to Dashboard</Button>
               </Link>
             )}
           </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-white -z-10" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gray-300/20 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="container mx-auto relative min-h-[60vh] flex flex-col items-center justify-center text-center">
          
          {/* Floating Nodes - Left Side */}
          <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-1/4 h-full pointer-events-none">
             {mounted && <NetworkAnimation side="left" />}
          </div>
          
          {/* Floating Nodes - Right Side */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-1/4 h-full pointer-events-none">
             {mounted && <NetworkAnimation side="right" />}
          </div>

          <div className="space-y-8 max-w-4xl relative z-10 mx-auto px-4">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-[#111827] dark:text-white drop-shadow-sm">
                <span className="block mb-2">6 builders. 1 idea.</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 block">Let's make it real.</span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Build with people who think like you. Synqverse connects ambitious students to form highly-skilled teams and turns college ideas into fully-fledged startups.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-6 justify-center items-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg font-bold bg-gray-900 text-white hover:bg-black active:scale-95 transition-all shadow-xl hover:shadow-2xl">
                  Enter Workspace
                </Button>
              </Link>
              <Link href="/discover">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg font-bold border-2 border-gray-300 text-gray-800 hover:bg-gray-100 hover:border-gray-400 active:scale-95 transition-all bg-white shadow-sm hover:shadow-md dark:bg-transparent dark:border-gray-600 dark:text-white dark:hover:border-[#FF6B00] dark:hover:text-[#FF6B00]">
                  Discover Talent
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
               className="pt-16 mx-auto flex justify-center"
               initial={{ opacity: 0, y: 50, scale: 0.8 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               transition={{ duration: 0.8, delay: 0.6, type: "spring", bounce: 0.5 }}
            >
                <div className="w-56 h-56 md:w-64 md:h-64 rounded-full border-4 border-orange-500/20 bg-gradient-to-br from-white to-orange-50 flex items-center justify-center z-20 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors duration-500" />
                  <div className="absolute inset-2 rounded-full border border-orange-500/10 border-dashed animate-[spin_20s_linear_infinite]" />
                  <div className="text-center relative z-10 px-4">
                    <span className="block text-4xl font-black text-orange-600 mb-1">6/6</span>
                    <span className="text-sm md:text-base text-gray-800 font-bold uppercase tracking-wider">Team Formed</span>
                  </div>
                </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features & Sections */}
      <section id="how-it-works" className="py-24 bg-background relative border-t border-border">
         <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8">
               <FeatureStep num="01" title="Discover" desc="Find top talent matching your needs." />
               <FeatureStep num="02" title="Connect" desc="Network securely and seamlessly." />
               <FeatureStep num="03" title="Build a team" desc="Lock in your crew for the project." />
               <FeatureStep num="04" title="Create a workspace" desc="Collaborate in private, dedicated channels." />
               <FeatureStep num="05" title="Turn ideas into impact" desc="Ship your project and get mentored." />
            </div>
         </div>
      </section>

      {/* More sections below... */}
      <section id="why-synqverse" className="py-24 glass relative">
         <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">Why Synqverse?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <FeatureBox title="Smart matching" />
               <FeatureBox title="Anonymous discovery" />
               <FeatureBox title="Secure collaboration" />
               <FeatureBox title="Innovation support" />
            </div>
         </div>
      </section>

      <section id="idea-impact" className="py-24 bg-background relative border-t border-border">
         <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16">Built for</h2>
            <div className="flex flex-wrap justify-center gap-4">
               {['Hackathons', 'College projects', 'Startups', 'Research', 'Open Source', 'Competitions'].map(t => (
                  <span key={t} className="px-6 py-3 rounded-full border border-gray-200 text-lg text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors cursor-default">
                    {t}
                  </span>
               ))}
            </div>
         </div>
      </section>

      <footer className="py-12 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>Student-focused safety & privacy first.</p>
        <p className="mt-4">&copy; 2026 SYNQVERSE. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureStep({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="space-y-4">
      <div className="text-blue-500 font-mono text-xl">{num}</div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-500">{desc}</p>
    </div>
  )
}

function FeatureBox({ title }: { title: string }) {
  return (
    <div className="p-6 rounded-2xl border border-border bg-card text-card-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <h3 className="font-semibold">{title}</h3>
    </div>
  )
}

function NetworkAnimation({ side }: { side: "left" | "right" }) {
  const leftNodes = [
    { label: "AI", x: "10%", y: "20%", z: 40, rx: 15, ry: -20 },
    { label: "Coding", x: "30%", y: "50%", z: 0, rx: 0, ry: 0 },
    { label: "Marketing", x: "10%", y: "80%", z: 90, rx: 5, ry: 30 },
  ]
  const rightNodes = [
    { label: "Design", x: "70%", y: "30%", z: 80, rx: -10, ry: 25 },
    { label: "Business", x: "80%", y: "60%", z: 20, rx: -15, ry: -10 },
    { label: "Research", x: "60%", y: "90%", z: 60, rx: 20, ry: 10 },
  ]
  
  const nodes = side === "left" ? leftNodes : rightNodes

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ perspective: "1000px" }}>
      <motion.div 
        className="w-full h-full relative"
        animate={{ rotateX: [0, 5, 0], rotateY: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {nodes.map((node, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-24 rounded-full border border-gray-200 bg-white shadow-lg flex items-center justify-center text-xs font-bold text-gray-800 z-10 backdrop-blur-md"
            initial={{ left: "50%", top: "50%", opacity: 0, scale: 0.5, rotateX: 0, rotateY: 0, z: 0 }}
            animate={{ 
              left: node.x, 
              top: node.y, 
              opacity: 1, 
              scale: 1,
              rotateX: node.rx,
              rotateY: node.ry,
              z: node.z
            }}
            transition={{ duration: 1.5, delay: 0.5 + i * 0.15, type: "spring", bounce: 0.4 }}
          >
            {node.label}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
