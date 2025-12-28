import { z } from 'zod'

// Project validation schemas
export const projectDivisionSchema = z.object({
  divisionId: z.string().min(1),
  subdivisionId: z.string().optional().nullable(),
})

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  bidDueDate: z.string().or(z.date()),
  rfiDate: z.string().or(z.date()).optional().nullable(),
  prebidSiteVisit: z.boolean().default(false),
  prebidSiteVisitDate: z.string().or(z.date()).optional().nullable(),
  status: z.enum(['DRAFT', 'ACTIVE', 'CLOSED', 'AWARDED']).default('DRAFT'),
  projectDivisions: z.array(projectDivisionSchema).min(1, 'At least one division is required'),
  userId: z.string().min(1),
})

export const updateProjectSchema = createProjectSchema.partial().extend({
  projectDivisions: z.array(projectDivisionSchema).optional(),
})

// Subcontractor validation schemas
export const createSubcontractorSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactPersonName: z.string().optional().nullable(),
  email: z.string().email('Invalid email').optional().nullable().or(z.literal('')),
  phone: z.string().optional().nullable(),
  officeAddress: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  divisionIds: z.array(z.string()).min(1, 'At least one division is required'),
  userId: z.string().min(1),
})

export const updateSubcontractorSchema = createSubcontractorSchema.partial().extend({
  divisionIds: z.array(z.string()).optional(),
})

// Bid Invitation validation schemas
export const createBidInvitationSchema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  subcontractorId: z.string().min(1, 'Subcontractor is required'),
  divisionId: z.string().min(1, 'Division is required'),
  subdivisionId: z.string().optional().nullable(),
  firstContactDate: z.string().or(z.date()).optional().nullable(),
  contactMethod: z.enum(['EMAIL', 'PHONE', 'IN_PERSON', 'OTHER']).optional().nullable(),
  responseReceived: z.boolean().default(false),
  responseDate: z.string().or(z.date()).optional().nullable(),
  documentsSent: z.boolean().default(false),
  documentsSentDate: z.string().or(z.date()).optional().nullable(),
  documentsDelivered: z.boolean().default(false),
  documentsDeliveredDate: z.string().or(z.date()).optional().nullable(),
  documentsRead: z.boolean().default(false),
  documentsReadDate: z.string().or(z.date()).optional().nullable(),
  followUpDate: z.string().or(z.date()).optional().nullable(),
  status: z.enum([
    'INVITED',
    'CONTACTED',
    'AWAITING_RESPONSE',
    'RESPONDED',
    'DECLINED',
    'BID_SUBMITTED',
  ]).default('INVITED'),
  notes: z.string().optional().nullable(),
})

export const updateBidInvitationSchema = createBidInvitationSchema.partial()

// Bid validation schemas
export const createBidSchema = z.object({
  bidInvitationId: z.string().min(1, 'Bid invitation is required'),
  bidAmount: z.number().positive('Bid amount must be positive'),
  validUntil: z.string().or(z.date()).optional().nullable(),
  notes: z.string().optional().nullable(),
})

export const updateBidSchema = createBidSchema.partial()

// Type exports for use in components
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type CreateSubcontractorInput = z.infer<typeof createSubcontractorSchema>
export type UpdateSubcontractorInput = z.infer<typeof updateSubcontractorSchema>
export type CreateBidInvitationInput = z.infer<typeof createBidInvitationSchema>
export type UpdateBidInvitationInput = z.infer<typeof updateBidInvitationSchema>
export type CreateBidInput = z.infer<typeof createBidSchema>
export type UpdateBidInput = z.infer<typeof updateBidSchema>
