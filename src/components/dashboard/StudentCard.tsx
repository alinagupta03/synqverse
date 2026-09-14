import React from "react"
import { Button } from "@/components/ui/button"
import type { StudentProfile } from "./StudentProfileModal"

type StudentCardProps = {
  student: StudentProfile
  onViewProfile: (student: StudentProfile) => void
}

export function StudentCard({ student, onViewProfile }: StudentCardProps) {
  return (
    <div className="p-6 glass rounded-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-colors flex flex-col h-full relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-[#111827] dark:text-white">{student.name}</h3>
          <p className="text-sm text-muted-foreground dark:text-gray-400">{student.branch}</p>
        </div>
        <div className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded shadow-sm">
          {student.match}% Match
        </div>
      </div>
      
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">"{student.description}"</p>
      
      <div className="flex flex-wrap gap-2 mb-5">
        {student.skills.map(skill => (
          <span 
            key={skill} 
            className="text-xs font-bold px-2 py-1 rounded bg-gray-100 border border-border text-[#111827] shadow-sm"
          >
            {skill}
          </span>
        ))}
      </div>
      
      <div className="mt-auto">
        <Button 
          className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-[#111827] font-bold shadow-md transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onViewProfile(student)
          }}
        >
          View Profile
        </Button>
      </div>
    </div>
  )
}
