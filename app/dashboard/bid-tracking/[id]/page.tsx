import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { BidInvitationForm } from '@/components/bid-invitation-form'
import { notFound, redirect } from 'next/navigation'

export default async function EditBidInvitationPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    redirect('/login')
  }

  const [invitation, projects, subcontractors, divisions, subdivisions] = await Promise.all([
    prisma.bidInvitation.findFirst({
      where: {
        id: params.id,
        project: { userId },
      },
      include: {
        project: true,
        subcontractor: true,
        division: true,
        subdivision: true,
      },
    }),
    prisma.project.findMany({
      where: { userId },
      include: {
        projectDivisions: {
          include: {
            division: true,
            subdivision: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.subcontractor.findMany({
      where: { userId },
      include: {
        subcontractorDivisions: {
          include: {
            division: true,
          },
        },
      },
      orderBy: { companyName: 'asc' },
    }),
    prisma.division.findMany({
      orderBy: { code: 'asc' },
    }),
    prisma.subdivision.findMany({
      include: { division: true },
      orderBy: { code: 'asc' },
    }),
  ])

  if (!invitation) {
    notFound()
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Bid Invitation</h1>
        <p className="text-muted-foreground">
          Update bid invitation tracking information
        </p>
      </div>

      <BidInvitationForm
        projects={projects}
        subcontractors={subcontractors}
        divisions={divisions}
        subdivisions={subdivisions}
        userId={userId}
        invitation={invitation}
      />
    </div>
  )
}
