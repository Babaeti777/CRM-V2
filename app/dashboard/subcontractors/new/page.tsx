import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { SubcontractorForm } from '@/components/subcontractor-form'
import { redirect } from 'next/navigation'

export default async function NewSubcontractorPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    redirect('/login')
  }

  const divisions = await prisma.division.findMany({
    orderBy: { code: 'asc' },
  })

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Subcontractor</h1>
        <p className="text-muted-foreground">
          Add a new subcontractor to your directory
        </p>
      </div>

      <SubcontractorForm divisions={divisions} userId={userId} />
    </div>
  )
}
