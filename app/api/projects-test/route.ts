import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
    },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Just echo back what we received
    return NextResponse.json({
      success: true,
      message: 'Projects endpoint POST is working',
      receivedData: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: { message: 'Error processing request' }
    }, { status: 500 })
  }
}
