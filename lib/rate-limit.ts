/**
 * Supabase-backed rate limiter
 * Uses persistent database storage for rate limiting across serverless instances
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
 * Create Supabase admin client for rate limiting operations
 * Rate limiting requires bypassing RLS to work correctly
 */
async function createRateLimitClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Ignore cookie errors in Server Components
          }
        },
      },
    }
  )
}

/**
 * Check if a request should be rate limited
 *
 * @param key - Unique key to identify the requester (e.g., user email, IP address)
 * @param config - Rate limit configuration
 * @returns RateLimitResult indicating if request is allowed
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now()
  const rateLimitKey = `${config.identifier}:${key}`
  const supabase = await createRateLimitClient()

  try {
    // Try to get existing entry
    const { data: existingEntry } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('identifier', rateLimitKey)
      .single()

    let count = 0
    let resetTime = now + config.windowMs

    if (existingEntry) {
      // Check if the entry has expired
      if (existingEntry.reset_time < now) {
        // Entry expired, reset the count
        count = 1
        resetTime = now + config.windowMs

        await supabase
          .from('rate_limits')
          .update({
            count,
            reset_time: resetTime,
          })
          .eq('identifier', rateLimitKey)
      } else {
        // Entry still valid, increment count
        count = existingEntry.count + 1
        resetTime = existingEntry.reset_time

        await supabase
          .from('rate_limits')
          .update({
            count,
          })
          .eq('identifier', rateLimitKey)
      }
    } else {
      // No entry exists, create new one
      count = 1
      resetTime = now + config.windowMs

      await supabase.from('rate_limits').insert({
        identifier: rateLimitKey,
        count,
        reset_time: resetTime,
      })
    }

    // Check if limit exceeded
    const success = count <= config.maxRequests

    return {
      success,
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - count),
      reset: resetTime,
    }
  } catch (error) {
    // If database operation fails, log error and allow request
    // (fail open to prevent rate limiting from blocking all traffic)
    console.error('Rate limit check failed:', error)
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests,
      reset: now + config.windowMs,
    }
  }
}

/**
 * Cleanup expired rate limit entries
 * Should be called periodically (e.g., via cron job)
 */
export async function cleanupExpiredRateLimits(): Promise<number> {
  const supabase = await createRateLimitClient()

  try {
    const { data, error } = await supabase.rpc('cleanup_expired_rate_limits')

    if (error) {
      console.error('Failed to cleanup expired rate limits:', error)
      return 0
    }

    return data || 0
  } catch (error) {
    console.error('Cleanup rate limits error:', error)
    return 0
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
