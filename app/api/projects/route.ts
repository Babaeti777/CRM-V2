import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { createProjectSchema } from '@/lib/validations'
import { ApiResponses } from '@/lib/api-utils'

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

    const data = result.data

    if (data.userId !== session.user.id) {
      return ApiResponses.forbidden()
    }

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
