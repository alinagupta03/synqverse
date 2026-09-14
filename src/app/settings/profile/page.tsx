"use client"

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your public identity and academic details.</p>
      </div>

      <div className="glass p-6 rounded-2xl border border-border space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Full Name</label>
          <input type="text" defaultValue="Simulated User" className="w-full bg-gray-100 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-blue-500" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Bio</label>
          <textarea rows={3} defaultValue="Software Engineering student." className="w-full bg-gray-100 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-blue-500" />
        </div>
        <div className="flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-foreground px-6 py-2 rounded-xl font-medium transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  )
}
