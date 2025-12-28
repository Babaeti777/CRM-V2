import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
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

    const existing = await prisma.project.findUnique({
      where: { id, userId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const project = await prisma.project.update({
      where: { id },
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
        projectDivisions: {
          deleteMany: {},
          create: projectDivisions.map(
            (pd: { divisionId: string; subdivisionId?: string }) => ({
              divisionId: pd.divisionId,
              subdivisionId: pd.subdivisionId || null,
            })
          ),
        },
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.project.findUnique({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.project.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
