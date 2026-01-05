'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle>Oops! Something went wrong</CardTitle>
          </div>
          <CardDescription>
            We encountered an error while loading this page. This could be a temporary issue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20">
            <p className="text-sm font-mono text-destructive break-all">
              {error.message || 'An unexpected error occurred'}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">What you can try:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Click &ldquo;Try again&rdquo; to reload the page</li>
              <li>Go back to the dashboard home</li>
              <li>If the error persists, contact support</li>
            </ul>
          </div>
          {error.digest && (
            <p className="text-xs text-muted-foreground">
              Reference ID: <code className="font-mono">{error.digest}</code>
            </p>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={reset} className="flex-1 gap-2">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
