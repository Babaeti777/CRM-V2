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
      name,
      description,
      location,
      bidDueDate,
      rfiDate,
      prebidSiteVisit,
      prebidSiteVisitDate,
      status,
      projectDivisions,
      userId,
    } = body

    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        location: location || null,
        bidDueDate: new Date(bidDueDate),
        rfiDate: rfiDate ? new Date(rfiDate) : null,
        prebidSiteVisit,
        prebidSiteVisitDate: prebidSiteVisitDate
          ? new Date(prebidSiteVisitDate)
          : null,
        status,
        userId,
        projectDivisions: {
          create: projectDivisions.map(
            (pd: { divisionId: string; subdivisionId?: string }) => ({
              divisionId: pd.divisionId,
              subdivisionId: pd.subdivisionId || null,
            })
          ),
        },
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
