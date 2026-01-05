import {
  createProjectSchema,
  createSubcontractorSchema,
  createBidInvitationSchema,
  createBidSchema,
} from '@/lib/validations'

describe('Validation Schemas', () => {
  describe('createProjectSchema', () => {
    it('should validate a valid project', () => {
      const validProject = {
        name: 'Test Project',
        description: 'A test project',
        location: 'New York',
        bidDueDate: '2026-12-31',
        rfiDate: '2026-11-30',
        prebidSiteVisit: false,
        status: 'DRAFT',
        projectDivisions: [{ divisionId: 'div-1' }],
        userId: 'user-123',
      }

      const result = createProjectSchema.safeParse(validProject)
      expect(result.success).toBe(true)
    })

    it('should reject project without name', () => {
      const invalidProject = {
        bidDueDate: '2026-12-31',
        projectDivisions: [{ divisionId: 'div-1' }],
        userId: 'user-123',
      }

      const result = createProjectSchema.safeParse(invalidProject)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Project name is required')
      }
    })

    it('should reject project without divisions', () => {
      const invalidProject = {
        name: 'Test Project',
        bidDueDate: '2026-12-31',
        projectDivisions: [],
        userId: 'user-123',
      }

      const result = createProjectSchema.safeParse(invalidProject)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('At least one division is required')
      }
    })

    it('should accept valid project status', () => {
      const statuses = ['DRAFT', 'ACTIVE', 'CLOSED', 'AWARDED']
      statuses.forEach((status) => {
        const project = {
          name: 'Test',
          bidDueDate: '2026-12-31',
          status,
          projectDivisions: [{ divisionId: 'div-1' }],
          userId: 'user-123',
        }
        const result = createProjectSchema.safeParse(project)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('createSubcontractorSchema', () => {
    it('should validate a valid subcontractor', () => {
      const validSubcontractor = {
        companyName: 'ABC Construction',
        contactPersonName: 'John Doe',
        email: 'john@abc.com',
        phone: '555-1234',
        divisionIds: ['div-1', 'div-2'],
        userId: 'user-123',
      }

      const result = createSubcontractorSchema.safeParse(validSubcontractor)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalid = {
        companyName: 'ABC Construction',
        email: 'not-an-email',
        divisionIds: ['div-1'],
        userId: 'user-123',
      }

      const result = createSubcontractorSchema.safeParse(invalid)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Invalid email')
      }
    })

    it('should accept empty string as email', () => {
      const valid = {
        companyName: 'ABC Construction',
        email: '',
        divisionIds: ['div-1'],
        userId: 'user-123',
      }

      const result = createSubcontractorSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('should reject subcontractor without divisions', () => {
      const invalid = {
        companyName: 'ABC Construction',
        divisionIds: [],
        userId: 'user-123',
      }

      const result = createSubcontractorSchema.safeParse(invalid)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('At least one division is required')
      }
    })
  })

  describe('createBidInvitationSchema', () => {
    it('should validate a valid bid invitation', () => {
      const validInvitation = {
        projectId: 'proj-1',
        subcontractorId: 'sub-1',
        divisionId: 'div-1',
        status: 'INVITED',
      }

      const result = createBidInvitationSchema.safeParse(validInvitation)
      expect(result.success).toBe(true)
    })

    it('should accept valid contact methods', () => {
      const methods = ['EMAIL', 'PHONE', 'IN_PERSON', 'OTHER']
      methods.forEach((method) => {
        const invitation = {
          projectId: 'proj-1',
          subcontractorId: 'sub-1',
          divisionId: 'div-1',
          contactMethod: method,
        }
        const result = createBidInvitationSchema.safeParse(invitation)
        expect(result.success).toBe(true)
      })
    })

    it('should accept valid bid invitation statuses', () => {
      const statuses = [
        'INVITED',
        'CONTACTED',
        'AWAITING_RESPONSE',
        'RESPONDED',
        'DECLINED',
        'BID_SUBMITTED',
      ]
      statuses.forEach((status) => {
        const invitation = {
          projectId: 'proj-1',
          subcontractorId: 'sub-1',
          divisionId: 'div-1',
          status,
        }
        const result = createBidInvitationSchema.safeParse(invitation)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('createBidSchema', () => {
    it('should validate a valid bid', () => {
      const validBid = {
        bidInvitationId: 'inv-1',
        bidAmount: 50000,
        validUntil: '2026-12-31',
        notes: 'Some notes',
      }

      const result = createBidSchema.safeParse(validBid)
      expect(result.success).toBe(true)
    })

    it('should reject negative bid amount', () => {
      const invalid = {
        bidInvitationId: 'inv-1',
        bidAmount: -1000,
      }

      const result = createBidSchema.safeParse(invalid)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Bid amount must be positive')
      }
    })

    it('should reject zero bid amount', () => {
      const invalid = {
        bidInvitationId: 'inv-1',
        bidAmount: 0,
      }

      const result = createBidSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })
})
