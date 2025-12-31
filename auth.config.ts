import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

// Validate required environment variables
const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

// Check if Google OAuth is properly configured
const isGoogleConfigured = !!(googleClientId && googleClientSecret)

// Log warning in development if not configured
if (!isGoogleConfigured && process.env.NODE_ENV === 'development') {
  console.warn(
    '⚠️  Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env'
  )
}

// Lightweight auth config for Edge middleware (no Prisma)
const authConfig = {
  providers: isGoogleConfigured
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
