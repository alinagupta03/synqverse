// Basic in-memory rate limiter for MVP
// Maps an IP/UserId to an array of timestamps
const rateLimits = new Map<string, number[]>()

export function rateLimit(identifier: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const timestamps = rateLimits.get(identifier) || []
  
  // Filter out expired timestamps
  const validTimestamps = timestamps.filter(ts => now - ts < windowMs)
  
  if (validTimestamps.length >= limit) {
    // Rate limit exceeded
    return false
  }
  
  validTimestamps.push(now)
  rateLimits.set(identifier, validTimestamps)
  
  return true
}

// Memory leak prevention: clear expired keys every 5 minutes
setInterval(() => {
  const now = Date.now()
  const maxWindowMs = 60 * 60 * 1000 // 1 hour max window
  for (const [key, timestamps] of rateLimits.entries()) {
    const valid = timestamps.filter(ts => now - ts < maxWindowMs)
    if (valid.length === 0) {
      rateLimits.delete(key)
    } else {
      rateLimits.set(key, valid)
    }
  }
}, 5 * 60 * 1000)
