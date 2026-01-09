import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { createSubcontractorSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      )
    }

    const subcontractors = await prisma.subcontractor.findMany({
      where: { userId: session.user.id },
      include: {
        subcontractorDivisions: {
          include: {
            division: true,
          },
        },
      },
      orderBy: { companyName: 'asc' },
    })

    return NextResponse.json({ success: true, data: subcontractors })
  } catch (error) {
    console.error('Error fetching subcontractors:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch subcontractors' } },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      )
    }

    const body = await request.json()

    const result = createSubcontractorSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { message: result.error.errors[0]?.message || 'Invalid request' } },
        { status: 400 }
      )
    }

    const data = result.data

    const subcontractor = await prisma.subcontractor.create({
      data: {
        companyName: data.companyName,
        contactPersonName: data.contactPersonName || null,
        email: data.email || null,
        phone: data.phone || null,
        officeAddress: data.officeAddress || null,
        city: data.city || null,
        state: data.state || null,
        zipCode: data.zipCode || null,
        notes: data.notes || null,
        userId: session.user.id,
        subcontractorDivisions: {
          create: data.divisionIds.map((divisionId) => ({
            divisionId,
          })),
        },
      },
    })

    return NextResponse.json({ success: true, data: subcontractor }, { status: 201 })
  } catch (error) {
    console.error('Error creating subcontractor:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Failed to create subcontractor' } },
      { status: 500 }
    )
  }
}
