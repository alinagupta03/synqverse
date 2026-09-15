"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

type Note = {
  id: string
  title: string
  content: string
  updatedAt: string
  author: { anonymousId: string }
}

export default function WorkspaceNotes() {
  const params = useParams()
  const id = params?.id as string
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")

  const fetchNotes = async () => {
    const res = await fetch(`/api/workspace/${id}/notes`)
    const data = await res.json()
    setNotes(Array.isArray(data) ? data : [])
    if (data.length > 0 && !activeNoteId) {
      setActiveNoteId(data[0].id)
      setEditTitle(data[0].title)
      setEditContent(data[0].content)
    }
  }

  useEffect(() => { fetchNotes() }, [id])

  const selectNote = (note: Note) => {
    setActiveNoteId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const createNote = async () => {
    const res = await fetch(`/api/workspace/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled Note", content: "" })
    })
    const data = await res.json()
    if (data.note) {
      fetchNotes()
      setActiveNoteId(data.note.id)
      setEditTitle(data.note.title)
      setEditContent(data.note.content)
    }
  }

  const saveNote = async () => {
    if (!activeNoteId) return
    await fetch(`/api/workspace/${id}/notes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId: activeNoteId, title: editTitle, content: editContent })
    })
    fetchNotes()
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-muted/40">
      {/* Sidebar */}
      <div className="w-64 border-r border-border flex flex-col glass z-10 hidden sm:flex">
        <div className="p-4 border-b border-border flex justify-between items-center shrink-0">
          <h2 className="font-semibold text-foreground">Notes</h2>
          <button onClick={createNote} className="text-sm bg-gray-200 hover:bg-gray-300 text-foreground px-2 py-1 rounded transition-colors">+</button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {notes.map(n => (
            <button
              key={n.id}
              onClick={() => selectNote(n)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                activeNoteId === n.id ? "bg-blue-600 text-foreground shadow-lg" : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
              }`}
            >
              <div className="font-medium truncate">{n.title || "Untitled"}</div>
              <div className="text-[10px] opacity-70 mt-0.5 truncate">{new Date(n.updatedAt).toLocaleDateString()}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {activeNoteId ? (
          <>
            <div className="p-4 border-b border-border flex justify-between items-center shrink-0 glass">
               <input
                 type="text"
                 value={editTitle}
                 onChange={e => setEditTitle(e.target.value)}
                 onBlur={saveNote}
                 className="bg-transparent text-xl font-bold text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:outline-none w-2/3"
                 placeholder="Note Title"
               />
               <button onClick={saveNote} className="text-xs bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded transition-colors">Save</button>
            </div>
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              onBlur={saveNote}
              placeholder="Start typing..."
              className="flex-1 w-full p-8 bg-transparent text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-slate-400 resize-none focus:outline-none custom-scrollbar leading-relaxed"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="mb-4">Select a note or create a new one</p>
              <button onClick={createNote} className="bg-blue-600 hover:bg-blue-700 text-foreground px-4 py-2 rounded-lg transition-colors text-sm">Create Note</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
