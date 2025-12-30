import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { createBidInvitationSchema } from '@/lib/validations'
import { ApiResponses } from '@/lib/api-utils'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return ApiResponses.unauthorized()
    }

    const body = await request.json()

    // Validate request body
    const result = createBidInvitationSchema.safeParse(body)
    if (!result.success) {
      return ApiResponses.badRequest(result.error.errors[0]?.message || 'Invalid request')
    }

    const data = result.data

    // Verify project belongs to user
    const project = await prisma.project.findUnique({
      where: { id: data.projectId, userId: session.user.id },
    })

    if (!project) {
      return ApiResponses.notFound('Project')
    }

    const invitation = await prisma.bidInvitation.create({
      data: {
        projectId: data.projectId,
        subcontractorId: data.subcontractorId,
        divisionId: data.divisionId,
        subdivisionId: data.subdivisionId || null,
        firstContactDate: data.firstContactDate ? new Date(data.firstContactDate) : null,
        contactMethod: data.contactMethod || null,
        responseReceived: data.responseReceived,
        responseDate: data.responseDate ? new Date(data.responseDate) : null,
        documentsSent: data.documentsSent,
        documentsSentDate: data.documentsSentDate ? new Date(data.documentsSentDate) : null,
        documentsDelivered: data.documentsDelivered,
        documentsDeliveredDate: data.documentsDeliveredDate ? new Date(data.documentsDeliveredDate) : null,
        documentsRead: data.documentsRead,
        documentsReadDate: data.documentsReadDate ? new Date(data.documentsReadDate) : null,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        status: data.status,
        notes: data.notes || null,
      },
    })

    return ApiResponses.created(invitation)
  } catch (error) {
    console.error('Error creating bid invitation:', error)
    return ApiResponses.serverError('Failed to create bid invitation')
  }
}
