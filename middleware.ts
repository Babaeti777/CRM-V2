import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

// Edge-compatible auth for middleware only
const { auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  trustHost: true,
  pages: {
    signIn: '/login',
  },
})

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user
  const pathname = req.nextUrl.pathname

  if (pathname === '/') {
    return Response.redirect(new URL(isLoggedIn ? '/dashboard' : '/login', req.nextUrl))
  }

  if (pathname === '/login' && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.nextUrl))
  }

  if (pathname.startsWith('/dashboard') && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
