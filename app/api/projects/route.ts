import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { createProjectSchema } from '@/lib/validations'
import { ApiResponses } from '@/lib/api-utils'

// Route segment config - must be at top level
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
    },
  })
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return ApiResponses.unauthorized()
    }

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      include: {
        projectDivisions: {
          include: {
            division: true,
            subdivision: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return ApiResponses.success(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return ApiResponses.serverError('Failed to fetch projects')
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return ApiResponses.unauthorized()
    }

    const body = await request.json()

    // Validate request body
    const result = createProjectSchema.safeParse(body)
    if (!result.success) {
      return ApiResponses.badRequest(result.error.errors[0]?.message || 'Invalid request')
    }

    const data = { ...result.data, userId: session.user.id }

    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description || null,
        location: data.location || null,
        bidDueDate: new Date(data.bidDueDate),
        rfiDate: data.rfiDate ? new Date(data.rfiDate) : null,
        prebidSiteVisit: data.prebidSiteVisit,
        prebidSiteVisitDate: data.prebidSiteVisitDate
          ? new Date(data.prebidSiteVisitDate)
          : null,
        status: data.status,
        userId: data.userId,
        projectDivisions: {
          create: data.projectDivisions.map((pd) => ({
            divisionId: pd.divisionId,
            subdivisionId: pd.subdivisionId || null,
          })),
        },
      },
    })

    return ApiResponses.created(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return ApiResponses.serverError('Failed to create project')
  }
}
