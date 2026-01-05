import { z } from 'zod'
import { sanitizeInput, sanitizeEmail, sanitizePhone, sanitizeHTML } from './sanitize'

// Project validation schemas
export const projectDivisionSchema = z.object({
  divisionId: z.string().min(1),
  subdivisionId: z.string().optional().nullable(),
})

export const createProjectSchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .max(255, 'Project name must be less than 255 characters')
    .transform(sanitizeHTML),
  description: z.string()
    .optional()
    .nullable()
    .transform(val => val ? sanitizeHTML(val) : val),
  location: z.string()
    .optional()
    .nullable()
    .transform(val => val ? sanitizeInput(val) : val),
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
  companyName: z.string()
    .min(1, 'Company name is required')
    .max(255, 'Company name must be less than 255 characters')
    .transform(sanitizeInput),
  contactPersonName: z.string()
    .optional()
    .nullable()
    .transform(val => val ? sanitizeInput(val) : val),
  email: z.string()
    .email('Please enter a valid email address')
    .optional()
    .nullable()
    .or(z.literal(''))
    .transform(val => val ? sanitizeEmail(val) : val),
  phone: z.string()
    .optional()
    .nullable()
    .transform(val => val ? sanitizePhone(val) : val),
  officeAddress: z.string()
    .optional()
    .nullable()
    .transform(val => val ? sanitizeInput(val) : val),
  city: z.string()
    .optional()
    .nullable()
    .transform(val => val ? sanitizeInput(val) : val),
  state: z.string()
    .max(2, 'State code must be 2 characters')
    .optional()
    .nullable()
    .transform(val => val ? sanitizeInput(val).toUpperCase() : val),
  zipCode: z.string()
    .max(10, 'Zip code must be less than 10 characters')
    .optional()
    .nullable()
    .transform(val => val ? sanitizeInput(val) : val),
  notes: z.string()
    .optional()
    .nullable()
    .transform(val => val ? sanitizeHTML(val) : val),
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
  notes: z.string()
    .optional()
    .nullable()
    .transform(val => val ? sanitizeHTML(val) : val),
})

export const updateBidInvitationSchema = createBidInvitationSchema.partial()

// Bid validation schemas
export const createBidSchema = z.object({
  bidInvitationId: z.string().min(1, 'Bid invitation is required'),
  bidAmount: z.number().positive('Bid amount must be positive'),
  validUntil: z.string().or(z.date()).optional().nullable(),
  notes: z.string()
    .optional()
    .nullable()
    .transform(val => val ? sanitizeHTML(val) : val),
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
