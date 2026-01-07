import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { ApiResponses } from '@/lib/api-utils'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Status values that indicate an invitation is ready for bid submission
const READY_FOR_BID_STATUSES = ['RESPONDED', 'CONTACTED', 'AWAITING_RESPONSE'] as const

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return ApiResponses.unauthorized()
    }

    const invitations = await prisma.bidInvitation.findMany({
      where: {
        project: { userId: session.user.id },
        status: { in: [...READY_FOR_BID_STATUSES] },
      },
      include: {
        project: true,
        subcontractor: true,
        division: true,
        subdivision: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return ApiResponses.success(invitations)
  } catch (error) {
    console.error('Error fetching invitations:', error)
    return ApiResponses.serverError('Failed to fetch invitations')
  }
}
