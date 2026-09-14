"use client"

export default function PrivacySettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Privacy</h1>
        <p className="text-muted-foreground">Control who can see your information and manage blocked users.</p>
      </div>

      <div className="glass p-6 rounded-2xl border border-border space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-foreground font-medium">Anonymous Mode</h3>
            <p className="text-sm text-muted-foreground">Hide your real name on discovery pages.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card text-card-foreground after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-6">
          <div>
            <h3 className="text-foreground font-medium">Search Engine Visibility</h3>
            <p className="text-sm text-muted-foreground">Allow search engines to index your public profile.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card text-card-foreground after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      
      <div className="glass p-6 rounded-2xl border border-border space-y-6">
        <div>
          <h3 className="text-foreground font-medium mb-4">Blocked Users</h3>
          <p className="text-sm text-muted-foreground mb-4">You have 0 blocked users.</p>
          {/* Mocked blocked users list would go here */}
        </div>
      </div>
    </div>
  )
}
