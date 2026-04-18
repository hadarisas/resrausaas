'use client'
import { useFormState } from 'react-dom'
import { updateReservationAction } from '@/lib/actions/reservations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Reservation, ReservationStatus } from '@/types/reservation'
import type { ActionResult } from '@/types/actions'
import { useState } from 'react'

const initialState: ActionResult = { success: false, error: '' }

const STATUS_OPTIONS: ReservationStatus[] = [
  'pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show',
]

interface Props {
  reservation: Reservation
  onClose: () => void
}

export default function ReservationEditDialog({ reservation: r, onClose }: Props) {
  const [state, action, isPending] = useFormState(updateReservationAction, initialState)
  const [status, setStatus] = useState<ReservationStatus>(r.status)

  if ('success' in state && state.success) onClose()

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={r.id} />
      <input type="hidden" name="status" value={status} />

      {'error' in state && state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="edit-name">Guest name</Label>
          <Input id="edit-name" name="guestName" defaultValue={r.guest_name} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit-email">Email</Label>
          <Input id="edit-email" name="guestEmail" type="email" defaultValue={r.guest_email} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit-phone">Phone</Label>
          <Input id="edit-phone" name="guestPhone" defaultValue={r.guest_phone ?? ''} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit-date">Date</Label>
          <Input id="edit-date" name="reservationDate" type="date" defaultValue={r.reservation_date} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit-time">Time</Label>
          <Input id="edit-time" name="reservationTime" type="time" defaultValue={r.reservation_time.slice(0, 5)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit-party">Party size</Label>
          <Input id="edit-party" name="partySize" type="number" min={1} defaultValue={r.party_size} required />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as ReservationStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="edit-notes">Guest notes</Label>
          <Textarea id="edit-notes" name="notes" defaultValue={r.notes ?? ''} rows={2} />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="edit-internal">Internal notes</Label>
          <Textarea id="edit-internal" name="internalNotes" defaultValue={r.internal_notes ?? ''} rows={2} placeholder="Visible to staff only" />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? 'Saving…' : 'Save'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
