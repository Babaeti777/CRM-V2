import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

// Simple auth config - Google OAuth for single user
const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const pathname = nextUrl.pathname

      // Allow auth API routes
      if (pathname.startsWith('/api/auth')) {
        return true
      }

      // Login page logic
      if (pathname === '/login') {
        if (isLoggedIn) {
          return Response.redirect(new URL('/dashboard', nextUrl))
        }
        return true
      }

      // Root redirect
      if (pathname === '/') {
        return Response.redirect(new URL(isLoggedIn ? '/dashboard' : '/login', nextUrl))
      }

      // Protect dashboard
      if (pathname.startsWith('/dashboard')) {
        if (!isLoggedIn) {
          return Response.redirect(new URL('/login', nextUrl))
        }
        return true
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
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
