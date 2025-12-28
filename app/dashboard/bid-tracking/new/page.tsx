import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { BidInvitationForm } from '@/components/bid-invitation-form'
import { redirect } from 'next/navigation'

export default async function NewBidInvitationPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    redirect('/login')
  }

  const [projects, subcontractors, divisions, subdivisions] = await Promise.all([
    prisma.project.findMany({
      where: { userId, status: { in: ['DRAFT', 'ACTIVE'] } },
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

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Bid Invitation</h1>
        <p className="text-muted-foreground">
          Send a bid invitation to a subcontractor
        </p>
      </div>

      <BidInvitationForm
        projects={projects}
        subcontractors={subcontractors}
        divisions={divisions}
        subdivisions={subdivisions}
        userId={userId}
      />
    </div>
  )
}
