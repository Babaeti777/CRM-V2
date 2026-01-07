'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'

export default function NewBidPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [invitations, setInvitations] = useState<Array<{
    id: string;
    projectId: string;
    subcontractorId: string;
    divisionId: string;
    subdivisionId: string | null;
    project: { id: string; name: string };
    subcontractor: { id: string; companyName: string };
    division: { id: string; code: string; name: string };
    subdivision: { id: string; code: string; name: string } | null;
  }>>([])
  const [selectedInvitation, setSelectedInvitation] = useState('')

  useEffect(() => {
    fetch('/api/bid-invitations-for-bids')
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          setInvitations(result.data)
        }
      })
      .catch((err) => console.error(err))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const invitation = invitations.find((i) => i.id === selectedInvitation)

    if (!invitation) {
      alert('Please select an invitation')
      setIsLoading(false)
      return
    }

    const data = {
      bidInvitationId: invitation.id,
      projectId: invitation.projectId,
      subcontractorId: invitation.subcontractorId,
      divisionId: invitation.divisionId,
      subdivisionId: invitation.subdivisionId || null,
      bidAmount: parseFloat(formData.get('bidAmount') as string),
      bidDate: new Date(formData.get('bidDate') as string),
      validUntil: formData.get('validUntil')
        ? new Date(formData.get('validUntil') as string)
        : null,
      status: formData.get('status') as string,
      notes: formData.get('notes') as string,
    }

    try {
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to save bid')
      }

      router.push('/dashboard/bid-comparison')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Failed to save bid. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const invitation = invitations.find((i) => i.id === selectedInvitation)

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Submit Bid</h1>
        <p className="text-muted-foreground">
          Record a bid submission from a subcontractor
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Bid Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invitation">
                Bid Invitation <span className="text-destructive">*</span>
              </Label>
              <select
                id="invitation"
                value={selectedInvitation}
                onChange={(e) => setSelectedInvitation(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background dark:bg-gray-900 px-3 py-1 text-sm text-foreground"
                required
              >
                <option value="">Select invitation...</option>
                {invitations.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.project.name} - {inv.subcontractor.companyName} - {inv.division.code}
                  </option>
                ))}
              </select>
            </div>

            {invitation && (
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p>
                  <strong>Project:</strong> {invitation.project.name}
                </p>
                <p>
                  <strong>Subcontractor:</strong> {invitation.subcontractor.companyName}
                </p>
                <p>
                  <strong>Division:</strong> {invitation.division.code} - {invitation.division.name}
                </p>
                {invitation.subdivision && (
                  <p>
                    <strong>Subdivision:</strong> {invitation.subdivision.code} - {invitation.subdivision.name}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="bidAmount">
                Bid Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                id="bidAmount"
                name="bidAmount"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bidDate">
                  Bid Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="bidDate"
                  name="bidDate"
                  type="date"
                  defaultValue={format(new Date(), 'yyyy-MM-dd')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input id="validUntil" name="validUntil" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-destructive">*</span>
              </Label>
              <select
                id="status"
                name="status"
                defaultValue="SUBMITTED"
                className="flex h-9 w-full rounded-md border border-input bg-background dark:bg-gray-900 px-3 py-1 text-sm text-foreground"
                required
              >
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background dark:bg-gray-900 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                placeholder="Additional notes about this bid..."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !selectedInvitation}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Bid
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
