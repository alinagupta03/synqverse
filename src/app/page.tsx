"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/ui/BrandLogo"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-foreground selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 glass border-b-0 border-gray-200">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <BrandLogo />
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
            <Link href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</Link>
            <Link href="#why-synqverse" className="hover:text-gray-900 transition-colors">Why Synqverse?</Link>
            <Link href="#impact" className="hover:text-gray-900 transition-colors">Idea &rarr; Impact</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/discover">
              <Button variant="ghost" className="text-gray-500 hover:text-gray-900">Discover</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-gray-500 hover:text-gray-900">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-orange-500 text-white hover:bg-orange-600">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100 via-gray-50 to-gray-50 -z-10" />
        
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-w-2xl relative z-10">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] flex flex-col gap-2 text-gray-900">
                <span className="block">6 builders. 1 idea.</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-400 block">Let's make it real.</span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-500 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Build with people who think like you. Synqverse connects ambitious students to form highly-skilled teams and turns college ideas into fully-fledged startups.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-orange-500 text-white hover:bg-orange-600 active:scale-95 transition-transform">
                  Enter Workspace
                </Button>
              </Link>
              <Link href="/discover">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-gray-200 hover:bg-gray-100 active:scale-95 transition-transform">
                  Discover Talent
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Hero Visual: Network Nodes */}
          <div className="relative h-[400px] sm:h-[500px] w-full mt-12 lg:mt-0">
             {mounted && <NetworkAnimation />}
          </div>
        </div>
      </section>

      {/* Features & Sections */}
      <section id="how-it-works" className="py-24 bg-gray-50 relative border-t border-gray-200">
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

      <section className="py-24 bg-gray-50 relative border-t border-gray-200">
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
    <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
  )
}

function NetworkAnimation() {
  const nodes = [
    { label: "AI", x: "20%", y: "20%", z: 40, rx: 15, ry: -20 },
    { label: "Design", x: "80%", y: "30%", z: 80, rx: -10, ry: 25 },
    { label: "Coding", x: "50%", y: "50%", z: 0, rx: 0, ry: 0 },
    { label: "Research", x: "30%", y: "80%", z: 60, rx: 20, ry: 10 },
    { label: "Business", x: "70%", y: "70%", z: 20, rx: -15, ry: -10 },
    { label: "Marketing", x: "10%", y: "50%", z: 90, rx: 5, ry: 30 },
  ]

  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
      <motion.div 
        className="w-full h-full relative"
        animate={{ rotateX: [0, 5, 0], rotateY: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {nodes.map((node, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-24 rounded-full border border-gray-300 bg-white/80 shadow-xl flex items-center justify-center text-xs font-mono text-gray-700 z-10 backdrop-blur-md"
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
            whileHover={{ scale: 1.1, z: node.z + 50, transition: { duration: 0.2 } }}
          >
            {node.label}
          </motion.div>
        ))}
        
        {/* Central connection point */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-orange-500/30 bg-orange-500/10 flex items-center justify-center z-20 backdrop-blur-md shadow-2xl"
          initial={{ scale: 0, opacity: 0, z: -100 }}
          animate={{ scale: 1, opacity: 1, z: 50 }}
          transition={{ delay: 2, duration: 1.2, type: "spring", bounce: 0.5 }}
          whileHover={{ scale: 1.05, z: 80, transition: { duration: 0.3 } }}
        >
          <span className="text-orange-600 font-bold tracking-tight shadow-sm">Team formed — 6/6</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
