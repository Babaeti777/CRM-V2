import { NextResponse } from 'next/server'
import { auth } from '@/auth'

// Standardized API error responses
export const ApiResponses = {
  unauthorized: () =>
    NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),

  forbidden: () =>
    NextResponse.json({ error: 'Forbidden' }, { status: 403 }),

  notFound: (resource = 'Resource') =>
    NextResponse.json({ error: `${resource} not found` }, { status: 404 }),

  badRequest: (message = 'Invalid request') =>
    NextResponse.json({ error: message }, { status: 400 }),

  serverError: (message = 'Internal server error') =>
    NextResponse.json({ error: message }, { status: 500 }),

  success: <T>(data: T, status = 200) =>
    NextResponse.json(data, { status }),

  created: <T>(data: T) =>
    NextResponse.json(data, { status: 201 }),
}

// Get authenticated user ID or return unauthorized response
export async function getAuthenticatedUserId(): Promise<string | NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return ApiResponses.unauthorized()
  }
  return session.user.id
}

// Wrapper for API route handlers with auth
export function withAuth<T>(
  handler: (userId: string, request: Request) => Promise<NextResponse<T>>
) {
  return async (request: Request): Promise<NextResponse> => {
    try {
      const result = await getAuthenticatedUserId()
      if (result instanceof NextResponse) {
        return result
      }
      return await handler(result, request)
    } catch (error) {
      console.error('API Error:', error)
      return ApiResponses.serverError()
    }
  }
}
