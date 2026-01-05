/**
 * Authorization utilities for resource ownership verification
 */

import { prisma } from './prisma'
import { ApiResponses } from './api-utils'
import { NextResponse } from 'next/server'

/**
 * Verify that a user owns a specific project
 */
export async function authorizeProject(
  projectId: string,
  userId: string
): Promise<true | NextResponse> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { userId: true },
  })

  if (!project) {
    return ApiResponses.notFound('Project')
  }

  if (project.userId !== userId) {
    return ApiResponses.forbidden('You do not have access to this project')
  }

  return true
}

/**
 * Verify that a user owns a specific subcontractor
 */
export async function authorizeSubcontractor(
  subcontractorId: string,
  userId: string
): Promise<true | NextResponse> {
  const subcontractor = await prisma.subcontractor.findUnique({
    where: { id: subcontractorId },
    select: { userId: true },
  })

  if (!subcontractor) {
    return ApiResponses.notFound('Subcontractor')
  }

  if (subcontractor.userId !== userId) {
    return ApiResponses.forbidden('You do not have access to this subcontractor')
  }

  return true
}

/**
 * Verify that a user owns a bid invitation (through the project)
 */
export async function authorizeBidInvitation(
  bidInvitationId: string,
  userId: string
): Promise<true | NextResponse> {
  const bidInvitation = await prisma.bidInvitation.findUnique({
    where: { id: bidInvitationId },
    select: {
      project: {
        select: { userId: true },
      },
    },
  })

  if (!bidInvitation) {
    return ApiResponses.notFound('Bid Invitation')
  }

  if (bidInvitation.project.userId !== userId) {
    return ApiResponses.forbidden('You do not have access to this bid invitation')
  }

  return true
}

/**
 * Verify that a user owns a bid (through the project)
 */
export async function authorizeBid(
  bidId: string,
  userId: string
): Promise<true | NextResponse> {
  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    select: {
      project: {
        select: { userId: true },
      },
    },
  })

  if (!bid) {
    return ApiResponses.notFound('Bid')
  }

  if (bid.project.userId !== userId) {
    return ApiResponses.forbidden('You do not have access to this bid')
  }

  return true
}

/**
 * Verify that resources belong to the user before allowing operations
 * Useful for batch operations
 */
export async function authorizeProjects(
  projectIds: string[],
  userId: string
): Promise<true | NextResponse> {
  const count = await prisma.project.count({
    where: {
      id: { in: projectIds },
      userId,
    },
  })

  if (count !== projectIds.length) {
    return ApiResponses.forbidden('You do not have access to one or more projects')
  }

  return true
}
