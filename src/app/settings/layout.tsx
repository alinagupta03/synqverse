import Link from "next/link"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-900">
      {/* Settings Sidebar */}
      <div className="w-full md:w-64 border-r border-gray-200 p-6 flex flex-col gap-2 bg-[#0a0a0a]">
        <h2 className="text-xl font-bold mb-6">Settings</h2>
        <Link href="/settings/profile" className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">Profile</Link>
        <Link href="/settings/account" className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors text-red-400">Account & Data</Link>
        <Link href="/settings/privacy" className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">Privacy</Link>
        <Link href="/settings/security" className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">Security</Link>
        <Link href="/settings/ai" className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">AI Preferences</Link>
        
        <div className="mt-auto pt-6 border-t border-gray-200">
          <Link href="/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">← Back to App</Link>
        </div>
      </div>
      
      {/* Settings Content */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
