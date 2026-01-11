import { authEdge } from '@/auth.edge'

/**
 * Routes that should redirect to dashboard if authenticated
 */
const AUTH_ROUTES = ['/login']

export default authEdge((req) => {
  const isLoggedIn = !!req.auth?.user
  const pathname = req.nextUrl.pathname

  // Redirect root to appropriate destination
  if (pathname === '/') {
    const destination = isLoggedIn ? '/dashboard' : '/login'
    return Response.redirect(new URL(destination, req.nextUrl))
  }

  // Redirect logged-in users away from auth routes (login)
  if (AUTH_ROUTES.includes(pathname) && isLoggedIn) {
    // Check if there's a callback URL to redirect to
    const callbackUrl = req.nextUrl.searchParams.get('callbackUrl')
    const destination = callbackUrl || '/dashboard'
    return Response.redirect(new URL(destination, req.nextUrl))
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !isLoggedIn) {
    // Preserve the intended destination as callback URL
    const loginUrl = new URL('/login', req.nextUrl)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return Response.redirect(loginUrl)
  }

  // Allow request to proceed
  return
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
