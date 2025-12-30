import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

// Lightweight auth config for Edge middleware (no Prisma)
const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnLoginPage = nextUrl.pathname.startsWith('/login')
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnApiAuth = nextUrl.pathname.startsWith('/api/auth')

      // Allow API auth routes
      if (isOnApiAuth) {
        return true
      }

      // Redirect logged-in users away from login page
      if (isLoggedIn && isOnLoginPage) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }

      // Redirect non-logged-in users to login page
      if (!isLoggedIn && isOnDashboard) {
        return Response.redirect(new URL('/login', nextUrl))
      }

      // Allow access to login page for non-logged-in users
      if (isOnLoginPage) {
        return true
      }

      // For dashboard, require login
      if (isOnDashboard) {
        return isLoggedIn
      }

      return true
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token }) {
      return token
    },
  },
  pages: {
    signIn: '/login',
  },
} satisfies NextAuthConfig

export default authConfig
