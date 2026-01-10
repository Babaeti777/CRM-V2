import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { createProjectSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Test GET to verify the route loads
export async function GET() {
  try {
    // Test prisma connection
    const count = await prisma.project.count()

    return NextResponse.json({
      success: true,
      message: 'Projects-test route is working',
      projectCount: count,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        message: 'Error in GET',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Test auth
    const session = await auth()

    const body = await request.json()

    // Test validation
    const result = createProjectSchema.safeParse(body)

    return NextResponse.json({
      success: true,
      message: 'Projects-test POST is working',
      authenticated: !!session?.user,
      validationPassed: result.success,
      receivedData: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        message: 'Error in POST',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}
