import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { updateBidInvitationSchema } from '@/lib/validations'
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
    const result = updateBidInvitationSchema.safeParse(body)
    if (!result.success) {
      return ApiResponses.badRequest(result.error.errors[0]?.message || 'Invalid request')
    }

    const data = result.data

    // Verify invitation belongs to user's project
    const existing = await prisma.bidInvitation.findFirst({
      where: {
        id,
        project: { userId: session.user.id },
      },
    })

    if (!existing) {
      return ApiResponses.notFound('Bid invitation')
    }

    const invitation = await prisma.bidInvitation.update({
      where: { id },
      data: {
        ...(data.projectId && { projectId: data.projectId }),
        ...(data.subcontractorId && { subcontractorId: data.subcontractorId }),
        ...(data.divisionId && { divisionId: data.divisionId }),
        subdivisionId: data.subdivisionId ?? existing.subdivisionId,
        firstContactDate: data.firstContactDate ? new Date(data.firstContactDate) : existing.firstContactDate,
        contactMethod: data.contactMethod ?? existing.contactMethod,
        responseReceived: data.responseReceived ?? existing.responseReceived,
        responseDate: data.responseDate ? new Date(data.responseDate) : existing.responseDate,
        documentsSent: data.documentsSent ?? existing.documentsSent,
        documentsSentDate: data.documentsSentDate ? new Date(data.documentsSentDate) : existing.documentsSentDate,
        documentsDelivered: data.documentsDelivered ?? existing.documentsDelivered,
        documentsDeliveredDate: data.documentsDeliveredDate ? new Date(data.documentsDeliveredDate) : existing.documentsDeliveredDate,
        documentsRead: data.documentsRead ?? existing.documentsRead,
        documentsReadDate: data.documentsReadDate ? new Date(data.documentsReadDate) : existing.documentsReadDate,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : existing.followUpDate,
        ...(data.status && { status: data.status }),
        notes: data.notes ?? existing.notes,
      },
    })

    return ApiResponses.success(invitation)
  } catch (error) {
    console.error('Error updating bid invitation:', error)
    return ApiResponses.serverError('Failed to update bid invitation')
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

    const existing = await prisma.bidInvitation.findFirst({
      where: {
        id,
        project: { userId: session.user.id },
      },
    })

    if (!existing) {
      return ApiResponses.notFound('Bid invitation')
    }

    await prisma.bidInvitation.delete({
      where: { id },
    })

    return ApiResponses.success({ success: true })
  } catch (error) {
    console.error('Error deleting bid invitation:', error)
    return ApiResponses.serverError('Failed to delete bid invitation')
  }
}
