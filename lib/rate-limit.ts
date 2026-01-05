/**
 * Simple in-memory rate limiter for API routes
 * For production with multiple instances, consider using Redis-based rate limiting
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number
  /** Window duration in milliseconds */
  window: number
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check if a request is within rate limits
 * @param identifier Unique identifier for the client (e.g., IP address, user ID)
 * @param config Rate limit configuration
 * @returns Rate limit result
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 10, window: 60000 } // Default: 10 requests per minute
): RateLimitResult {
  const now = Date.now()
  const key = identifier

  const entry = store.get(key)

  // If no entry exists or the window has expired, create a new one
  if (!entry || entry.resetAt < now) {
    store.set(key, {
      count: 1,
      resetAt: now + config.window,
    })

    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: now + config.window,
    }
  }

  // Increment the counter
  entry.count++

  // Check if limit exceeded
  if (entry.count > config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: entry.resetAt,
    }
  }

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    reset: entry.resetAt,
  }
}

/**
 * Get the client identifier from a request
 * Uses IP address or authenticated user ID
 */
export function getClientIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`
  }

  // Get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  const ip = forwarded?.split(',')[0] ?? realIp ?? cfConnectingIp ?? 'unknown'

  return `ip:${ip}`
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Authentication endpoints - stricter limits
  auth: {
    limit: 5,
    window: 15 * 60 * 1000, // 5 requests per 15 minutes
  },

  // Mutation endpoints (POST, PUT, DELETE) - moderate limits
  mutation: {
    limit: 30,
    window: 60 * 1000, // 30 requests per minute
  },

  // Query endpoints (GET) - generous limits
  query: {
    limit: 100,
    window: 60 * 1000, // 100 requests per minute
  },

  // General API - moderate limits
  api: {
    limit: 60,
    window: 60 * 1000, // 60 requests per minute
  },
} as const
