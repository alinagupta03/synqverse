import { BrandLogo } from "@/components/ui/BrandLogo"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 relative bg-muted">
      <div className="flex flex-col justify-center items-center p-8 z-10 relative">
         <div className="absolute top-8 left-8">
            <Link href="/"><BrandLogo /></Link>
         </div>
         <div className="w-full max-w-sm">
            {children}
         </div>
      </div>
      <div className="hidden md:flex bg-gray-900 relative overflow-hidden items-center justify-center p-12 border-l border-border">
          {/* Brand background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-black/80" />
          <div className="absolute w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500 via-transparent to-transparent"></div>
          
          <div className="relative z-10 text-center bg-black/40 backdrop-blur-xl border border-white/10 p-12 rounded-[2rem] max-w-md shadow-2xl">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-orange-500/20">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
             </div>
             <h2 className="text-4xl font-black mb-4 text-white tracking-tight">Connect. <span className="text-orange-500">Build.</span> Innovate.</h2>
             <p className="text-gray-300 text-lg leading-relaxed font-medium">
                Join the network where ideas turn into reality. Discover students with the skills and ambition you need.
             </p>
          </div>
      </div>
    </div>
  )
}
