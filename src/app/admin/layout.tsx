export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground flex flex-col">
      <header className="h-16 border-b border-red-500/20 bg-red-500/5 flex items-center px-6 shrink-0">
        <h1 className="text-red-500 font-bold tracking-widest uppercase text-sm">Synqverse Admin Control</h1>
      </header>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
