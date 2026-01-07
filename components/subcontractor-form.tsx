'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Loader2, Trash2 } from 'lucide-react'

interface Division {
  id: string
  code: string
  name: string
}

interface Subcontractor {
  id: string
  companyName: string
  contactPersonName: string | null
  email: string | null
  phone: string | null
  officeAddress: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  notes: string | null
  subcontractorDivisions: Array<{
    division: Division
  }>
}

interface SubcontractorFormProps {
  divisions: Division[]
  userId: string
  subcontractor?: Subcontractor
}

export function SubcontractorForm({
  divisions,
  userId,
  subcontractor,
}: SubcontractorFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>(
    subcontractor?.subcontractorDivisions.map((sd) => sd.division.id) || []
  )
  const [showDivisionDropdown, setShowDivisionDropdown] = useState(false)

  const isEditing = !!subcontractor

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      companyName: formData.get('companyName') as string,
      contactPersonName: formData.get('contactPersonName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      officeAddress: formData.get('officeAddress') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zipCode: formData.get('zipCode') as string,
      notes: formData.get('notes') as string,
      divisionIds: selectedDivisions,
      userId,
    }

    try {
      const url = isEditing
        ? `/api/subcontractors/${subcontractor.id}`
        : '/api/subcontractors'

      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save subcontractor')
      }

      router.push('/dashboard/subcontractors')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Failed to save subcontractor. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!subcontractor) return

    if (!confirm('Are you sure you want to delete this subcontractor?')) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/subcontractors/${subcontractor.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete subcontractor')
      }

      router.push('/dashboard/subcontractors')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Failed to delete subcontractor. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDivision = (divisionId: string) => {
    setSelectedDivisions((prev) =>
      prev.includes(divisionId)
        ? prev.filter((id) => id !== divisionId)
        : [...prev, divisionId]
    )
  }

  const getSelectedDivisionNames = () => {
    return divisions
      .filter((d) => selectedDivisions.includes(d.id))
      .map((d) => ({ id: d.id, code: d.code, name: d.name }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Subcontractor Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">
              Company Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="companyName"
              name="companyName"
              defaultValue={subcontractor?.companyName}
              required
              placeholder="ABC Construction Inc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPersonName">Contact Person</Label>
            <Input
              id="contactPersonName"
              name="contactPersonName"
              defaultValue={subcontractor?.contactPersonName || ''}
              placeholder="John Smith"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={subcontractor?.email || ''}
                placeholder="john@abcconstruction.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={subcontractor?.phone || ''}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="officeAddress">Office Address</Label>
            <Input
              id="officeAddress"
              name="officeAddress"
              defaultValue={subcontractor?.officeAddress || ''}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                defaultValue={subcontractor?.city || ''}
                placeholder="San Francisco"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                defaultValue={subcontractor?.state || ''}
                placeholder="CA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                defaultValue={subcontractor?.zipCode || ''}
                placeholder="94102"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Divisions <span className="text-destructive">*</span></Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {getSelectedDivisionNames().map((division) => (
                <Badge key={division.id} variant="secondary">
                  {division.code} - {division.name}
                  <button
                    type="button"
                    onClick={() => toggleDivision(division.id)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedDivisions.length === 0 && (
                <span className="text-sm text-muted-foreground">No divisions selected</span>
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
                    <button
                      key={division.id}
                      type="button"
                      onClick={() => {
                        toggleDivision(division.id)
                        setShowDivisionDropdown(false)
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200 ${
                        selectedDivisions.includes(division.id)
                          ? 'bg-gray-50 dark:bg-gray-800 text-muted-foreground'
                          : ''
                      }`}
                    >
                      <div className="font-medium">
                        {division.code} - {division.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              defaultValue={subcontractor?.notes || ''}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background dark:bg-gray-900 px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Additional notes about this subcontractor..."
            />
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
            <Button type="submit" disabled={isLoading || selectedDivisions.length === 0}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update' : 'Create'} Subcontractor
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
