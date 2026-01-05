/**
 * Environment variable validation
 * Validates required environment variables at build/startup time
 */

import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),

  // Authentication
  AUTH_SECRET: z
    .string()
    .min(32, 'AUTH_SECRET must be at least 32 characters for security'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL').optional(),
  NEXTAUTH_SECRET: z.string().optional(), // Legacy, optional

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>

// Validate and parse environment variables
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => `  - ${e.path.join('.')}: ${e.message}`)
      console.error('❌ Invalid environment variables:\n' + missingVars.join('\n'))
      throw new Error('Environment validation failed')
    }
    throw error
  }
}

// Export validated environment variables
export const env = validateEnv()

// Helper function to check if we're in production
export const isProduction = env.NODE_ENV === 'production'

// Helper function to check if we're in development
export const isDevelopment = env.NODE_ENV === 'development'

// Helper function to check if we're in test mode
export const isTest = env.NODE_ENV === 'test'
