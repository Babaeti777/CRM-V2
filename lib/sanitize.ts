import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes all HTML tags and potentially dangerous content
 */
export function sanitizeHTML(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return ''

  // Strip all HTML tags for plain text fields
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  }).trim()
}

/**
 * Sanitize rich text content (preserves safe HTML tags)
 * Allows basic formatting while removing dangerous elements
 */
export function sanitizeRichText(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return ''

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  }).trim()
}

/**
 * Sanitize user input by trimming whitespace and removing null bytes
 */
export function sanitizeInput(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') return ''

  return input
    .replace(/\0/g, '') // Remove null bytes
    .trim()
}

/**
 * Sanitize email addresses
 */
export function sanitizeEmail(email: string | null | undefined): string {
  if (!email || typeof email !== 'string') return ''

  return email
    .toLowerCase()
    .trim()
    .replace(/\s/g, '') // Remove all whitespace
    .replace(/\0/g, '') // Remove null bytes
}

/**
 * Sanitize phone numbers (keep only digits, spaces, hyphens, parentheses, plus)
 */
export function sanitizePhone(phone: string | null | undefined): string {
  if (!phone || typeof phone !== 'string') return ''

  return phone
    .replace(/[^\d\s\-()+ ]/g, '') // Keep only valid phone characters
    .trim()
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null

  const num = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value
  return isNaN(num) ? null : num
}
