import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Verify project belongs to user
    const project = await prisma.project.findUnique({
      where: { id: body.projectId, userId: session.user.id },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const bid = await prisma.bid.create({
      data: {
        bidInvitationId: body.bidInvitationId,
        projectId: body.projectId,
        subcontractorId: body.subcontractorId,
        divisionId: body.divisionId,
        subdivisionId: body.subdivisionId,
        bidAmount: body.bidAmount,
        bidDate: body.bidDate,
        validUntil: body.validUntil,
        status: body.status,
        notes: body.notes,
      },
    })

    // Update invitation status to BID_SUBMITTED
    await prisma.bidInvitation.update({
      where: { id: body.bidInvitationId },
      data: { status: 'BID_SUBMITTED' },
    })

    return NextResponse.json(bid, { status: 201 })
  } catch (error) {
    console.error('Error creating bid:', error)
    return NextResponse.json({ error: 'Failed to create bid' }, { status: 500 })
  }
}
