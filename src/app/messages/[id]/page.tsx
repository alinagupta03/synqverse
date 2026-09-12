"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import { BrandLogo } from "@/components/ui/BrandLogo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

type Message = {
  id: string
  content: string
  senderId: string
  isEdited: boolean
  isDeleted: boolean
  createdAt: string
  replyToId: string | null
  sender: { id: string; anonymousId: string | null }
}

const REPORT_REASONS = ["Spam", "Harassment", "Scam", "Fake Identity", "Inappropriate Content", "Hate/Abuse", "Other"]

function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300 break-all">
        {part}
      </a>
    ) : part
  )
}

export default function ConversationPage() {
  const params = useParams()
  const conversationId = params?.id as string

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [search, setSearch] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [reportTarget, setReportTarget] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`)
      if (res.status === 403) return
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch { /* noop */ }
    finally { setLoading(false) }
  }, [conversationId])

  useEffect(() => {
    fetchMessages()
    // Optimistic polling for near-realtime experience
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [fetchMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    const content = input.trim()
    setInput("")
    setReplyTo(null)

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, content, replyToId: replyTo?.id })
      })
      fetchMessages()
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const deleteMessage = async (messageId: string) => {
    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, isDeleted: true })
    })
    fetchMessages()
  }

  const editMessage = async (messageId: string) => {
    if (!editContent.trim()) return
    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, content: editContent })
    })
    setEditingId(null)
    fetchMessages()
  }

  const submitReport = async () => {
    if (!reportTarget || !reportReason) return
    await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportedUserId: reportTarget, reportedMessageId: reportTarget, reason: reportReason })
    })
    setReportTarget(null)
    setReportReason("")
  }

  const filteredMessages = search
    ? messages.filter(m => m.content.toLowerCase().includes(search.toLowerCase()))
    : messages

  // Group messages by sender consecutively
  const SELF = "current-user-id"

  return (
    <div className="h-screen bg-gray-50 text-foreground flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-gray-200 flex items-center px-6 justify-between glass z-50 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/messages" className="text-gray-500 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-400">A</div>
          <div>
            <h2 className="font-semibold text-sm text-gray-900">Anonymous Student</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-900"
            onClick={() => setShowSearch(!showSearch)}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Button>
        </div>
      </header>

      {/* Search bar */}
      {showSearch && (
        <div className="flex-shrink-0 border-b border-gray-200 px-4 py-2">
          <Input
            placeholder="Search messages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-gray-100 border-gray-200 text-sm"
            autoFocus
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-2xl mb-3">👋</p>
            <h3 className="font-semibold text-lg mb-1">Say hello!</h3>
            <p className="text-sm text-gray-500">This is the beginning of your private conversation.</p>
          </div>
        ) : (
          filteredMessages.map((msg, i) => {
            const isSelf = msg.senderId === SELF
            const prevMsg = filteredMessages[i - 1]
            const isGrouped = prevMsg && prevMsg.senderId === msg.senderId && !msg.isDeleted
            const timeStr = new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

            return (
              <div key={msg.id} className={`flex flex-col ${isSelf ? "items-end" : "items-start"} ${isGrouped ? "mt-0.5" : "mt-4"}`}>
                {!isGrouped && !isSelf && (
                  <span className="text-xs text-gray-500 mb-1 ml-1">{msg.sender.anonymousId || "Student"}</span>
                )}

                {/* Reply preview */}
                {msg.replyToId && (
                  <div className={`text-xs text-gray-500 border-l-2 border-gray-300 pl-2 mb-1 max-w-xs truncate ${isSelf ? "border-blue-500/50" : ""}`}>
                    ↩ Replying to a message
                  </div>
                )}

                <div className="group flex items-end gap-2">
                  {isSelf && (
                    <div className="hidden group-hover:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingId(msg.id); setEditContent(msg.content) }} className="text-xs text-gray-500 hover:text-gray-900 px-1">Edit</button>
                      <button onClick={() => deleteMessage(msg.id)} className="text-xs text-gray-500 hover:text-red-400 px-1">Delete</button>
                    </div>
                  )}

                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                      msg.isDeleted
                        ? "bg-gray-100 text-gray-500 italic"
                        : isSelf
                        ? "bg-blue-600 text-gray-900 rounded-br-sm"
                        : "bg-gray-200 text-gray-900 rounded-bl-sm"
                    }`}
                  >
                    {editingId === msg.id ? (
                      <div className="flex gap-2">
                        <input
                          className="bg-transparent outline-none flex-1 text-gray-900"
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") editMessage(msg.id); if (e.key === "Escape") setEditingId(null) }}
                          autoFocus
                        />
                        <button onClick={() => editMessage(msg.id)} className="text-xs text-blue-300">✓</button>
                      </div>
                    ) : (
                      <>
                        {linkify(msg.content)}
                        {msg.isEdited && <span className="text-xs opacity-60 ml-1">(edited)</span>}
                      </>
                    )}
                  </div>

                  {!isSelf && (
                    <div className="hidden group-hover:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setReplyTo(msg)} className="text-xs text-gray-500 hover:text-gray-900 px-1">↩</button>
                      <button onClick={() => setReportTarget(msg.id)} className="text-xs text-gray-500 hover:text-red-400 px-1">Report</button>
                    </div>
                  )}
                </div>

                {!isGrouped && (
                  <span className="text-[10px] text-gray-500 mt-1 mx-1">{timeStr}</span>
                )}
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Reply Preview */}
      {replyTo && (
        <div className="flex-shrink-0 mx-4 mb-1 px-4 py-2 bg-gray-100 rounded-t-lg border border-gray-200 border-b-0 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <span className="text-blue-400">Replying to:</span> <span className="truncate max-w-xs inline-block align-bottom">{replyTo.content}</span>
          </div>
          <button onClick={() => setReplyTo(null)} className="text-gray-500 hover:text-gray-900 text-xs ml-2">✕</button>
        </div>
      )}

      {/* Input */}
      <div className={`flex-shrink-0 border-t border-gray-200 px-4 py-3 flex gap-3 items-center ${replyTo ? "border-t-0" : ""}`}>
        <Input
          ref={inputRef}
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
          className="flex-1 bg-gray-100 border-gray-200 focus:border-blue-500/50"
        />
        <Button
          onClick={sendMessage}
          disabled={!input.trim() || sending}
          className="bg-blue-600 hover:bg-blue-700 text-gray-900 flex-shrink-0"
        >
          {sending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </Button>
      </div>

      {/* Report Modal */}
      {reportTarget && (
        <div className="fixed inset-0 bg-gray-50/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl border border-gray-200 p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">Report this message</h3>
            <p className="text-sm text-gray-500">Help us keep the community safe.</p>
            <div className="grid grid-cols-2 gap-2">
              {REPORT_REASONS.map(r => (
                <button
                  key={r}
                  onClick={() => setReportReason(r)}
                  className={`p-3 text-xs rounded-xl border transition-colors text-left ${
                    reportReason === r
                      ? "border-blue-500 bg-blue-500/10 text-gray-900"
                      : "border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 border-gray-200 text-gray-900" onClick={() => { setReportTarget(null); setReportReason("") }}>Cancel</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-gray-900" disabled={!reportReason} onClick={submitReport}>Submit Report</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
