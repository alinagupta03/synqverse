"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"

type Channel = { id: string; name: string; description: string | null }
type Message = { id: string; content: string; createdAt: string; isEdited: boolean; isDeleted: boolean; sender: { id: string; anonymousId: string | null } }

export default function WorkspaceChat() {
  const params = useParams()
  const id = params?.id as string
  const [channels, setChannels] = useState<Channel[]>([])
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchChannels = async () => {
    const res = await fetch(`/api/workspace/${id}/channels`)
    const data = await res.json()
    setChannels(data)
    if (data.length > 0 && !activeChannelId) {
      setActiveChannelId(data[0].id)
    }
  }

  const fetchMessages = async (channelId: string) => {
    const res = await fetch(`/api/workspace/${id}/channels/${channelId}`)
    const data = await res.json()
    setMessages(Array.isArray(data) ? data : [])
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  useEffect(() => {
    fetchChannels()
  }, [id])

  useEffect(() => {
    if (!activeChannelId) return
    fetchMessages(activeChannelId)
    const interval = setInterval(() => fetchMessages(activeChannelId), 3000) // Polling
    return () => clearInterval(interval)
  }, [activeChannelId])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !activeChannelId || sending) return

    setSending(true)
    const optimisticMsg = {
      id: "temp-" + Date.now(),
      content: input,
      createdAt: new Date().toISOString(),
      isEdited: false,
      isDeleted: false,
      sender: { id: "current-user-id", anonymousId: "You" }
    }
    setMessages(prev => [...prev, optimisticMsg])
    setInput("")
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

    try {
      await fetch(`/api/workspace/${id}/channels/${activeChannelId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: optimisticMsg.content })
      })
      fetchMessages(activeChannelId)
    } finally {
      setSending(false)
    }
  }

  const activeChannel = channels.find(c => c.id === activeChannelId)

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Channels Sidebar */}
      <div className="w-56 border-r border-gray-200 bg-gray-50/20 flex flex-col hidden sm:flex">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Channels</h2>
          <button className="text-gray-500 hover:text-gray-900">+</button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {channels.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveChannelId(c.id)}
              className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                activeChannelId === c.id ? "bg-gray-200 text-gray-900 font-medium" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              # {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50/40">
        {/* Header */}
        <div className="h-14 border-b border-gray-200 flex items-center px-4 shrink-0 glass">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="text-gray-500">#</span>
            {activeChannel?.name || "Select a channel"}
          </h2>
          {activeChannel?.description && (
            <span className="ml-4 text-sm text-gray-500 hidden md:inline border-l border-gray-200 pl-4">
              {activeChannel.description}
            </span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col justify-end">
              <div className="text-center pb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to #{activeChannel?.name}</h3>
                <p className="text-gray-500 text-sm">This is the start of the #{activeChannel?.name} channel.</p>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => {
              const prevMsg = messages[i - 1]
              const showHeader = !prevMsg || prevMsg.sender.id !== msg.sender.id || new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() > 5 * 60000

              return (
                <div key={msg.id} className={`group ${!showHeader ? "mt-1" : ""}`}>
                  {showHeader && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{msg.sender.anonymousId || "Unknown"}</span>
                      <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    {showHeader ? (
                      <div className="w-8 h-8 rounded shrink-0 bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs text-blue-400 font-bold mt-0.5">
                        {msg.sender.anonymousId?.slice(-2) || "?"}
                      </div>
                    ) : (
                      <div className="w-8 shrink-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[10px] text-gray-500 leading-5">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                    <div className={`text-sm flex-1 ${msg.isDeleted ? "text-gray-500 italic" : "text-gray-200"} leading-relaxed whitespace-pre-wrap`}>
                      {msg.content}
                      {msg.isEdited && !msg.isDeleted && <span className="text-[10px] text-gray-500 ml-2">(edited)</span>}
                    </div>
                    {/* Action Menu (Report) */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                      <button 
                        onClick={() => {
                          fetch('/api/report', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              reportedUserId: msg.sender.id,
                              targetType: 'MESSAGE',
                              targetId: msg.id,
                              reason: 'HARASSMENT',
                              description: msg.content
                            })
                          }).then(() => {
                            setToast("Reported successfully. Our automated systems will review this shortly.")
                            setTimeout(() => setToast(null), 3000)
                          })
                        }}
                        className="p-1 hover:bg-gray-200 rounded text-red-400/50 hover:text-red-400 transition-colors" 
                        title="Report Message"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 shrink-0 bg-gray-50/60">
          <form onSubmit={sendMessage} className="relative">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Message #${activeChannel?.name || "..."}`}
              className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              disabled={!activeChannelId}
            />
            <button
              type="submit"
              disabled={!input.trim() || sending || !activeChannelId}
              className="absolute right-2 top-2 bottom-2 w-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-500 text-gray-900 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
