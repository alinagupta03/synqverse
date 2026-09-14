"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"

const navItems = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/account", label: "Account & Data" },
  { href: "/settings/privacy", label: "Privacy" },
  { href: "/settings/security", label: "Security" },
  { href: "/settings/ai", label: "AI Preferences" },
]

export function SettingsSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile Header Toggle */}
      <div className="md:hidden bg-[#111827] text-white p-4 flex justify-between items-center border-b border-gray-800">
        <h2 className="text-lg font-bold">Settings</h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             {isMobileMenuOpen ? (
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             ) : (
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
             )}
          </svg>
        </button>
      </div>

      {/* Sidebar Container */}
      <div className={`
        ${isMobileMenuOpen ? 'block' : 'hidden'} 
        md:block w-full md:w-64 border-r border-gray-800 p-6 flex-col bg-[#111827] text-white
        transition-all duration-300 md:min-h-screen
      `}>
        <h2 className="text-xl font-bold mb-6 text-white hidden md:block">Settings</h2>
        
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "text-[#FF6B00] bg-[#FF6B00]/10 border-l-4 border-[#FF6B00]" 
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 md:mt-auto pt-6 border-t border-gray-800">
          <Link 
            href="/dashboard" 
            className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors mb-4"
          >
            ← Back to App
          </Link>
          <div className="flex items-center justify-between px-4">
             <span className="text-sm font-medium text-gray-400">Theme</span>
             <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  )
}
