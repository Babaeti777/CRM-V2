import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { createProjectSchema } from '@/lib/validations'

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

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      include: {
        projectDivisions: {
          include: {
            division: true,
            subdivision: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch projects' } },
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

    const result = createProjectSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { message: result.error.errors[0]?.message || 'Invalid request' } },
        { status: 400 }
      )
    }

    const data = { ...result.data, userId: session.user.id }

    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description || null,
        location: data.location || null,
        bidDueDate: new Date(data.bidDueDate),
        rfiDate: data.rfiDate ? new Date(data.rfiDate) : null,
        prebidSiteVisit: data.prebidSiteVisit,
        prebidSiteVisitDate: data.prebidSiteVisitDate
          ? new Date(data.prebidSiteVisitDate)
          : null,
        status: data.status,
        userId: data.userId,
        projectDivisions: {
          create: data.projectDivisions.map((pd) => ({
            divisionId: pd.divisionId,
            subdivisionId: pd.subdivisionId || null,
          })),
        },
      },
    })

    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Failed to create project' } },
      { status: 500 }
    )
  }
}
