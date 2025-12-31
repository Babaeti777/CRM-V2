const requiredEnvVars = {
  googleClientId: 'GOOGLE_CLIENT_ID',
  googleClientSecret: 'GOOGLE_CLIENT_SECRET',
  authSecret: 'AUTH_SECRET',
}

function getEnvValue(key: string) {
  const value = process.env[key]
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined
}

export function getGoogleAuthEnv() {
  const googleClientId = getEnvValue(requiredEnvVars.googleClientId)
  const googleClientSecret = getEnvValue(requiredEnvVars.googleClientSecret)
  const authSecret =
    getEnvValue(requiredEnvVars.authSecret) || getEnvValue('NEXTAUTH_SECRET')

  const missingVariables = [
    [requiredEnvVars.googleClientId, googleClientId],
    [requiredEnvVars.googleClientSecret, googleClientSecret],
    [requiredEnvVars.authSecret, authSecret],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key)

  const isConfigured = missingVariables.length === 0

  return {
    googleClientId,
    googleClientSecret,
    authSecret,
    isConfigured,
    missingVariables,
  }
}

export function assertGoogleAuthEnv() {
  const env = getGoogleAuthEnv()
  if (!env.isConfigured) {
    const missingList = env.missingVariables.join(', ')
    throw new Error(
      `Google OAuth is not configured. Missing environment variables: ${missingList}`
    )
  }
  return env
}
