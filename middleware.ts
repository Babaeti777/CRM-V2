import { auth } from '@/auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user
  const pathname = req.nextUrl.pathname

  // Redirect root
  if (pathname === '/') {
    const dest = isLoggedIn ? '/dashboard' : '/login'
    return Response.redirect(new URL(dest, req.nextUrl))
  }

  // Redirect logged-in users away from login
  if (pathname === '/login' && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.nextUrl))
  }

  // Protect dashboard
  if (pathname.startsWith('/dashboard') && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
