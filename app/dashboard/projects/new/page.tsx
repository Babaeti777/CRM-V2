import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ProjectForm } from '@/components/project-form'
import { redirect } from 'next/navigation'

export default async function NewProjectPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    redirect('/login')
  }

  const [divisions, subdivisions] = await Promise.all([
    prisma.division.findMany({
      orderBy: { code: 'asc' },
    }),
    prisma.subdivision.findMany({
      include: { division: true },
      orderBy: { code: 'asc' },
    }),
  ])

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Project</h1>
        <p className="text-muted-foreground">
          Create a new construction project
        </p>
      </div>

      <ProjectForm divisions={divisions} subdivisions={subdivisions} userId={userId} />
    </div>
  )
}
