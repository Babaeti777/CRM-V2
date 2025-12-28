// Centralized type definitions for the CRM application
// These types are defined independently to work without generated Prisma client

// Project status types
export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'AWARDED'

// Bid invitation status types
export type BidInvitationStatus =
  | 'INVITED'
  | 'CONTACTED'
  | 'AWAITING_RESPONSE'
  | 'RESPONDED'
  | 'DECLINED'
  | 'BID_SUBMITTED'

// Contact method types
export type ContactMethod = 'EMAIL' | 'PHONE' | 'IN_PERSON' | 'OTHER'

// Bid status types
export type BidStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED'

// Badge variant types (matching shadcn/ui)
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

// Base entity types
export interface Division {
  id: string
  code: string
  name: string
}

export interface Subdivision {
  id: string
  code: string
  name: string
  divisionId: string
  division?: Division
}

export interface Project {
  id: string
  name: string
  description: string | null
  location: string | null
  bidDueDate: Date
  rfiDate: Date | null
  prebidSiteVisit: boolean
  prebidSiteVisitDate: Date | null
  status: ProjectStatus
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Subcontractor {
  id: string
  companyName: string
  contactPersonName: string | null
  email: string | null
  phone: string | null
  officeAddress: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  notes: string | null
  userId: string
}

export interface ProjectDivision {
  id: string
  projectId: string
  divisionId: string
  subdivisionId: string | null
}

export interface SubcontractorDivision {
  id: string
  subcontractorId: string
  divisionId: string
}

export interface BidInvitation {
  id: string
  projectId: string
  subcontractorId: string
  divisionId: string
  subdivisionId: string | null
  firstContactDate: Date | null
  contactMethod: ContactMethod | null
  responseReceived: boolean
  responseDate: Date | null
  documentsSent: boolean
  documentsSentDate: Date | null
  documentsDelivered: boolean
  documentsDeliveredDate: Date | null
  documentsRead: boolean
  documentsReadDate: Date | null
  followUpDate: Date | null
  status: BidInvitationStatus
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Bid {
  id: string
  bidInvitationId: string
  projectId: string
  subcontractorId: string
  divisionId: string
  subdivisionId: string | null
  bidAmount: number
  bidDate: Date
  validUntil: Date | null
  status: BidStatus
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

// Extended types with relations
export type ProjectWithDivisions = Project & {
  projectDivisions: (ProjectDivision & {
    division: Division
    subdivision: Subdivision | null
  })[]
  _count?: {
    bidInvitations: number
  }
}

export type SubcontractorWithDivisions = Subcontractor & {
  subcontractorDivisions: (SubcontractorDivision & {
    division: Division
  })[]
}

export type BidInvitationWithRelations = BidInvitation & {
  project: Project
  subcontractor: Subcontractor
  division: Division
  subdivision: Subdivision | null
}

export type BidWithRelations = Bid & {
  bidInvitation: BidInvitation
  project: Project
  subcontractor: Subcontractor
  division: Division
  subdivision: Subdivision | null
}

// Form props interfaces
export interface ProjectFormProps {
  divisions: Division[]
  subdivisions: Subdivision[]
  userId: string
  project?: ProjectWithDivisions
}

export interface SubcontractorFormProps {
  divisions: Division[]
  userId: string
  subcontractor?: SubcontractorWithDivisions
}

export interface BidInvitationFormProps {
  projects: Project[]
  subcontractors: SubcontractorWithDivisions[]
  divisions: Division[]
  subdivisions: Subdivision[]
  userId: string
  invitation?: BidInvitationWithRelations
}

// API response types
export interface ApiError {
  error: string
}

export interface ApiSuccess<T> {
  data: T
}
