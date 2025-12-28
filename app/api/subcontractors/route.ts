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

    const subcontractor = await prisma.subcontractor.create({
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
        userId,
        subcontractorDivisions: {
          create: divisionIds.map((divisionId: string) => ({
            divisionId,
          })),
        },
      },
    })

    return NextResponse.json(subcontractor, { status: 201 })
  } catch (error) {
    console.error('Error creating subcontractor:', error)
    return NextResponse.json(
      { error: 'Failed to create subcontractor' },
      { status: 500 }
    )
  }
}
