"use client"

export default function AIPreferencesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">AI Preferences</h1>
        <p className="text-muted-foreground">Control how SYNQ AI interacts with your data and workspace.</p>
      </div>

      <div className="glass p-6 rounded-2xl border border-border space-y-6">
        <div className="flex items-start justify-between">
          <div className="max-w-xl">
            <h3 className="text-foreground font-medium mb-1">Personalized Discovery</h3>
            <p className="text-sm text-muted-foreground">Allow the discovery algorithm to use your experience level and skills to surface better matches.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer mt-1">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card text-card-foreground after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-start justify-between border-t border-border pt-6">
          <div className="max-w-xl">
            <h3 className="text-foreground font-medium mb-1">Workspace Assistant</h3>
            <p className="text-sm text-muted-foreground">Enable the persistent SYNQ AI assistant in your workspaces (Task Breakdown, Roadmap Generation).</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer mt-1">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card text-card-foreground after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-start justify-between border-t border-border pt-6">
          <div className="max-w-xl">
            <h3 className="text-foreground font-medium mb-1">Data Usage for Intelligence</h3>
            <p className="text-sm text-muted-foreground">Allow your anonymized workspace data to be used to improve SYNQ AI accuracy.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer mt-1">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card text-card-foreground after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  )
}
