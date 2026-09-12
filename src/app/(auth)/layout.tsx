import { BrandLogo } from "@/components/ui/BrandLogo"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 relative bg-gray-50">
      <div className="flex flex-col justify-center items-center p-8 z-10 relative">
         <div className="absolute top-8 left-8">
            <Link href="/"><BrandLogo /></Link>
         </div>
         <div className="w-full max-w-sm">
            {children}
         </div>
      </div>
      <div className="hidden md:flex bg-gray-50 relative overflow-hidden items-center justify-center p-12 border-l border-gray-200">
          {/* Brand background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          <div className="absolute w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
          
          <div className="relative z-10 text-center glass p-12 rounded-3xl max-w-md">
             <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Connect. Build. Innovate.</h2>
             <p className="text-gray-500 text-lg">
                Join the network where ideas turn into reality. Discover students with the skills and ambition you need.
             </p>
          </div>
      </div>
    </div>
  )
}
