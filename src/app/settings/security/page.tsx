"use client"

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Security</h1>
        <p className="text-muted-foreground">Manage your password and connected devices.</p>
      </div>

      <div className="glass p-6 rounded-2xl border border-border space-y-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Current Password</label>
            <input type="password" placeholder="••••••••" className="w-full bg-card dark:bg-[#1E293B] border border-border rounded-xl p-3 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">New Password</label>
            <input type="password" placeholder="••••••••" className="w-full bg-card dark:bg-[#1E293B] border border-border rounded-xl p-3 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" />
          </div>
          <div className="flex justify-end pt-2">
            <button className="bg-primary hover:opacity-90 text-white px-6 py-2 rounded-xl font-medium transition-colors">Update Password</button>
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-2xl border border-border space-y-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Active Sessions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card dark:bg-[#1E293B]">
            <div>
              <p className="text-foreground dark:text-white font-medium">Windows • Chrome</p>
              <p className="text-sm text-green-400">Current Session</p>
            </div>
            <p className="text-xs text-muted-foreground">Delhi, India</p>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card dark:bg-[#1E293B]">
            <div>
              <p className="text-foreground dark:text-white font-medium">iOS • Safari</p>
              <p className="text-sm text-muted-foreground">Last active 2 days ago</p>
            </div>
            <button className="text-xs text-red-400 hover:text-red-300">Revoke</button>
          </div>
        </div>
      </div>
    </div>
  )
}
