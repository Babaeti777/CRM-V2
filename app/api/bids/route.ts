import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { createBidSchema } from '@/lib/validations'
import { ApiResponses } from '@/lib/api-utils'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return ApiResponses.unauthorized()
    }

    const body = await request.json()

    // Validate request body
    const result = createBidSchema.safeParse(body)
    if (!result.success) {
      return ApiResponses.badRequest(result.error.errors[0]?.message || 'Invalid request')
    }

    const data = result.data

    // Verify invitation exists and belongs to user's project
    const invitation = await prisma.bidInvitation.findFirst({
      where: {
        id: data.bidInvitationId,
        project: { userId: session.user.id },
      },
      include: {
        project: true,
        subcontractor: true,
        division: true,
      },
    })

    if (!invitation) {
      return ApiResponses.notFound('Bid invitation')
    }

    const bid = await prisma.bid.create({
      data: {
        bidInvitationId: data.bidInvitationId,
        projectId: invitation.projectId,
        subcontractorId: invitation.subcontractorId,
        divisionId: invitation.divisionId,
        subdivisionId: invitation.subdivisionId,
        bidAmount: data.bidAmount,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        notes: data.notes || null,
        status: 'SUBMITTED',
      },
    })

    // Update invitation status to BID_SUBMITTED
    await prisma.bidInvitation.update({
      where: { id: data.bidInvitationId },
      data: { status: 'BID_SUBMITTED' },
    })

    return ApiResponses.created(bid)
  } catch (error) {
    console.error('Error creating bid:', error)
    return ApiResponses.serverError('Failed to create bid')
  }
}
