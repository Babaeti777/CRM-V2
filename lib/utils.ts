import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { BadgeVariant, ProjectStatus, BidInvitationStatus } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Centralized status helper functions

export function getProjectStatusVariant(status: ProjectStatus): BadgeVariant {
  switch (status) {
    case 'DRAFT':
      return 'secondary'
    case 'ACTIVE':
      return 'default'
    case 'CLOSED':
      return 'outline'
    case 'AWARDED':
      return 'default'
    default:
      return 'secondary'
  }
}

export function getBidInvitationStatusVariant(status: BidInvitationStatus): BadgeVariant {
  switch (status) {
    case 'BID_SUBMITTED':
      return 'default'
    case 'DECLINED':
      return 'destructive'
    case 'AWAITING_RESPONSE':
      return 'secondary'
    case 'INVITED':
    case 'CONTACTED':
    case 'RESPONDED':
    default:
      return 'outline'
  }
}

export function formatStatus(status: string): string {
  return status.replace(/_/g, ' ')
}
