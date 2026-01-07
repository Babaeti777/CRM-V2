import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { createSubcontractorSchema } from '@/lib/validations'
import { ApiResponses } from '@/lib/api-utils'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
// Use Node.js runtime on Vercel
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return ApiResponses.unauthorized()
    }

    const body = await request.json()

    // Validate request body
    const result = createSubcontractorSchema.safeParse(body)
    if (!result.success) {
      return ApiResponses.badRequest(result.error.errors[0]?.message || 'Invalid request')
    }

    const data = result.data

    const subcontractor = await prisma.subcontractor.create({
      data: {
        companyName: data.companyName,
        contactPersonName: data.contactPersonName || null,
        email: data.email || null,
        phone: data.phone || null,
        officeAddress: data.officeAddress || null,
        city: data.city || null,
        state: data.state || null,
        zipCode: data.zipCode || null,
        notes: data.notes || null,
        userId: session.user.id,
        subcontractorDivisions: {
          create: data.divisionIds.map((divisionId) => ({
            divisionId,
          })),
        },
      },
    })

    return ApiResponses.created(subcontractor)
  } catch (error) {
    console.error('Error creating subcontractor:', error)
    return ApiResponses.serverError('Failed to create subcontractor')
  }
}
