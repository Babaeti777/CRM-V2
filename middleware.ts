import NextAuth from 'next-auth'
import authConfig from './auth.config'

const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  // Match all routes except static files and api routes
  // This allows the auth callback to work properly
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (handled separately for auth)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (browser requests)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
