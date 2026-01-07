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
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function SubcontractorsPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return null
  }

  const subcontractors = await prisma.subcontractor.findMany({
    where: { userId },
    include: {
      subcontractorDivisions: {
        include: {
          division: true,
        },
      },
    },
    orderBy: { companyName: 'asc' },
  })

  type SubcontractorWithDivisions = (typeof subcontractors)[number]
  type SubcontractorDivision = SubcontractorWithDivisions['subcontractorDivisions'][number]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subcontractors</h1>
          <p className="text-muted-foreground">
            Manage your subcontractor directory
          </p>
        </div>
        <Link href="/dashboard/subcontractors/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Subcontractor
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Divisions</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subcontractors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No subcontractors found. Add your first subcontractor to get started.
                </TableCell>
              </TableRow>
            ) : (
              subcontractors.map((subcontractor: SubcontractorWithDivisions) => (
                <TableRow key={subcontractor.id}>
                  <TableCell className="font-medium">
                    {subcontractor.companyName}
                  </TableCell>
                  <TableCell>{subcontractor.contactPersonName || '-'}</TableCell>
                  <TableCell>{subcontractor.email || '-'}</TableCell>
                  <TableCell>{subcontractor.phone || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {subcontractor.subcontractorDivisions.length === 0 ? (
                        <span className="text-muted-foreground">None</span>
                      ) : (
                        subcontractor.subcontractorDivisions.map((sd: SubcontractorDivision) => (
                          <Badge key={sd.id} variant="secondary">
                            {sd.division.code}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {subcontractor.city && subcontractor.state
                      ? `${subcontractor.city}, ${subcontractor.state}`
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/subcontractors/${subcontractor.id}`}>
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
