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

    const invitation = await prisma.bidInvitation.create({
      data: {
        projectId: body.projectId,
        subcontractorId: body.subcontractorId,
        divisionId: body.divisionId,
        subdivisionId: body.subdivisionId,
        firstContactDate: body.firstContactDate,
        contactMethod: body.contactMethod,
        responseReceived: body.responseReceived,
        responseDate: body.responseDate,
        documentsSent: body.documentsSent,
        documentsSentDate: body.documentsSentDate,
        documentsDelivered: body.documentsDelivered,
        documentsDeliveredDate: body.documentsDeliveredDate,
        documentsRead: body.documentsRead,
        documentsReadDate: body.documentsReadDate,
        followUpDate: body.followUpDate,
        status: body.status,
        notes: body.notes,
      },
    })

    return NextResponse.json(invitation, { status: 201 })
  } catch (error) {
    console.error('Error creating bid invitation:', error)
    return NextResponse.json(
      { error: 'Failed to create bid invitation' },
      { status: 500 }
    )
  }
}
