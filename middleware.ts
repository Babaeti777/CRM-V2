import NextAuth from 'next-auth'
import authConfig from './auth.config'

// Use lightweight auth config for Edge middleware (no Prisma bundled)
export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
