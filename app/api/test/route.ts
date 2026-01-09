import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Simple test GET works',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  return NextResponse.json({
    success: true,
    message: 'Simple test POST works',
    receivedData: body,
    timestamp: new Date().toISOString()
  })
}
