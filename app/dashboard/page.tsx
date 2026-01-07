import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Building2, Users, FileText, Calendar } from 'lucide-react'
import { format, isBefore, addDays } from 'date-fns'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return null
  }

  // Get statistics
  const [projectCount, subcontractorCount, bidInvitationCount, upcomingDeadlines] =
    await Promise.all([
      prisma.project.count({
        where: { userId, status: { in: ['DRAFT', 'ACTIVE'] } },
      }),
      prisma.subcontractor.count({
        where: { userId },
      }),
      prisma.bidInvitation.count({
        where: {
          project: { userId },
          status: { in: ['INVITED', 'CONTACTED', 'AWAITING_RESPONSE'] },
        },
      }),
      prisma.project.findMany({
        where: {
          userId,
          status: { in: ['ACTIVE'] },
          bidDueDate: {
            gte: new Date(),
            lte: addDays(new Date(), 14),
          },
        },
        orderBy: { bidDueDate: 'asc' },
        take: 5,
        include: {
          projectDivisions: {
            include: {
              division: true,
            },
          },
        },
      }),
    ])

  // Get follow-ups needed
  const followUpsNeeded = await prisma.bidInvitation.findMany({
    where: {
      project: { userId },
      followUpDate: {
        lte: new Date(),
      },
      status: { notIn: ['BID_SUBMITTED', 'DECLINED'] },
    },
    include: {
      project: true,
      subcontractor: true,
      division: true,
    },
    orderBy: { followUpDate: 'asc' },
    take: 5,
  })

  // Type definitions for mapped arrays
  type ProjectWithDivisions = (typeof upcomingDeadlines)[number]
  type InvitationWithRelations = (typeof followUpsNeeded)[number]

  const stats = [
    {
      title: 'Active Projects',
      value: projectCount,
      icon: Building2,
      description: 'Projects in progress',
      href: '/dashboard/projects',
    },
    {
      title: 'Subcontractors',
      value: subcontractorCount,
      icon: Users,
      description: 'Registered contractors',
      href: '/dashboard/subcontractors',
    },
    {
      title: 'Pending Invitations',
      value: bidInvitationCount,
      icon: FileText,
      description: 'Awaiting responses',
      href: '/dashboard/bid-tracking',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Bid Deadlines
            </CardTitle>
            <CardDescription>Projects due in the next 2 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((project: ProjectWithDivisions) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.projectDivisions.map((pd: { division: { name: string } }) => pd.division.name).join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          isBefore(project.bidDueDate, addDays(new Date(), 3))
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {format(project.bidDueDate, 'MMM dd')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Follow-ups Needed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Follow-ups Needed
            </CardTitle>
            <CardDescription>Invitations requiring action</CardDescription>
          </CardHeader>
          <CardContent>
            {followUpsNeeded.length === 0 ? (
              <p className="text-sm text-muted-foreground">No follow-ups needed</p>
            ) : (
              <div className="space-y-3">
                {followUpsNeeded.map((invitation: InvitationWithRelations) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{invitation.subcontractor.companyName}</p>
                      <p className="text-sm text-muted-foreground">
                        {invitation.project.name} - {invitation.division.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">
                        {invitation.followUpDate
                          ? format(invitation.followUpDate, 'MMM dd')
                          : 'Today'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
