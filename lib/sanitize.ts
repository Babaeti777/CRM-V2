/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes all HTML tags and potentially dangerous content
 * Uses a serverless-compatible approach (no jsdom dependency)
 */
export function sanitizeHTML(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return ''

  return dirty
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove style tags and their content
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove all HTML tags but keep content
    .replace(/<[^>]*>/g, '')
    // Decode common HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Remove null bytes
    .replace(/\0/g, '')
    .trim()
}

/**
 * Sanitize rich text content (preserves safe HTML tags)
 * Uses a serverless-compatible allowlist approach
 */
export function sanitizeRichText(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return ''

  const allowedTags = ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li']
  const allowedAttrs = ['href', 'target', 'rel']

  // Remove script and style tags completely
  let clean = dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

  // Remove event handlers (onclick, onerror, etc.)
  clean = clean.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  clean = clean.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')

  // Remove javascript: and data: URLs
  clean = clean.replace(/href\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, '')
  clean = clean.replace(/href\s*=\s*["']?\s*data:[^"'>\s]*/gi, '')

  // Remove tags not in allowlist (but keep their content)
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
  clean = clean.replace(tagPattern, (match, tagName) => {
    const lowerTag = tagName.toLowerCase()
    if (allowedTags.includes(lowerTag)) {
      // For allowed tags, strip attributes not in allowlist
      if (match.startsWith('</')) {
        return `</${lowerTag}>`
      }
      // Extract allowed attributes
      const attrMatches: string[] = []
      for (const attr of allowedAttrs) {
        const attrPattern = new RegExp(`${attr}\\s*=\\s*["']([^"']*)["']`, 'i')
        const attrMatch = match.match(attrPattern)
        if (attrMatch) {
          attrMatches.push(`${attr}="${attrMatch[1]}"`)
        }
      }
      const attrs = attrMatches.length > 0 ? ' ' + attrMatches.join(' ') : ''
      return `<${lowerTag}${attrs}>`
    }
    return '' // Remove non-allowed tags
  })

  return clean.replace(/\0/g, '').trim()
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
