import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function ProjectsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
      </div>

      <Card>
        <CardHeader>
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4">
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-48 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-64 bg-muted animate-pulse rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
