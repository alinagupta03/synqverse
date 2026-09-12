import { PrismaClient, User, Profile, AcademicProfile, Skill, Interest } from '@prisma/client'

// Complex type for matching
export type MatchProfile = {
  id: string
  anonymousId: string
  branch: string | null
  stream: string | null
  year: string | null
  skills: string[]
  interests: string[]
  lookingFor: string | null
  availability: string | null
  projectTypes: string[]
  matchScore?: number
  matchExplanation?: string
}

export function calculateMatchScore(
  userA: MatchProfile,
  userB: MatchProfile,
  weights = { skills: 0.4, interests: 0.3, projectType: 0.2, availability: 0.1 }
): { score: number, explanation: string } {
  let score = 0
  const sharedSkills = userA.skills.filter(s => userB.skills.includes(s))
  const sharedInterests = userA.interests.filter(i => userB.interests.includes(i))
  const sharedProjects = userA.projectTypes.filter(p => userB.projectTypes.includes(p))
  
  if (userA.skills.length > 0) score += (sharedSkills.length / Math.max(userA.skills.length, 1)) * weights.skills
  if (userA.interests.length > 0) score += (sharedInterests.length / Math.max(userA.interests.length, 1)) * weights.interests
  if (userA.projectTypes.length > 0) score += (sharedProjects.length / Math.max(userA.projectTypes.length, 1)) * weights.projectType
  
  if (userA.availability === userB.availability && userA.availability) {
    score += weights.availability
  }

  // Generate explanation
  const explanationParts = []
  if (sharedSkills.length > 0) explanationParts.push(`skills like ${sharedSkills[0]}`)
  if (sharedInterests.length > 0) explanationParts.push(`interests in ${sharedInterests[0]}`)
  if (sharedProjects.length > 0) explanationParts.push(`${sharedProjects[0]} projects`)

  const explanation = score > 0.6 
    ? `Strong match because both students share ${explanationParts.join(', ')}.`
    : `Potential match based on shared ${explanationParts.join(' and ') || 'academic background'}.`

  // Scale score to 0-100
  return {
    score: Math.round(score * 100),
    explanation
  }
}
