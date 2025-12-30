import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { format, isPast } from 'date-fns'
import { getBidInvitationStatusVariant, formatStatus } from '@/lib/utils'
import type { BidInvitationStatus } from '@/lib/types'

// Helper to render status icon based on invitation state
function getStatusIcon(invitation: { status: string; followUpDate: Date | null }) {
  if (invitation.status === 'BID_SUBMITTED') {
    return <CheckCircle2 className="h-4 w-4 text-green-600" />
  }
  if (invitation.status === 'DECLINED') {
    return <XCircle className="h-4 w-4 text-red-600" />
  }
  if (invitation.followUpDate && isPast(new Date(invitation.followUpDate))) {
    return <AlertCircle className="h-4 w-4 text-orange-600" />
  }
  return <Clock className="h-4 w-4 text-blue-600" />
}

export default async function BidTrackingPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>
}) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return null
  }

  const params = await searchParams

  const whereClause = {
    project: { userId },
    ...(params.project && { projectId: params.project }),
  }

  const invitations = await prisma.bidInvitation.findMany({
    where: whereClause,
    include: {
      project: true,
      subcontractor: true,
      division: true,
      subdivision: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  type InvitationWithRelations = (typeof invitations)[number]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bid Tracking</h1>
          <p className="text-muted-foreground">
            Track subcontractor invitations and responses
          </p>
        </div>
        <Link href="/dashboard/bid-tracking/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Invitation
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Subcontractor</TableHead>
              <TableHead>Division</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>First Contact</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Follow-up</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No invitations found. Create your first invitation to start tracking bids.
                </TableCell>
              </TableRow>
            ) : (
              invitations.map((invitation: InvitationWithRelations) => (
                <TableRow key={invitation.id}>
                  <TableCell>{getStatusIcon(invitation)}</TableCell>
                  <TableCell className="font-medium">
                    {invitation.project.name}
                  </TableCell>
                  <TableCell>
                    {invitation.subcontractor.companyName}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {invitation.division.code}
                      {invitation.subdivision && (
                        <div className="text-xs text-muted-foreground">
                          {invitation.subdivision.code}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBidInvitationStatusVariant(invitation.status as BidInvitationStatus)}>
                      {formatStatus(invitation.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {invitation.firstContactDate
                      ? format(new Date(invitation.firstContactDate), 'MMM dd')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {invitation.documentsSent && (
                        <Badge variant="outline" className="text-xs">
                          Sent
                        </Badge>
                      )}
                      {invitation.documentsDelivered && (
                        <Badge variant="outline" className="text-xs">
                          Delivered
                        </Badge>
                      )}
                      {invitation.documentsRead && (
                        <Badge variant="outline" className="text-xs">
                          Read
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {invitation.followUpDate ? (
                      <span
                        className={
                          isPast(new Date(invitation.followUpDate))
                            ? 'text-orange-600 font-medium'
                            : ''
                        }
                      >
                        {format(new Date(invitation.followUpDate), 'MMM dd')}
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/bid-tracking/${invitation.id}`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
