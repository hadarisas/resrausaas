'use client'
import { useFormState } from 'react-dom'
import { createPublicReservationAction } from '@/lib/actions/reservations'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { ActionResult } from '@/types/actions'

const initialState: ActionResult = { success: false, error: '' }

interface PublicReservationFormProps {
  restaurantId: string
  maxPartySize: number
  className?: string
  buttonClassName?: string
}

export default function PublicReservationForm({
  restaurantId,
  maxPartySize,
  className = '',
  buttonClassName = '',
}: PublicReservationFormProps) {
  const [state, action, isPending] = useFormState(createPublicReservationAction, initialState)

  const today = new Date().toISOString().split('T')[0]

  if ('success' in state && state.success) {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center text-green-800">
        <p className="text-lg font-semibold">🎉 Reservation submitted!</p>
        <p className="mt-1 text-sm">We&apos;ll confirm your booking shortly via email.</p>
      </div>
    )
  }

  return (
    <form action={action} className={`space-y-4 ${className}`}>
      <input type="hidden" name="restaurantId" value={restaurantId} />

      {'error' in state && state.error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="pub-name">Full name *</Label>
          <Input id="pub-name" name="guestName" placeholder="Jane Smith" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pub-email">Email *</Label>
          <Input id="pub-email" name="guestEmail" type="email" placeholder="jane@example.com" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pub-phone">Phone</Label>
          <Input id="pub-phone" name="guestPhone" type="tel" placeholder="+1 (555) 000-0000" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pub-date">Date *</Label>
          <Input id="pub-date" name="reservationDate" type="date" min={today} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pub-time">Time *</Label>
          <Input id="pub-time" name="reservationTime" type="time" required />
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="pub-party">Party size *</Label>
          <Input
            id="pub-party"
            name="partySize"
            type="number"
            min={1}
            max={maxPartySize}
            placeholder={`Up to ${maxPartySize} guests`}
            required
          />
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="pub-notes">Special requests</Label>
          <Textarea id="pub-notes" name="notes" rows={2} placeholder="Dietary restrictions, special occasions…" />
        </div>
      </div>

      <Button
        type="submit"
        className={`w-full ${buttonClassName}`}
        disabled={isPending}
      >
        {isPending ? 'Submitting…' : 'Request reservation'}
      </Button>
    </form>
  )
}
