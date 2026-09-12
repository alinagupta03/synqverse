import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type ContentType = 'TEXT' | 'PROFILE' | 'LINK'
type RiskLevel = 'SAFE' | 'WARNING' | 'DANGER'

interface ModerationResult {
  isFlagged: boolean
  riskLevel: RiskLevel
  score: number // 0-100
  reasons: string[]
}

// Mock AI / Rule-based classification
export class ModerationEngine {
  
  static analyze(content: string, type: ContentType): ModerationResult {
    const reasons: string[] = []
    let score = 0
    const lower = content.toLowerCase()

    // 1. Basic Rule-Based Checks (Keyword/Pattern matching)
    const spamKeywords = ['crypto', 'invest', 'guaranteed returns', 'click here', 'free money']
    const harassmentKeywords = ['idiot', 'shut up', 'loser', 'die', 'kill']
    const phishingPatterns = ['password', 'login', 'verify account', 'ssn']

    for (const kw of spamKeywords) {
      if (lower.includes(kw)) { score += 20; reasons.push('Spam terminology') }
    }
    for (const kw of harassmentKeywords) {
      if (lower.includes(kw)) { score += 50; reasons.push('Hostile/Abusive language') }
    }
    for (const kw of phishingPatterns) {
      if (lower.includes(kw)) { score += 40; reasons.push('Potential phishing') }
    }

    if (type === 'LINK') {
      const suspiciousDomains = ['bit.ly', 'tinyurl', 'free-scam.com']
      for (const domain of suspiciousDomains) {
        if (lower.includes(domain)) { score += 60; reasons.push('Suspicious domain') }
      }
    }

    // Cap score at 100
    score = Math.min(score, 100)

    // Determine Risk Level
    let riskLevel: RiskLevel = 'SAFE'
    if (score >= 40 && score < 75) riskLevel = 'WARNING'
    if (score >= 75) riskLevel = 'DANGER'

    return {
      isFlagged: score >= 40,
      riskLevel,
      score,
      reasons
    }
  }

  // Abstraction to process a user report and auto-action if necessary
  static async processReport(reportId: string) {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: { reportedUser: true }
    })
    
    if (!report) return

    const result = this.analyze(report.description || '', 'TEXT')

    // If extremely high confidence of violation, auto-issue a warning (Level 1)
    if (result.riskLevel === 'DANGER') {
      await prisma.moderationAction.create({
        data: {
          userId: report.reportedUserId,
          level: 1,
          actionType: 'WARNING',
          reason: `Automated warning triggered: ${result.reasons.join(', ')}`,
          source: 'SYSTEM'
        }
      })
    }
  }

  // Middleware utility to check active restrictions
  static async checkRestrictions(userId: string) {
    const actions = await prisma.moderationAction.findMany({
      where: { 
        userId, 
        status: 'ACTIVE',
        OR: [
          { endTime: null },
          { endTime: { gt: new Date() } }
        ]
      }
    })

    const isSuspended = actions.some(a => a.actionType === 'SUSPENSION' || a.actionType === 'TEMP_ACCOUNT')
    const isMuted = actions.some(a => a.actionType === 'TEMP_COMM')

    return { isSuspended, isMuted, activeActions: actions }
  }
}
