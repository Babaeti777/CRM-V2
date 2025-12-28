import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function BidComparisonPage({
  searchParams,
}: {
  searchParams: { project?: string; division?: string }
}) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return null
  }

  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  const divisions = await prisma.division.findMany({
    orderBy: { code: 'asc' },
  })

  const whereClause: any = {
    project: { userId },
  }

  if (searchParams.project) {
    whereClause.projectId = searchParams.project
  }

  if (searchParams.division) {
    whereClause.divisionId = searchParams.division
  }

  const bids = await prisma.bid.findMany({
    where: whereClause,
    include: {
      project: true,
      subcontractor: true,
      division: true,
      subdivision: true,
      bidInvitation: true,
    },
    orderBy: [{ projectId: 'asc' }, { divisionId: 'asc' }, { bidAmount: 'asc' }],
  })

  // Group bids by project and division
  const groupedBids: Record<string, Record<string, typeof bids>> = {}

  bids.forEach((bid) => {
    const projectKey = bid.project.id
    const divisionKey = bid.subdivision
      ? `${bid.division.code} - ${bid.subdivision.code}`
      : bid.division.code

    if (!groupedBids[projectKey]) {
      groupedBids[projectKey] = {}
    }
    if (!groupedBids[projectKey][divisionKey]) {
      groupedBids[projectKey][divisionKey] = []
    }
    groupedBids[projectKey][divisionKey].push(bid)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bid Comparison</h1>
          <p className="text-muted-foreground">
            Compare bids by division and subdivision
          </p>
        </div>
        <Link href="/dashboard/bid-comparison/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Bid
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div>
            <select
              className="flex h-9 w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              defaultValue={searchParams.project || ''}
              onChange={(e) => {
                const url = new URL(window.location.href)
                if (e.target.value) {
                  url.searchParams.set('project', e.target.value)
                } else {
                  url.searchParams.delete('project')
                }
                window.location.href = url.toString()
              }}
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="flex h-9 w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              defaultValue={searchParams.division || ''}
              onChange={(e) => {
                const url = new URL(window.location.href)
                if (e.target.value) {
                  url.searchParams.set('division', e.target.value)
                } else {
                  url.searchParams.delete('division')
                }
                window.location.href = url.toString()
              }}
            >
              <option value="">All Divisions</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.code} - {division.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bid Comparison Groups */}
      <div className="space-y-6">
        {Object.keys(groupedBids).length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No bids submitted yet. Add bids to start comparing.
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedBids).map(([projectId, divisionGroups]) => {
            const project = bids.find((b) => b.project.id === projectId)?.project
            return (
              <div key={projectId} className="space-y-4">
                <h2 className="text-2xl font-bold">{project?.name}</h2>

                {Object.entries(divisionGroups).map(([divisionKey, bidList]) => {
                  const lowestBid = bidList[0]
                  return (
                    <Card key={divisionKey}>
                      <CardHeader>
                        <CardTitle className="text-lg">{divisionKey}</CardTitle>
                        <CardDescription>
                          {bidList[0].division.name}
                          {bidList[0].subdivision && ` - ${bidList[0].subdivision.name}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {bidList.map((bid, index) => (
                            <div
                              key={bid.id}
                              className={`flex items-center justify-between p-3 rounded-lg border ${
                                index === 0
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-white'
                              }`}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold">
                                    {bid.subcontractor.companyName}
                                  </p>
                                  {index === 0 && (
                                    <Badge className="bg-green-600">Lowest Bid</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Submitted: {format(new Date(bid.bidDate), 'MMM dd, yyyy')}
                                </p>
                                {bid.notes && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {bid.notes}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold">
                                  ${bid.bidAmount.toLocaleString()}
                                </div>
                                <Badge variant="outline">{bid.status}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
