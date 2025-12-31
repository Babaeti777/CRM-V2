import { NextResponse } from 'next/server'

// Debug endpoint to check environment variable status (not values)
export async function GET() {
  const status = {
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  }

  const allConfigured = status.GOOGLE_CLIENT_ID &&
                        status.GOOGLE_CLIENT_SECRET &&
                        (status.AUTH_SECRET || status.NEXTAUTH_SECRET)

  return NextResponse.json({
    configured: allConfigured,
    variables: status,
    hint: allConfigured
      ? 'All required variables are set'
      : 'Missing variables - check Vercel Environment Variables settings',
  })
}
