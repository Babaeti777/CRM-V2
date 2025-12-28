import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { updateSubcontractorSchema } from '@/lib/validations'
import { ApiResponses } from '@/lib/api-utils'

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
    const result = updateSubcontractorSchema.safeParse(body)
    if (!result.success) {
      return ApiResponses.badRequest(result.error.errors[0]?.message || 'Invalid request')
    }

    const data = result.data

    if (data.userId && data.userId !== session.user.id) {
      return ApiResponses.forbidden()
    }

    const existing = await prisma.subcontractor.findUnique({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return ApiResponses.notFound('Subcontractor')
    }

    const subcontractor = await prisma.subcontractor.update({
      where: { id },
      data: {
        ...(data.companyName && { companyName: data.companyName }),
        contactPersonName: data.contactPersonName ?? existing.contactPersonName,
        email: data.email ?? existing.email,
        phone: data.phone ?? existing.phone,
        officeAddress: data.officeAddress ?? existing.officeAddress,
        city: data.city ?? existing.city,
        state: data.state ?? existing.state,
        zipCode: data.zipCode ?? existing.zipCode,
        notes: data.notes ?? existing.notes,
        ...(data.divisionIds && {
          subcontractorDivisions: {
            deleteMany: {},
            create: data.divisionIds.map((divisionId) => ({
              divisionId,
            })),
          },
        }),
      },
    })

    return ApiResponses.success(subcontractor)
  } catch (error) {
    console.error('Error updating subcontractor:', error)
    return ApiResponses.serverError('Failed to update subcontractor')
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

    const existing = await prisma.subcontractor.findUnique({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return ApiResponses.notFound('Subcontractor')
    }

    await prisma.subcontractor.delete({
      where: { id },
    })

    return ApiResponses.success({ success: true })
  } catch (error) {
    console.error('Error deleting subcontractor:', error)
    return ApiResponses.serverError('Failed to delete subcontractor')
  }
}
