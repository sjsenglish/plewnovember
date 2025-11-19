/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// Store rate limit data in memory
// Note: This will reset when the server restarts
// For production, use Redis or similar persistent storage
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  const keysToDelete: string[] = []
  rateLimitStore.forEach((entry, key) => {
    if (entry.resetTime < now) {
      keysToDelete.push(key)
    }
  })
  keysToDelete.forEach(key => rateLimitStore.delete(key))
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  maxRequests: number

  /**
   * Time window in milliseconds
   */
  windowMs: number

  /**
   * Unique identifier for this rate limiter (e.g., 'api-chat', 'api-packs')
   */
  identifier: string
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check if a request should be rate limited
 *
 * @param key - Unique key to identify the requester (e.g., user email, IP address)
 * @param config - Rate limit configuration
 * @returns RateLimitResult indicating if request is allowed
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const rateLimitKey = `${config.identifier}:${key}`

  // Get existing entry or create new one
  let entry = rateLimitStore.get(rateLimitKey)

  // If no entry or entry has expired, create new entry
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    }
    rateLimitStore.set(rateLimitKey, entry)
  }

  // Increment request count
  entry.count++

  // Check if limit exceeded
  const success = entry.count <= config.maxRequests

  return {
    success,
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    reset: entry.resetTime,
  }
}

/**
 * Middleware helper to get client IP address
 */
export function getClientIp(request: Request): string {
  // Try various headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  if (cfConnectingIp) return cfConnectingIp
  if (realIp) return realIp
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim()
  }

  return 'unknown'
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  // Strict limit for expensive AI operations
  AI_CHAT: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minute
    identifier: 'ai-chat',
  },

  // Moderate limit for API operations
  API_DEFAULT: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    identifier: 'api-default',
  },

  // Lenient limit for read operations
  API_READ: {
    maxRequests: 200,
    windowMs: 60 * 1000, // 1 minute
    identifier: 'api-read',
  },

  // Very strict for authentication attempts
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    identifier: 'auth',
  },
} as const
