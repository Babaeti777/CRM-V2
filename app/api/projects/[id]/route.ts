import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { updateProjectSchema } from '@/lib/validations'
import { ApiResponses } from '@/lib/api-utils'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return ApiResponses.unauthorized()
    }

    const { id } = await params
    const body = await request.json()

    // Validate request body
    const result = updateProjectSchema.safeParse(body)
    if (!result.success) {
      return ApiResponses.badRequest(result.error.errors[0]?.message || 'Invalid request')
    }

    const data = result.data

    if (data.userId && data.userId !== session.user.id) {
      return ApiResponses.forbidden()
    }

    const existing = await prisma.project.findUnique({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return ApiResponses.notFound('Project')
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        description: data.description ?? existing.description,
        location: data.location ?? existing.location,
        ...(data.bidDueDate && { bidDueDate: new Date(data.bidDueDate) }),
        rfiDate: data.rfiDate ? new Date(data.rfiDate) : null,
        prebidSiteVisit: data.prebidSiteVisit ?? existing.prebidSiteVisit,
        prebidSiteVisitDate: data.prebidSiteVisitDate
          ? new Date(data.prebidSiteVisitDate)
          : null,
        ...(data.status && { status: data.status }),
        ...(data.projectDivisions && {
          projectDivisions: {
            deleteMany: {},
            create: data.projectDivisions.map((pd) => ({
              divisionId: pd.divisionId,
              subdivisionId: pd.subdivisionId || null,
            })),
          },
        }),
      },
    })

    return ApiResponses.success(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return ApiResponses.serverError('Failed to update project')
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return ApiResponses.unauthorized()
    }

    const { id } = await params

    const existing = await prisma.project.findUnique({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return ApiResponses.notFound('Project')
    }

    await prisma.project.delete({
      where: { id },
    })

    return ApiResponses.success({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return ApiResponses.serverError('Failed to delete project')
  }
}
