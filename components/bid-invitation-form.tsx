'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import type { BidInvitationFormProps } from '@/lib/types'

export function BidInvitationForm({
  projects,
  subcontractors,
  divisions,
  subdivisions,
  userId,
  invitation,
}: BidInvitationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState(invitation?.projectId || '')
  const [selectedDivision, setSelectedDivision] = useState(invitation?.divisionId || '')

  const isEditing = !!invitation

  const filteredSubcontractors = selectedDivision
    ? subcontractors.filter((s) =>
        s.subcontractorDivisions.some((sd: { divisionId: string }) => sd.divisionId === selectedDivision)
      )
    : subcontractors

  const filteredSubdivisions = selectedDivision
    ? subdivisions.filter((s: { divisionId: string }) => s.divisionId === selectedDivision)
    : []

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    const data = {
      projectId: formData.get('projectId') as string,
      subcontractorId: formData.get('subcontractorId') as string,
      divisionId: formData.get('divisionId') as string,
      subdivisionId: formData.get('subdivisionId') as string || null,
      firstContactDate: formData.get('firstContactDate')
        ? new Date(formData.get('firstContactDate') as string)
        : null,
      contactMethod: formData.get('contactMethod') as string || null,
      responseReceived: formData.get('responseReceived') === 'on',
      responseDate: formData.get('responseDate')
        ? new Date(formData.get('responseDate') as string)
        : null,
      documentsSent: formData.get('documentsSent') === 'on',
      documentsSentDate: formData.get('documentsSentDate')
        ? new Date(formData.get('documentsSentDate') as string)
        : null,
      documentsDelivered: formData.get('documentsDelivered') === 'on',
      documentsDeliveredDate: formData.get('documentsDeliveredDate')
        ? new Date(formData.get('documentsDeliveredDate') as string)
        : null,
      documentsRead: formData.get('documentsRead') === 'on',
      documentsReadDate: formData.get('documentsReadDate')
        ? new Date(formData.get('documentsReadDate') as string)
        : null,
      followUpDate: formData.get('followUpDate')
        ? new Date(formData.get('followUpDate') as string)
        : null,
      status: formData.get('status') as string,
      notes: formData.get('notes') as string,
    }

    try {
      const url = isEditing
        ? `/api/bid-invitations/${invitation.id}`
        : '/api/bid-invitations'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save bid invitation')
      }

      router.push('/dashboard/bid-tracking')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Failed to save bid invitation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!invitation) return

    if (!confirm('Are you sure you want to delete this invitation?')) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/bid-invitations/${invitation.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete invitation')
      }

      router.push('/dashboard/bid-tracking')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Failed to delete invitation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Bid Invitation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="projectId">
                Project <span className="text-destructive">*</span>
              </Label>
              <select
                id="projectId"
                name="projectId"
                defaultValue={invitation?.projectId}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                required
              >
                <option value="">Select project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="divisionId">
                Division <span className="text-destructive">*</span>
              </Label>
              <select
                id="divisionId"
                name="divisionId"
                defaultValue={invitation?.divisionId}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                required
              >
                <option value="">Select division...</option>
                {divisions.map((division) => (
                  <option key={division.id} value={division.id}>
                    {division.code} - {division.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subdivisionId">Subdivision (Optional)</Label>
              <select
                id="subdivisionId"
                name="subdivisionId"
                defaultValue={invitation?.subdivisionId || ''}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="">None</option>
                {filteredSubdivisions.map((subdivision) => (
                  <option key={subdivision.id} value={subdivision.id}>
                    {subdivision.code} - {subdivision.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcontractorId">
                Subcontractor <span className="text-destructive">*</span>
              </Label>
              <select
                id="subcontractorId"
                name="subcontractorId"
                defaultValue={invitation?.subcontractorId}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                required
              >
                <option value="">Select subcontractor...</option>
                {filteredSubcontractors.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.companyName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstContactDate">First Contact Date</Label>
              <Input
                id="firstContactDate"
                name="firstContactDate"
                type="date"
                defaultValue={
                  invitation?.firstContactDate
                    ? format(new Date(invitation.firstContactDate), 'yyyy-MM-dd')
                    : ''
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactMethod">Contact Method</Label>
              <select
                id="contactMethod"
                name="contactMethod"
                defaultValue={invitation?.contactMethod || ''}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="">Select method...</option>
                <option value="EMAIL">Email</option>
                <option value="PHONE">Phone</option>
                <option value="IN_PERSON">In Person</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                id="documentsSent"
                name="documentsSent"
                type="checkbox"
                defaultChecked={invitation?.documentsSent}
                className="h-4 w-4 rounded border border-input bg-background"
              />
              <Label htmlFor="documentsSent">Documents Sent</Label>
            </div>

            <div className="space-y-2 ml-6">
              <Label htmlFor="documentsSentDate" className="text-sm text-muted-foreground">
                Sent Date
              </Label>
              <Input
                id="documentsSentDate"
                name="documentsSentDate"
                type="date"
                defaultValue={
                  invitation?.documentsSentDate
                    ? format(new Date(invitation.documentsSentDate), 'yyyy-MM-dd')
                    : ''
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                id="documentsDelivered"
                name="documentsDelivered"
                type="checkbox"
                defaultChecked={invitation?.documentsDelivered}
                className="h-4 w-4 rounded border border-input bg-background"
              />
              <Label htmlFor="documentsDelivered">Documents Delivered</Label>
            </div>

            <div className="space-y-2 ml-6">
              <Label htmlFor="documentsDeliveredDate" className="text-sm text-muted-foreground">
                Delivered Date
              </Label>
              <Input
                id="documentsDeliveredDate"
                name="documentsDeliveredDate"
                type="date"
                defaultValue={
                  invitation?.documentsDeliveredDate
                    ? format(new Date(invitation.documentsDeliveredDate), 'yyyy-MM-dd')
                    : ''
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                id="documentsRead"
                name="documentsRead"
                type="checkbox"
                defaultChecked={invitation?.documentsRead}
                className="h-4 w-4 rounded border border-input bg-background"
              />
              <Label htmlFor="documentsRead">Documents Read</Label>
            </div>

            <div className="space-y-2 ml-6">
              <Label htmlFor="documentsReadDate" className="text-sm text-muted-foreground">
                Read Date
              </Label>
              <Input
                id="documentsReadDate"
                name="documentsReadDate"
                type="date"
                defaultValue={
                  invitation?.documentsReadDate
                    ? format(new Date(invitation.documentsReadDate), 'yyyy-MM-dd')
                    : ''
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                id="responseReceived"
                name="responseReceived"
                type="checkbox"
                defaultChecked={invitation?.responseReceived}
                className="h-4 w-4 rounded border border-input bg-background"
              />
              <Label htmlFor="responseReceived">Response Received</Label>
            </div>

            <div className="space-y-2 ml-6">
              <Label htmlFor="responseDate" className="text-sm text-muted-foreground">
                Response Date
              </Label>
              <Input
                id="responseDate"
                name="responseDate"
                type="date"
                defaultValue={
                  invitation?.responseDate
                    ? format(new Date(invitation.responseDate), 'yyyy-MM-dd')
                    : ''
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="followUpDate">Follow-up Date</Label>
            <Input
              id="followUpDate"
              name="followUpDate"
              type="date"
              defaultValue={
                invitation?.followUpDate
                  ? format(new Date(invitation.followUpDate), 'yyyy-MM-dd')
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
              defaultValue={invitation?.status || 'INVITED'}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              required
            >
              <option value="INVITED">Invited</option>
              <option value="CONTACTED">Contacted</option>
              <option value="AWAITING_RESPONSE">Awaiting Response</option>
              <option value="RESPONDED">Responded</option>
              <option value="DECLINED">Declined</option>
              <option value="BID_SUBMITTED">Bid Submitted</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              defaultValue={invitation?.notes || ''}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              placeholder="Additional notes..."
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
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update' : 'Create'} Invitation
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
