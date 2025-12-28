import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const invitations = await prisma.bidInvitation.findMany({
      where: {
        project: { userId: session.user.id },
        status: { in: ['RESPONDED', 'CONTACTED', 'AWAITING_RESPONSE'] },
      },
      include: {
        project: true,
        subcontractor: true,
        division: true,
        subdivision: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(invitations)
  } catch (error) {
    console.error('Error fetching invitations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    )
  }
}
