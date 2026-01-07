import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({
    message: 'API routes are working',
    runtime: 'nodejs',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  return NextResponse.json({
    message: 'POST is working',
    receivedData: body,
    timestamp: new Date().toISOString()
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
    },
  })
}
