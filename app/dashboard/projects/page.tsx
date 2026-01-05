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
import { format } from 'date-fns'
import { getProjectStatusVariant } from '@/lib/utils'
import type { ProjectStatus } from '@/lib/types'

export default async function ProjectsPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return null
  }

  const projects = await prisma.project.findMany({
    where: { userId },
    include: {
      projectDivisions: {
        include: {
          division: true,
          subdivision: true,
        },
      },
      _count: {
        select: {
          bidInvitations: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  type ProjectWithDivisions = (typeof projects)[number]
  type ProjectDivision = ProjectWithDivisions['projectDivisions'][number]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your construction projects
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Divisions</TableHead>
              <TableHead>Bid Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invitations</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No projects found. Create your first project to get started.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project: ProjectWithDivisions) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    {project.name}
                  </TableCell>
                  <TableCell>{project.location || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.projectDivisions.slice(0, 2).map((pd: ProjectDivision) => (
                        <Badge key={pd.id} variant="secondary">
                          {pd.division.code}
                        </Badge>
                      ))}
                      {project.projectDivisions.length > 2 && (
                        <Badge variant="outline">
                          +{project.projectDivisions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(project.bidDueDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getProjectStatusVariant(project.status as ProjectStatus)}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{project._count.bidInvitations}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/projects/${project.id}`}>
                      <Button variant="ghost" size="sm">
                        View
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
