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
    const {
      companyName,
      contactPersonName,
      email,
      phone,
      officeAddress,
      city,
      state,
      zipCode,
      notes,
      divisionIds,
      userId,
    } = body

    // Verify user matches session
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Verify subcontractor belongs to user
    const existing = await prisma.subcontractor.findUnique({
      where: { id: params.id, userId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Update subcontractor
    const subcontractor = await prisma.subcontractor.update({
      where: { id: params.id },
      data: {
        companyName,
        contactPersonName: contactPersonName || null,
        email: email || null,
        phone: phone || null,
        officeAddress: officeAddress || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
        notes: notes || null,
        subcontractorDivisions: {
          deleteMany: {},
          create: divisionIds.map((divisionId: string) => ({
            divisionId,
          })),
        },
      },
    })

    return NextResponse.json(subcontractor)
  } catch (error) {
    console.error('Error updating subcontractor:', error)
    return NextResponse.json(
      { error: 'Failed to update subcontractor' },
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

    // Verify subcontractor belongs to user
    const existing = await prisma.subcontractor.findUnique({
      where: { id: params.id, userId: session.user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.subcontractor.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting subcontractor:', error)
    return NextResponse.json(
      { error: 'Failed to delete subcontractor' },
      { status: 500 }
    )
  }
}
