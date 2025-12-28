import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Verify invitation belongs to user's project
    const existing = await prisma.bidInvitation.findFirst({
      where: {
        id: params.id,
        project: { userId: session.user.id },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const invitation = await prisma.bidInvitation.update({
      where: { id: params.id },
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

    return NextResponse.json(invitation)
  } catch (error) {
    console.error('Error updating bid invitation:', error)
    return NextResponse.json(
      { error: 'Failed to update bid invitation' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existing = await prisma.bidInvitation.findFirst({
      where: {
        id: params.id,
        project: { userId: session.user.id },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.bidInvitation.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting bid invitation:', error)
    return NextResponse.json(
      { error: 'Failed to delete bid invitation' },
      { status: 500 }
    )
  }
}
