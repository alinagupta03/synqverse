import * as React from "react"
import { cn } from "@/lib/utils"

export function BrandLogo({ className, showText = true }: { className?: string, showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2 text-gray-900", className)}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2L2 9L16 16L30 9L16 2Z" fill="currentColor" fillOpacity="0.2"/>
        <path d="M2 23L16 30L30 23V9L16 16L2 9V23Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M16 16V30" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="16" cy="16" r="3" fill="currentColor"/>
        <circle cx="16" cy="2" r="2" fill="currentColor"/>
        <circle cx="2" cy="9" r="2" fill="currentColor"/>
        <circle cx="30" cy="9" r="2" fill="currentColor"/>
        <circle cx="2" cy="23" r="2" fill="currentColor"/>
        <circle cx="30" cy="23" r="2" fill="currentColor"/>
        <circle cx="16" cy="30" r="2" fill="currentColor"/>
      </svg>
      {showText && <span className="font-bold text-xl tracking-tighter">SYNQVERSE</span>}
    </div>
  )
}
