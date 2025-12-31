import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

const authConfig = {
  providers: [Google],
  pages: {
    signIn: '/login',
  },
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isLoginPage = nextUrl.pathname === '/login'
      const isDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isRoot = nextUrl.pathname === '/'

      if (isRoot) {
        return Response.redirect(new URL(isLoggedIn ? '/dashboard' : '/login', nextUrl))
      }

      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }

      if (isDashboard && !isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl))
      }

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
} satisfies NextAuthConfig

export default authConfig
