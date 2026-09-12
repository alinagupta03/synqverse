"use client"

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-500">Manage your public identity and academic details.</p>
      </div>

      <div className="glass p-6 rounded-2xl border border-gray-200 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Full Name</label>
          <input type="text" defaultValue="Simulated User" className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-blue-500" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Bio</label>
          <textarea rows={3} defaultValue="Software Engineering student." className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-blue-500" />
        </div>
        <div className="flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-gray-900 px-6 py-2 rounded-xl font-medium transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  )
}
