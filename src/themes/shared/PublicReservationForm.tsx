'use client'
import { useFormState } from 'react-dom'
import { CheckCircle2 } from 'lucide-react'
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
      <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50 to-white p-8 text-center shadow-sm ring-1 ring-emerald-100/60">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" strokeWidth={1.75} aria-hidden />
        <p className="mt-4 text-lg font-semibold text-emerald-900">Reservation submitted</p>
        <p className="mt-2 text-sm text-emerald-800/90">We&apos;ll confirm your booking shortly via email.</p>
      </div>
    )
  }

  return (
    <form action={action} className={`space-y-4 ${className}`}>
      <input type="hidden" name="restaurantId" value={restaurantId} />

      {'error' in state && state.error && (
        <div className="rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-800 shadow-sm">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="pub-name">Full name *</Label>
          <Input
            id="pub-name"
            name="guestName"
            placeholder="Jane Smith"
            className="min-h-11 rounded-xl"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pub-email">Email *</Label>
          <Input
            id="pub-email"
            name="guestEmail"
            type="email"
            placeholder="jane@example.com"
            className="min-h-11 rounded-xl"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pub-phone">Phone</Label>
          <Input
            id="pub-phone"
            name="guestPhone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            className="min-h-11 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pub-date">Date *</Label>
          <Input
            id="pub-date"
            name="reservationDate"
            type="date"
            min={today}
            className="min-h-11 rounded-xl"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pub-time">Time *</Label>
          <Input id="pub-time" name="reservationTime" type="time" className="min-h-11 rounded-xl" required />
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
            className="min-h-11 rounded-xl"
            required
          />
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="pub-notes">Special requests</Label>
          <Textarea
            id="pub-notes"
            name="notes"
            rows={2}
            placeholder="Dietary restrictions, special occasions…"
            className="min-h-[88px] rounded-xl"
          />
        </div>
      </div>

      <Button
        type="submit"
        className={`min-h-12 w-full rounded-xl text-base font-semibold ${buttonClassName}`}
        disabled={isPending}
      >
        {isPending ? 'Submitting…' : 'Request reservation'}
      </Button>
    </form>
  )
}
