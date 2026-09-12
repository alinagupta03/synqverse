"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { SynqAIPanel } from "@/components/ai/SynqAIPanel"

type Task = {
  id: string
  title: string
  status: string
  priority: string
}

const STATUSES = ["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"]
const PRIORITY_COLORS: Record<string, string> = {
  LOW: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  MEDIUM: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  HIGH: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  URGENT: "text-red-400 bg-red-500/10 border-red-500/20"
}

export default function WorkspaceTasks() {
  const params = useParams()
  const id = params?.id as string
  const [tasks, setTasks] = useState<Task[]>([])
  
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState("MEDIUM")

  const fetchTasks = async () => {
    const res = await fetch(`/api/workspace/${id}/tasks`)
    const data = await res.json()
    setTasks(Array.isArray(data) ? data : [])
  }

  useEffect(() => { fetchTasks() }, [id])

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
    await fetch(`/api/workspace/${id}/tasks`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, status: newStatus })
    })
  }

  const createTask = async (status: string) => {
    await fetch(`/api/workspace/${id}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTaskTitle, priority: newTaskPriority, status })
    })
    setShowNewTaskModal(false)
    setNewTaskTitle("")
    fetchTasks()
  }

  return (
    <div className="flex-1 overflow-x-auto bg-gray-50/40 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tasks</h1>
          <p className="text-gray-500 text-sm">Manage your team&apos;s workflow.</p>
        </div>
        <button onClick={() => setShowNewTaskModal(true)} className="bg-blue-600 hover:bg-blue-700 text-gray-900 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
          New Task
        </button>
      </div>

      <div className="flex gap-6 h-[calc(100vh-180px)] pb-4">
        {STATUSES.map(status => {
          const columnTasks = tasks.filter(t => t.status === status)
          return (
            <div key={status} className="flex-shrink-0 w-80 bg-[#111]/50 rounded-2xl flex flex-col border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/20 rounded-t-2xl">
                <h3 className="font-semibold text-gray-900/90 text-sm">{status.replace('_', ' ')}</h3>
                <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">{columnTasks.length}</span>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {columnTasks.map(task => (
                  <div key={task.id} className="glass p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all cursor-pointer group">
                    <p className="text-sm text-gray-900/90 mb-3 leading-snug">{task.title}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM}`}>
                        {task.priority}
                      </span>
                      <select 
                        value={task.status} 
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-50/50 border border-gray-200 rounded text-xs text-gray-500 p-1"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
                    <span className="text-xs text-gray-500/50">Empty</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showNewTaskModal && (
        <div className="fixed inset-0 bg-gray-50/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111] border border-gray-200 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">New Task</h3>
            <div className="space-y-4">
              <input type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Task title..." className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-blue-500" />
              <div className="flex gap-4">
                <select value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value)} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-blue-500">
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowNewTaskModal(false)} className="px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors">Cancel</button>
                <button onClick={() => createTask("TODO")} disabled={!newTaskTitle} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-gray-900 px-4 py-2 rounded-xl font-medium transition-colors">Create Task</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <SynqAIPanel 
        context="tasks" 
        onApply={async (generatedTasks) => {
          for (const t of generatedTasks) {
            await fetch(`/api/workspace/${id}/tasks`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: t.title, priority: t.priority, status: "TODO" })
            })
          }
          fetchTasks()
        }} 
      />
    </div>
  )
}
