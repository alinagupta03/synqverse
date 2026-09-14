"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BrandLogo } from "@/components/ui/BrandLogo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const CATEGORIES = ["Hackathon", "Startup", "Research", "College Project", "Competition", "Open Source", "Other"]
const TEAM_SIZES = [3, 4, 5, 6, 7, 8, 10]
const DEFAULT_ROLES = ["Frontend", "Backend", "AI/ML", "UI/UX", "Research", "Product", "Business", "Presentation", "Data Science", "DevOps"]

type RoleSlot = { roleName: string; count: number }

export default function NewTeamPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  // Step 1: Project
  const [name, setName] = useState("")
  const [projectIdea, setProjectIdea] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Hackathon")

  // Step 2: Requirements
  const [targetSize, setTargetSize] = useState(6)
  const [roles, setRoles] = useState<RoleSlot[]>([{ roleName: "Frontend", count: 1 }, { roleName: "Backend", count: 1 }])
  const [requiredSkillsInput, setRequiredSkillsInput] = useState("")
  const [branchPreference, setBranchPreference] = useState("")
  const [streamPreference, setStreamPreference] = useState("")

  // Step 3: Availability
  const [availability, setAvailability] = useState("Weekends")
  const [deadline, setDeadline] = useState("")

  const addRole = (roleName: string) => {
    if (roles.find(r => r.roleName === roleName)) return
    setRoles(prev => [...prev, { roleName, count: 1 }])
  }

  const removeRole = (roleName: string) => {
    setRoles(prev => prev.filter(r => r.roleName !== roleName))
  }

  const handleSubmit = async () => {
    if (!name.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, projectIdea, description, category, targetSize,
          requiredSkills: requiredSkillsInput.split(",").map(s => s.trim()).filter(Boolean),
          branchPreference, streamPreference, availability,
          deadline: deadline || null,
          roles,
        })
      })
      const data = await res.json()
      if (data.team?.id) router.push(`/teams/${data.team.id}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-border flex items-center px-6 justify-between glass sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/teams" className="text-muted-foreground hover:text-foreground transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <BrandLogo showText={false} />
        </div>
        <span className="text-sm text-muted-foreground">Step {step} of 3</span>
      </header>

      <main className="flex-1 flex items-start justify-center p-6 pt-12">
        <div className="w-full max-w-xl">
          {/* Progress */}
          <div className="flex gap-2 mb-10">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? "bg-blue-500" : "bg-gray-200"}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Create your team</h1>
                  <p className="text-muted-foreground">Start with your project idea.</p>
                </div>
                <div className="space-y-2">
                  <Label>Team Name *</Label>
                  <Input placeholder="e.g. Neural Spark" value={name} onChange={e => setName(e.target.value)} className="bg-gray-100 border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Project Idea</Label>
                  <Input placeholder="In one line, what are you building?" value={projectIdea} onChange={e => setProjectIdea(e.target.value)} className="bg-gray-100 border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea
                    placeholder="Tell people more about your project and what you're looking for..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-gray-100 border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(c => (
                      <button key={c} onClick={() => setCategory(c)}
                        className={`px-4 py-2 rounded-xl text-sm border transition-colors ${category === c ? "border-blue-500 bg-blue-500/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
                      >{c}</button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Team Requirements</h1>
                  <p className="text-muted-foreground">Define who you need on your team.</p>
                </div>
                <div className="space-y-2">
                  <Label>Team Size</Label>
                  <div className="flex gap-2 flex-wrap">
                    {TEAM_SIZES.map(s => (
                      <button key={s} onClick={() => setTargetSize(s)}
                        className={`w-12 h-12 rounded-xl text-sm font-medium border transition-colors ${targetSize === s ? "border-blue-500 bg-blue-500/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
                      >{s}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Required Roles</Label>
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_ROLES.map(r => (
                      <button key={r} onClick={() => roles.find(x => x.roleName === r) ? removeRole(r) : addRole(r)}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${roles.find(x => x.roleName === r) ? "border-blue-500 bg-blue-500/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
                      >{r}</button>
                    ))}
                  </div>
                  {roles.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {roles.map(r => (
                        <div key={r.roleName} className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl border border-border">
                          <span className="flex-1 text-sm text-foreground">{r.roleName}</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setRoles(prev => prev.map(x => x.roleName === r.roleName ? { ...x, count: Math.max(1, x.count - 1) } : x))} className="w-6 h-6 rounded bg-gray-200 text-foreground text-sm">-</button>
                            <span className="w-4 text-center text-sm">{r.count}</span>
                            <button onClick={() => setRoles(prev => prev.map(x => x.roleName === r.roleName ? { ...x, count: x.count + 1 } : x))} className="w-6 h-6 rounded bg-gray-200 text-foreground text-sm">+</button>
                          </div>
                          <button onClick={() => removeRole(r.roleName)} className="text-muted-foreground hover:text-red-400 text-xs">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Required Skills (comma separated)</Label>
                  <Input placeholder="React, Python, Figma..." value={requiredSkillsInput} onChange={e => setRequiredSkillsInput(e.target.value)} className="bg-gray-100 border-border" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Branch Preference</Label>
                    <Input placeholder="e.g. CSE" value={branchPreference} onChange={e => setBranchPreference(e.target.value)} className="bg-gray-100 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Stream Preference</Label>
                    <Input placeholder="e.g. B.Tech" value={streamPreference} onChange={e => setStreamPreference(e.target.value)} className="bg-gray-100 border-border" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Availability & Deadline</h1>
                  <p className="text-muted-foreground">When do you need your team?</p>
                </div>
                <div className="space-y-2">
                  <Label>Team Availability</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Weekends", "Evenings", "10hrs/week", "20hrs/week", "Full-time"].map(a => (
                      <button key={a} onClick={() => setAvailability(a)}
                        className={`px-4 py-2 rounded-xl text-sm border transition-colors ${availability === a ? "border-blue-500 bg-blue-500/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
                      >{a}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Application Deadline (optional)</Label>
                  <Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="bg-gray-100 border-border" />
                </div>

                {/* Summary */}
                <div className="p-5 glass rounded-2xl border border-border space-y-3">
                  <h3 className="font-semibold text-foreground">Team Summary</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><span className="text-foreground">{name}</span> • {category}</p>
                    <p>{targetSize} members needed • {roles.length} roles defined</p>
                    {projectIdea && <p className="italic">"{projectIdea}"</p>}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button variant="outline" className="flex-1 border-border text-foreground" onClick={() => setStep(s => s - 1)}>Back</Button>
            )}
            {step < 3 ? (
              <Button className="flex-1 bg-orange-500 text-white hover:bg-orange-600" onClick={() => setStep(s => s + 1)} disabled={step === 1 && !name.trim()}>
                Continue
              </Button>
            ) : (
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-foreground" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Creating..." : "Create Team"}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
