/**
 * Application-wide constants
 * Centralized location for magic numbers, strings, and configuration values
 */

// ============================================================================
// DATE & TIME CONSTANTS
// ============================================================================

/** Number of days to show in upcoming deadlines (dashboard) */
export const DEADLINE_WARNING_DAYS = 14

/** Number of days before deadline to show urgent warning */
export const URGENT_DEADLINE_DAYS = 3

/** Default date format for display */
export const DATE_FORMAT = 'MMM dd, yyyy'

/** Date and time format */
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm'

// ============================================================================
// PAGINATION CONSTANTS
// ============================================================================

/** Default number of items per page */
export const DEFAULT_PAGE_SIZE = 25

/** Page size options for pagination dropdown */
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const

/** Maximum page size allowed */
export const MAX_PAGE_SIZE = 100

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

/** Maximum length for project names */
export const MAX_PROJECT_NAME_LENGTH = 255

/** Maximum length for company names */
export const MAX_COMPANY_NAME_LENGTH = 255

/** Maximum length for email addresses */
export const MAX_EMAIL_LENGTH = 320

/** Maximum length for phone numbers */
export const MAX_PHONE_LENGTH = 20

/** Maximum length for notes/descriptions */
export const MAX_NOTES_LENGTH = 10000

/** Maximum file size for uploads (in bytes) - 10MB */
export const MAX_FILE_SIZE = 10 * 1024 * 1024

/** Allowed file types for bid attachments */
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
] as const

// ============================================================================
// UI CONSTANTS
// ============================================================================

/** Toast notification duration (milliseconds) */
export const TOAST_DURATION = 5000

/** Toast duration for success messages */
export const TOAST_SUCCESS_DURATION = 3000

/** Toast duration for error messages */
export const TOAST_ERROR_DURATION = 7000

/** Debounce delay for search inputs (milliseconds) */
export const SEARCH_DEBOUNCE_MS = 300

/** Auto-save delay for draft forms (milliseconds) */
export const AUTO_SAVE_DELAY_MS = 2000

// ============================================================================
// PROJECT STATUS
// ============================================================================

export const PROJECT_STATUSES = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  AWARDED: 'AWARDED',
} as const

export type ProjectStatus = (typeof PROJECT_STATUSES)[keyof typeof PROJECT_STATUSES]

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  CLOSED: 'Closed',
  AWARDED: 'Awarded',
}

// ============================================================================
// BID INVITATION STATUS
// ============================================================================

export const BID_INVITATION_STATUSES = {
  INVITED: 'INVITED',
  CONTACTED: 'CONTACTED',
  AWAITING_RESPONSE: 'AWAITING_RESPONSE',
  RESPONDED: 'RESPONDED',
  DECLINED: 'DECLINED',
  BID_SUBMITTED: 'BID_SUBMITTED',
} as const

export type BidInvitationStatus =
  (typeof BID_INVITATION_STATUSES)[keyof typeof BID_INVITATION_STATUSES]

export const BID_INVITATION_STATUS_LABELS: Record<BidInvitationStatus, string> = {
  INVITED: 'Invited',
  CONTACTED: 'Contacted',
  AWAITING_RESPONSE: 'Awaiting Response',
  RESPONDED: 'Responded',
  DECLINED: 'Declined',
  BID_SUBMITTED: 'Bid Submitted',
}

// ============================================================================
// BID STATUS
// ============================================================================

export const BID_STATUSES = {
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
} as const

export type BidStatus = (typeof BID_STATUSES)[keyof typeof BID_STATUSES]

export const BID_STATUS_LABELS: Record<BidStatus, string> = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
}

// ============================================================================
// CONTACT METHODS
// ============================================================================

export const CONTACT_METHODS = {
  EMAIL: 'EMAIL',
  PHONE: 'PHONE',
  IN_PERSON: 'IN_PERSON',
  OTHER: 'OTHER',
} as const

export type ContactMethod = (typeof CONTACT_METHODS)[keyof typeof CONTACT_METHODS]

export const CONTACT_METHOD_LABELS: Record<ContactMethod, string> = {
  EMAIL: 'Email',
  PHONE: 'Phone',
  IN_PERSON: 'In Person',
  OTHER: 'Other',
}

// ============================================================================
// CACHE DURATIONS
// ============================================================================

/** Cache duration for division/subdivision data (1 hour) */
export const DIVISION_CACHE_DURATION = 60 * 60

/** Cache duration for project counts (5 minutes) */
export const PROJECT_COUNT_CACHE_DURATION = 5 * 60

/** Cache duration for dashboard stats (2 minutes) */
export const DASHBOARD_STATS_CACHE_DURATION = 2 * 60

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  // Generic
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You must be logged in to perform this action.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',

  // Validation
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  INVALID_DATE: 'Please enter a valid date.',

  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
} as const

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  PROJECT_CREATED: 'Project created successfully.',
  PROJECT_UPDATED: 'Project updated successfully.',
  PROJECT_DELETED: 'Project deleted successfully.',

  SUBCONTRACTOR_CREATED: 'Subcontractor created successfully.',
  SUBCONTRACTOR_UPDATED: 'Subcontractor updated successfully.',
  SUBCONTRACTOR_DELETED: 'Subcontractor deleted successfully.',

  BID_INVITATION_CREATED: 'Bid invitation created successfully.',
  BID_INVITATION_UPDATED: 'Bid invitation updated successfully.',
  BID_INVITATION_DELETED: 'Bid invitation deleted successfully.',

  BID_CREATED: 'Bid created successfully.',
  BID_UPDATED: 'Bid updated successfully.',
  BID_DELETED: 'Bid deleted successfully.',

  SAVED: 'Changes saved successfully.',
} as const

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  // Projects
  PROJECTS: '/api/projects',
  PROJECT_BY_ID: (id: string) => `/api/projects/${id}`,

  // Subcontractors
  SUBCONTRACTORS: '/api/subcontractors',
  SUBCONTRACTOR_BY_ID: (id: string) => `/api/subcontractors/${id}`,

  // Bid Invitations
  BID_INVITATIONS: '/api/bid-invitations',
  BID_INVITATION_BY_ID: (id: string) => `/api/bid-invitations/${id}`,

  // Bids
  BIDS: '/api/bids',
  BID_BY_ID: (id: string) => `/api/bids/${id}`,

  // Divisions
  DIVISIONS: '/api/divisions',
  SUBDIVISIONS: '/api/subdivisions',

  // Health
  HEALTH: '/api/health',
} as const

// ============================================================================
// ROUTES
// ============================================================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROJECTS: '/dashboard/projects',
  SUBCONTRACTORS: '/dashboard/subcontractors',
  BID_TRACKING: '/dashboard/bid-tracking',
  BID_COMPARISON: '/dashboard/bid-comparison',
} as const
