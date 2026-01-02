'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Project {
  id: string
  name: string
}

interface Division {
  id: string
  code: string
  name: string
}

interface BidComparisonFiltersProps {
  projects: Project[]
  divisions: Division[]
}

export function BidComparisonFilters({ projects, divisions }: BidComparisonFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentProject = searchParams.get('project') || ''
  const currentDivision = searchParams.get('division') || ''

  const handleProjectChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('project', value)
    } else {
      params.delete('project')
    }
    router.push(`/dashboard/bid-comparison?${params.toString()}`)
  }

  const handleDivisionChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('division', value)
    } else {
      params.delete('division')
    }
    router.push(`/dashboard/bid-comparison?${params.toString()}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <div>
          <select
            className="flex h-9 w-[200px] rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm"
            value={currentProject}
            onChange={(e) => handleProjectChange(e.target.value)}
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            className="flex h-9 w-[200px] rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm"
            value={currentDivision}
            onChange={(e) => handleDivisionChange(e.target.value)}
          >
            <option value="">All Divisions</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.code} - {division.name}
              </option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  )
}
