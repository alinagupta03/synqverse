"use client"

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Security</h1>
        <p className="text-gray-500">Manage your password and connected devices.</p>
      </div>

      <div className="glass p-6 rounded-2xl border border-gray-200 space-y-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-1">Current Password</label>
            <input type="password" placeholder="••••••••" className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-1">New Password</label>
            <input type="password" placeholder="••••••••" className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex justify-end pt-2">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-2 rounded-xl font-medium transition-colors">Update Password</button>
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-2xl border border-gray-200 space-y-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Active Sessions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-100">
            <div>
              <p className="text-gray-900 font-medium">Windows • Chrome</p>
              <p className="text-sm text-green-400">Current Session</p>
            </div>
            <p className="text-xs text-gray-500">Delhi, India</p>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div>
              <p className="text-gray-900 font-medium">iOS • Safari</p>
              <p className="text-sm text-gray-500">Last active 2 days ago</p>
            </div>
            <button className="text-xs text-red-400 hover:text-red-300">Revoke</button>
          </div>
        </div>
      </div>
    </div>
  )
}
