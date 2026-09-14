"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

type FileItem = {
  id: string
  name: string
  fileType: string
  size: number
  url: string
  createdAt: string
  uploader: { anonymousId: string }
}

export default function WorkspaceFiles() {
  const params = useParams()
  const id = params?.id as string
  const [files, setFiles] = useState<FileItem[]>([])
  const [uploading, setUploading] = useState(false)

  const fetchFiles = async () => {
    const res = await fetch(`/api/workspace/${id}/files`)
    const data = await res.json()
    setFiles(Array.isArray(data) ? data : [])
  }

  useEffect(() => { fetchFiles() }, [id])

  const handleSimulatedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const res = await fetch(`/api/workspace/${id}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          fileType: file.type || 'application/octet-stream',
          size: file.size,
          url: '#' // Simulated URL
        })
      })
      const data = await res.json()
      if (data.error) alert(data.error)
      else fetchFiles()
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div className="flex-1 overflow-y-auto bg-muted/40 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Files</h1>
            <p className="text-muted-foreground">Securely share and manage workspace assets.</p>
          </div>
          <div>
            <input type="file" id="file-upload" className="hidden" onChange={handleSimulatedUpload} disabled={uploading} />
            <label htmlFor="file-upload" className={`cursor-pointer bg-blue-600 hover:bg-blue-700 text-foreground px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {uploading ? 'Uploading...' : 'Upload File'}
            </label>
          </div>
        </div>

        <div className="glass rounded-2xl border border-border overflow-hidden">
          {files.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto flex items-center justify-center mb-4">📁</div>
              <p className="text-lg font-medium text-foreground mb-1">No files yet</p>
              <p className="text-sm">Upload images, PDFs, or zips to share with your team.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">Size</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Uploaded By</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {files.map(f => (
                  <tr key={f.id} className="hover:bg-muted transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs">
                          {f.fileType.includes('image') ? 'IMG' : f.fileType.includes('pdf') ? 'PDF' : 'DOC'}
                        </div>
                        <p className="font-medium text-foreground truncate max-w-[200px] sm:max-w-xs">{f.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">{formatSize(f.size)}</td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                         <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-foreground">
                            {f.uploader.anonymousId.slice(-2)}
                         </div>
                         <span className="text-muted-foreground">{f.uploader.anonymousId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">{new Date(f.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
