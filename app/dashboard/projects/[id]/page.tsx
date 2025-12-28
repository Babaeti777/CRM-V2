import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ProjectForm } from '@/components/project-form'
import { notFound, redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import Link from 'next/link'

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    redirect('/login')
  }

  const [project, divisions, subdivisions] = await Promise.all([
    prisma.project.findUnique({
      where: { id: params.id, userId },
      include: {
        projectDivisions: {
          include: {
            division: true,
            subdivision: true,
          },
        },
        bidInvitations: {
          include: {
            subcontractor: true,
            division: true,
            subdivision: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        bids: {
          include: {
            subcontractor: true,
            division: true,
            subdivision: true,
          },
          orderBy: { bidAmount: 'asc' },
        },
      },
    }),
    prisma.division.findMany({
      orderBy: { code: 'asc' },
    }),
    prisma.subdivision.findMany({
      include: { division: true },
      orderBy: { code: 'asc' },
    }),
  ])

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="invitations">
            Bid Invitations ({project.bidInvitations.length})
          </TabsTrigger>
          <TabsTrigger value="bids">
            Submitted Bids ({project.bids.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <ProjectForm
            divisions={divisions}
            subdivisions={subdivisions}
            userId={userId}
            project={project}
          />
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Bid Invitations</h3>
              <p className="text-sm text-muted-foreground">
                Track invitations sent to subcontractors
              </p>
            </div>
            <Link href={`/dashboard/bid-tracking?project=${project.id}`}>
              <Button>Manage Invitations</Button>
            </Link>
          </div>

          <div className="grid gap-4">
            {project.bidInvitations.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No invitations sent yet. Go to Bid Tracking to send invitations.
                </CardContent>
              </Card>
            ) : (
              project.bidInvitations.map((invitation) => (
                <Card key={invitation.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">
                          {invitation.subcontractor.companyName}
                        </CardTitle>
                        <CardDescription>
                          {invitation.division.name}
                          {invitation.subdivision && ` - ${invitation.subdivision.name}`}
                        </CardDescription>
                      </div>
                      <Badge>{invitation.status.replace('_', ' ')}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    {invitation.firstContactDate && (
                      <div>
                        <span className="font-medium">First Contact:</span>{' '}
                        {format(new Date(invitation.firstContactDate), 'MMM dd, yyyy')}
                      </div>
                    )}
                    {invitation.responseReceived && invitation.responseDate && (
                      <div>
                        <span className="font-medium">Response:</span>{' '}
                        {format(new Date(invitation.responseDate), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="bids" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Submitted Bids</h3>
            <p className="text-sm text-muted-foreground">
              Compare bids from subcontractors
            </p>
          </div>

          <div className="grid gap-4">
            {project.bids.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No bids submitted yet.
                </CardContent>
              </Card>
            ) : (
              project.bids.map((bid) => (
                <Card key={bid.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">
                          {bid.subcontractor.companyName}
                        </CardTitle>
                        <CardDescription>
                          {bid.division.name}
                          {bid.subdivision && ` - ${bid.subdivision.name}`}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          ${bid.bidAmount.toLocaleString()}
                        </div>
                        <Badge variant="outline">{bid.status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div>
                      <span className="font-medium">Submitted:</span>{' '}
                      {format(new Date(bid.bidDate), 'MMM dd, yyyy')}
                    </div>
                    {bid.validUntil && (
                      <div>
                        <span className="font-medium">Valid Until:</span>{' '}
                        {format(new Date(bid.validUntil), 'MMM dd, yyyy')}
                      </div>
                    )}
                    {bid.notes && (
                      <div className="mt-2">
                        <span className="font-medium">Notes:</span>
                        <p className="text-muted-foreground">{bid.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
