import { cn, getProjectStatusVariant, getBidInvitationStatusVariant } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn (classnames utility)', () => {
    it('should merge class names', () => {
      const result = cn('class1', 'class2')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', false && 'conditional', 'always')
      expect(result).toContain('base')
      expect(result).toContain('always')
      expect(result).not.toContain('conditional')
    })

    it('should merge tailwind classes correctly', () => {
      // Should keep the last class when conflicting
      const result = cn('p-4', 'p-8')
      expect(result).toContain('p-8')
    })
  })

  describe('getProjectStatusVariant', () => {
    it('should return correct variant for DRAFT status', () => {
      expect(getProjectStatusVariant('DRAFT')).toBe('secondary')
    })

    it('should return correct variant for ACTIVE status', () => {
      expect(getProjectStatusVariant('ACTIVE')).toBe('default')
    })

    it('should return correct variant for CLOSED status', () => {
      expect(getProjectStatusVariant('CLOSED')).toBe('outline')
    })

    it('should return correct variant for AWARDED status', () => {
      expect(getProjectStatusVariant('AWARDED')).toBe('default')
    })

    it('should return default variant for unknown status', () => {
      expect(getProjectStatusVariant('UNKNOWN' as any)).toBe('default')
    })
  })

  describe('getBidInvitationStatusVariant', () => {
    it('should return correct variant for BID_SUBMITTED status', () => {
      expect(getBidInvitationStatusVariant('BID_SUBMITTED')).toBe('default')
    })

    it('should return correct variant for DECLINED status', () => {
      expect(getBidInvitationStatusVariant('DECLINED')).toBe('destructive')
    })

    it('should return correct variant for CONTACTED status', () => {
      expect(getBidInvitationStatusVariant('CONTACTED')).toBe('secondary')
    })

    it('should return correct variant for AWAITING_RESPONSE status', () => {
      expect(getBidInvitationStatusVariant('AWAITING_RESPONSE')).toBe('secondary')
    })

    it('should return secondary variant for unknown status', () => {
      expect(getBidInvitationStatusVariant('UNKNOWN' as any)).toBe('secondary')
    })
  })
})
