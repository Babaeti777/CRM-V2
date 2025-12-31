import { signIn } from '@/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getGoogleAuthEnv } from '@/lib/env'

const errorMessages: Record<string, string> = {
  OAuthSignin: 'Error starting Google sign in. Please try again.',
  OAuthCallback: 'Error during Google sign in callback. Please try again.',
  OAuthCreateAccount: 'Could not create account. Please try again.',
  OAuthAccountNotLinked: 'This email is already linked to another account.',
  Callback: 'Authentication callback error. Please try again.',
  Default: 'An error occurred during sign in. Please try again.',
  AccessDenied: 'Access denied. You may not have permission to sign in.',
  Configuration:
    'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and AUTH_SECRET (or NEXTAUTH_SECRET) environment variables.',
  Verification: 'Verification link expired or already used.',
  MissingCSRF: 'Session expired. Please try again.',
  SessionRequired: 'Please sign in to continue.',
}

const authEnv = getGoogleAuthEnv()

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; callbackUrl?: string }>
}) {
  const params = searchParams ? await searchParams : undefined
  const error = params?.error
  const errorMessage = error ? (errorMessages[error] || errorMessages.Default) : null

  // Show configuration warning if OAuth is not set up
  const showConfigWarning = !authEnv.isConfigured && !error
  const missingPieces = authEnv.missingVariables
  const isAuthReady = authEnv.isConfigured

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">
            Construction Bid Management
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to manage your construction projects and bids
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}
          {showConfigWarning && (
            <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4">
              <p className="text-sm text-yellow-800 font-medium">Setup Required</p>
              <p className="text-sm text-yellow-700 mt-1">
                Google OAuth is not configured. Please add the following environment variables:
              </p>
              <ul className="text-xs text-yellow-600 mt-2 space-y-1 font-mono">
                {missingPieces.map((piece) => (
                  <li key={piece}>{piece}</li>
                ))}
              </ul>
            </div>
          )}
          <form
            action={async () => {
              'use server'
              await signIn('google', { redirectTo: '/dashboard' })
            }}
          >
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!isAuthReady}
            >
              <svg
                className="mr-2 h-5 w-5"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Sign in with Google
            </Button>
          </form>
          <div className="text-sm text-muted-foreground text-center">
            Secure authentication powered by Google
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
