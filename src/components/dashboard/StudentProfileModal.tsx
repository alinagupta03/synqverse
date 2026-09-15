import React from "react"
import { Button } from "@/components/ui/button"

export type StudentProfile = {
  id: string
  name: string
  branch: string
  match: number
  description: string
  skills: string[]
}

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  student: StudentProfile | null
}

export function StudentProfileModal({ isOpen, onClose, student }: ModalProps) {
  if (!isOpen || !student) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Interactive Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="bg-card text-card-foreground rounded-2xl shadow-2xl max-w-lg w-full relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">{student.name}</h2>
              <p className="text-sm text-muted-foreground font-medium">{student.branch}</p>
            </div>
            
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-foreground transition-colors p-1"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <div className="inline-flex items-center text-xs font-bold text-black bg-green-100 border border-green-300 px-3 py-1 rounded-full mb-4 shadow-sm">
              {student.match}% Match
            </div>
            
            <p className="text-black font-medium text-sm leading-relaxed mb-6 bg-gray-100 p-4 rounded-xl border border-gray-300 shadow-sm">
              "{student.description}"
            </p>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Top Skills</label>
              <div className="flex flex-wrap gap-2">
                {student.skills.map(skill => (
                  <span 
                    key={skill} 
                    className="text-xs font-bold px-3 py-1.5 rounded-md bg-orange-100 border border-orange-300 text-black shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-2 border-t border-border">
            <Button variant="outline" className="flex-1 font-semibold text-foreground border-border hover:bg-muted" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md">
              Send Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
