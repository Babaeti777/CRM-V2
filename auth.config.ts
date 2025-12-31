import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import { getGoogleAuthEnv } from './lib/env'

// Validate required environment variables
const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET

// Track missing pieces for clearer diagnostics
const missingConfig: string[] = []

if (!googleClientId) missingConfig.push('GOOGLE_CLIENT_ID')
if (!googleClientSecret) missingConfig.push('GOOGLE_CLIENT_SECRET')
if (!authSecret) missingConfig.push('AUTH_SECRET or NEXTAUTH_SECRET')

// Check if Google OAuth is properly configured
const isGoogleConfigured = missingConfig.length === 0

// Log warning in development if not configured
if (!isConfigured && process.env.NODE_ENV === 'development') {
  console.warn(
    `⚠️  Google OAuth not fully configured. Missing: ${missingConfig.join(', ')}`
  )
}

// Lightweight auth config for Edge middleware (no Prisma)
const authConfig = {
  secret: authSecret,
  providers: isConfigured
    ? [
        Google({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
          authorization: {
            params: {
              prompt: 'consent',
              access_type: 'offline',
              response_type: 'code',
            },
          },
        }),
      ]
    : [],
  secret: authSecret,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const pathname = nextUrl.pathname

      // Always allow auth API routes
      if (pathname.startsWith('/api/auth')) {
        return true
      }

      // Always allow login page
      if (pathname === '/login') {
        // Redirect logged-in users to dashboard
        if (isLoggedIn) {
          return Response.redirect(new URL('/dashboard', nextUrl))
        }
        return true
      }

      // Redirect root to appropriate page
      if (pathname === '/') {
        const destination = isLoggedIn ? '/dashboard' : '/login'
        return Response.redirect(new URL(destination, nextUrl))
      }

      // Protect dashboard routes
      if (pathname.startsWith('/dashboard')) {
        if (!isLoggedIn) {
          return Response.redirect(new URL('/login', nextUrl))
        }
        return true
      }

      // Allow everything else
      return true
    },
    async jwt({ token, user, account }) {
      // On initial sign-in, persist user ID to the token
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }

      // Handle account linking info if needed
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }

      return token
    },
    async session({ session, token }) {
      // Always sync session with token data
      if (session.user) {
        session.user.id = token.sub as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    },
  },
} satisfies NextAuthConfig

export default authConfig
