/**
 * Health check endpoint
 * Returns service health status and basic diagnostics
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const startTime = Date.now()

  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`

    const responseTime = Date.now() - startTime

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: 'up',
          responseTime: `${responseTime}ms`,
        },
        api: {
          status: 'up',
        },
      },
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development',
    })
  } catch (error) {
    const responseTime = Date.now() - startTime

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        services: {
          database: {
            status: 'down',
            error: error instanceof Error ? error.message : 'Unknown error',
            responseTime: `${responseTime}ms`,
          },
          api: {
            status: 'up',
          },
        },
        version: process.env.npm_package_version || '0.1.0',
        environment: process.env.NODE_ENV || 'development',
      },
      { status: 503 }
    )
  }
}
