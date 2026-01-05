import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { rateLimit, getClientIdentifier, RATE_LIMITS, type RateLimitConfig } from './rate-limit'

// Standardized API error responses
export const ApiResponses = {
  unauthorized: (message = 'Unauthorized') =>
    NextResponse.json(
      { success: false, error: { message, code: 'UNAUTHORIZED' } },
      { status: 401 }
    ),

  forbidden: (message = 'Forbidden') =>
    NextResponse.json(
      { success: false, error: { message, code: 'FORBIDDEN' } },
      { status: 403 }
    ),

  notFound: (resource = 'Resource') =>
    NextResponse.json(
      { success: false, error: { message: `${resource} not found`, code: 'NOT_FOUND' } },
      { status: 404 }
    ),

  badRequest: (message = 'Invalid request', code = 'BAD_REQUEST') =>
    NextResponse.json(
      { success: false, error: { message, code } },
      { status: 400 }
    ),

  serverError: (message = 'Internal server error') =>
    NextResponse.json(
      { success: false, error: { message, code: 'INTERNAL_ERROR' } },
      { status: 500 }
    ),

  rateLimitExceeded: (reset: number) =>
    NextResponse.json(
      {
        success: false,
        error: {
          message: 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
        },
      },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          'X-RateLimit-Reset': new Date(reset).toISOString(),
        },
      }
    ),

  success: <T>(data: T, meta?: { message?: string }) =>
    NextResponse.json({ success: true, data, ...meta }, { status: 200 }),

  created: <T>(data: T, meta?: { message?: string }) =>
    NextResponse.json({ success: true, data, ...meta }, { status: 201 }),

  noContent: () => new NextResponse(null, { status: 204 }),
}

// Get authenticated user ID or return unauthorized response
export async function getAuthenticatedUserId(): Promise<string | NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return ApiResponses.unauthorized()
  }
  return session.user.id
}

/**
 * Validate request origin to prevent CSRF attacks
 */
function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')

  // Allow requests without origin header (same-origin requests)
  if (!origin) return true

  // Check if origin matches host
  try {
    const originUrl = new URL(origin)
    return originUrl.host === host
  } catch {
    return false
  }
}

/**
 * Wrapper for API route handlers with authentication
 * @param handler The route handler function
 * @param options Configuration options
 */
export function withAuth<T>(
  handler: (userId: string, request: Request) => Promise<NextResponse<T>>,
  options: {
    rateLimit?: RateLimitConfig | false
    validateCsrf?: boolean
  } = {}
) {
  const { rateLimit: rateLimitConfig = RATE_LIMITS.mutation, validateCsrf = true } = options

  return async (request: Request): Promise<NextResponse> => {
    try {
      // CSRF validation for state-changing methods
      if (validateCsrf && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
        if (!validateOrigin(request)) {
          return ApiResponses.forbidden('Invalid request origin')
        }
      }

      // Get authenticated user
      const result = await getAuthenticatedUserId()
      if (result instanceof NextResponse) {
        return result
      }

      // Rate limiting
      if (rateLimitConfig) {
        const identifier = getClientIdentifier(request, result)
        const rateLimitResult = rateLimit(identifier, rateLimitConfig)

        // Add rate limit headers to response
        const addRateLimitHeaders = (response: NextResponse) => {
          response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString())
          response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
          response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.reset).toISOString())
          return response
        }

        if (!rateLimitResult.success) {
          return addRateLimitHeaders(ApiResponses.rateLimitExceeded(rateLimitResult.reset))
        }

        // Execute handler and add rate limit headers
        const response = await handler(result, request)
        return addRateLimitHeaders(response)
      }

      return await handler(result, request)
    } catch (error) {
      console.error('API Error:', error)
      return ApiResponses.serverError()
    }
  }
}

/**
 * Wrapper for public API routes (no authentication required)
 * @param handler The route handler function
 * @param options Configuration options
 */
export function withRateLimit<T>(
  handler: (request: Request) => Promise<NextResponse<T>>,
  config: RateLimitConfig = RATE_LIMITS.api
) {
  return async (request: Request): Promise<NextResponse> => {
    try {
      const identifier = getClientIdentifier(request)
      const rateLimitResult = rateLimit(identifier, config)

      const addRateLimitHeaders = (response: NextResponse) => {
        response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString())
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
        response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.reset).toISOString())
        return response
      }

      if (!rateLimitResult.success) {
        return addRateLimitHeaders(ApiResponses.rateLimitExceeded(rateLimitResult.reset))
      }

      const response = await handler(request)
      return addRateLimitHeaders(response)
    } catch (error) {
      console.error('API Error:', error)
      return ApiResponses.serverError()
    }
  }
}
