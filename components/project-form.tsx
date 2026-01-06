'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Loader2, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'

interface Division {
  id: string
  code: string
  name: string
}

interface Subdivision {
  id: string
  code: string
  name: string
  divisionId: string
  division: Division
}

interface Project {
  id: string
  name: string
  description: string | null
  location: string | null
  bidDueDate: Date
  rfiDate: Date | null
  prebidSiteVisit: boolean
  prebidSiteVisitDate: Date | null
  status: string
  projectDivisions: Array<{
    division: Division
    subdivision: Subdivision | null
  }>
}

interface ProjectDivisionWithRelations {
  division: Division
  subdivision: Subdivision | null
}

interface ProjectFormProps {
  divisions: Division[]
  subdivisions: Subdivision[]
  userId: string
  project?: Project & { projectDivisions: ProjectDivisionWithRelations[] }
}

export function ProjectForm({
  divisions,
  subdivisions,
  userId,
  project,
}: ProjectFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDivisions, setSelectedDivisions] = useState<
    Array<{ divisionId: string; subdivisionId?: string }>
  >(
    project?.projectDivisions.map((pd) => ({
      divisionId: pd.division.id,
      subdivisionId: pd.subdivision?.id,
    })) || []
  )
  const [showDivisionDropdown, setShowDivisionDropdown] = useState(false)
  const [selectedDivisionForSubdivision, setSelectedDivisionForSubdivision] =
    useState<string | null>(null)

  const isEditing = !!project

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const prebidSiteVisit = formData.get('prebidSiteVisit') === 'on'

    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      bidDueDate: new Date(formData.get('bidDueDate') as string),
      rfiDate: formData.get('rfiDate')
        ? new Date(formData.get('rfiDate') as string)
        : null,
      prebidSiteVisit,
      prebidSiteVisitDate: prebidSiteVisit && formData.get('prebidSiteVisitDate')
        ? new Date(formData.get('prebidSiteVisitDate') as string)
        : null,
      status: formData.get('status') as string,
      projectDivisions: selectedDivisions,
      userId,
    }

    try {
      const url = isEditing ? `/api/projects/${project.id}` : '/api/projects'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      let result
      try {
        const text = await response.text()
        result = text ? JSON.parse(text) : {}
      } catch (parseError) {
        console.error('Failed to parse response:', parseError)
        throw new Error('Invalid response from server')
      }

      if (!response.ok) {
        throw new Error(result.error?.message || `Server error: ${response.status}`)
      }

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to save project')
      }

      toast({
        title: 'Success',
        description: isEditing ? 'Project updated successfully' : 'Project created successfully',
      })

      router.push('/dashboard/projects')
      router.refresh()
    } catch (error) {
      console.error('Project save error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save project. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!project) return

    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      })

      let result
      try {
        const text = await response.text()
        result = text ? JSON.parse(text) : {}
      } catch (parseError) {
        console.error('Failed to parse response:', parseError)
        throw new Error('Invalid response from server')
      }

      if (!response.ok) {
        throw new Error(result.error?.message || `Server error: ${response.status}`)
      }

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete project')
      }

      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      })

      router.push('/dashboard/projects')
      router.refresh()
    } catch (error) {
      console.error('Project delete error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete project. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addDivision = (divisionId: string, subdivisionId?: string) => {
    setSelectedDivisions((prev) => [...prev, { divisionId, subdivisionId }])
    setShowDivisionDropdown(false)
    setSelectedDivisionForSubdivision(null)
  }

  const removeDivision = (index: number) => {
    setSelectedDivisions((prev) => prev.filter((_, i) => i !== index))
  }

  const getSelectedDivisionDetails = () => {
    return selectedDivisions.map((sd) => {
      const division = divisions.find((d) => d.id === sd.divisionId)
      const subdivision = sd.subdivisionId
        ? subdivisions.find((s) => s.id === sd.subdivisionId)
        : null
      return { division, subdivision }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Project Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={project?.name}
              required
              placeholder="Downtown Office Building"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={project?.description || ''}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Project description..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              defaultValue={project?.location || ''}
              placeholder="123 Main St, San Francisco, CA"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bidDueDate">
                Bid Due Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="bidDueDate"
                name="bidDueDate"
                type="date"
                defaultValue={
                  project?.bidDueDate
                    ? format(new Date(project.bidDueDate), 'yyyy-MM-dd')
                    : ''
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rfiDate">RFI Date</Label>
              <Input
                id="rfiDate"
                name="rfiDate"
                type="date"
                defaultValue={
                  project?.rfiDate
                    ? format(new Date(project.rfiDate), 'yyyy-MM-dd')
                    : ''
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                id="prebidSiteVisit"
                name="prebidSiteVisit"
                type="checkbox"
                defaultChecked={project?.prebidSiteVisit}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="prebidSiteVisit">Prebid Site Visit Required</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prebidSiteVisitDate">Prebid Site Visit Date</Label>
            <Input
              id="prebidSiteVisitDate"
              name="prebidSiteVisitDate"
              type="datetime-local"
              defaultValue={
                project?.prebidSiteVisitDate
                  ? format(new Date(project.prebidSiteVisitDate), "yyyy-MM-dd'T'HH:mm")
                  : ''
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <select
              id="status"
              name="status"
              defaultValue={project?.status || 'DRAFT'}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              required
            >
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
              <option value="AWARDED">Awarded</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>
              Divisions <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {getSelectedDivisionDetails().map((item, index) => (
                <Badge key={index} variant="secondary">
                  {item.division?.code}
                  {item.subdivision && ` - ${item.subdivision.code}`}
                  <button
                    type="button"
                    onClick={() => removeDivision(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedDivisions.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  No divisions selected
                </span>
              )}
            </div>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDivisionDropdown(!showDivisionDropdown)}
              >
                Add Division
              </Button>
              {showDivisionDropdown && (
                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md border bg-white dark:bg-gray-900 shadow-lg dark:border-gray-800">
                  {divisions.map((division) => (
                    <div key={division.id}>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedDivisionForSubdivision === division.id) {
                            setSelectedDivisionForSubdivision(null)
                          } else {
                            const divisionSubs = subdivisions.filter(
                              (s) => s.divisionId === division.id
                            )
                            if (divisionSubs.length > 0) {
                              setSelectedDivisionForSubdivision(division.id)
                            } else {
                              addDivision(division.id)
                            }
                          }
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200 font-medium"
                      >
                        {division.code} - {division.name}
                      </button>
                      {selectedDivisionForSubdivision === division.id && (
                        <div className="bg-gray-50 dark:bg-gray-800">
                          <button
                            type="button"
                            onClick={() => addDivision(division.id)}
                            className="w-full text-left px-6 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                          >
                            <em>No subdivision (general)</em>
                          </button>
                          {subdivisions
                            .filter((s) => s.divisionId === division.id)
                            .map((subdivision) => (
                              <button
                                key={subdivision.id}
                                type="button"
                                onClick={() =>
                                  addDivision(division.id, subdivision.id)
                                }
                                className="w-full text-left px-6 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                              >
                                {subdivision.code} - {subdivision.name}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || selectedDivisions.length === 0}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update' : 'Create'} Project
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
