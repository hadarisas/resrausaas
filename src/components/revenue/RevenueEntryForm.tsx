'use client'
import { useFormState } from 'react-dom'
import { useDashboardAccess } from '@/components/dashboard/DashboardAccessContext'
import { createRevenueEntryAction } from '@/lib/actions/revenue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ActionResult } from '@/types/actions'

const initialState: ActionResult = { success: false, error: '' }

export default function RevenueEntryForm() {
  const { isReadOnly } = useDashboardAccess()
  const [state, action, isPending] = useFormState(createRevenueEntryAction, initialState)

  const today = new Date().toISOString().split('T')[0]

  return (
    <form action={action} className="space-y-4">
      <fieldset disabled={isReadOnly} className="min-w-0 space-y-4 border-0 p-0">
      {'error' in state && state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {'message' in state && state.message && (
        <p className="text-sm text-green-700">{state.message}</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="entry-date">Date</Label>
          <Input id="entry-date" name="entryDate" type="date" defaultValue={today} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="entry-amount">Amount ($)</Label>
          <Input
            id="entry-amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="entry-category">Category</Label>
          <Input id="entry-category" name="category" defaultValue="general" placeholder="general" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="entry-notes">Notes</Label>
        <Textarea id="entry-notes" name="notes" rows={2} placeholder="Optional notes…" />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving…' : 'Save entry'}
      </Button>
      </fieldset>
    </form>
  )
}
