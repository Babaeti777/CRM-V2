import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { SubcontractorForm } from '@/components/subcontractor-form'
import { notFound, redirect } from 'next/navigation'

export default async function EditSubcontractorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    redirect('/login')
  }

  const { id } = await params

  const [subcontractor, divisions] = await Promise.all([
    prisma.subcontractor.findUnique({
      where: { id, userId },
      include: {
        subcontractorDivisions: {
          include: {
            division: true,
          },
        },
      },
    }),
    prisma.division.findMany({
      orderBy: { code: 'asc' },
    }),
  ])

  if (!subcontractor) {
    notFound()
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Subcontractor</h1>
        <p className="text-muted-foreground">
          Update subcontractor information
        </p>
      </div>

      <SubcontractorForm
        divisions={divisions}
        userId={userId}
        subcontractor={subcontractor}
      />
    </div>
  )
}
