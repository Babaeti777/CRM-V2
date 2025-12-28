import { auth } from '@/auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnLoginPage = req.nextUrl.pathname.startsWith('/login')

  // Redirect logged-in users away from login page
  if (isLoggedIn && isOnLoginPage) {
    return Response.redirect(new URL('/dashboard', req.url))
  }

  // Redirect non-logged-in users to login page (except for login page itself)
  if (!isLoggedIn && !isOnLoginPage) {
    return Response.redirect(new URL('/login', req.url))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
