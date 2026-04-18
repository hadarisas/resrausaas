'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertRestaurantCanWrite } from '@/lib/access/server-assert'
import {
  publicReservationSchema,
  adminReservationSchema,
  reservationStatusEnum,
} from '@/lib/validations/reservations'
import type { ActionResult } from '@/types/actions'

export async function createPublicReservationAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData)
  const parsed = publicReservationSchema.safeParse(raw)

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const supabase = createClient()
  const { error } = await supabase.from('reservations').insert({
    restaurant_id: parsed.data.restaurantId,
    guest_name: parsed.data.guestName,
    guest_email: parsed.data.guestEmail,
    guest_phone: parsed.data.guestPhone ?? null,
    party_size: parsed.data.partySize,
    reservation_date: parsed.data.reservationDate,
    reservation_time: parsed.data.reservationTime,
    notes: parsed.data.notes ?? null,
    status: 'pending',
  })

  if (error) return { success: false, error: 'Failed to submit reservation. Please try again.' }
  return { success: true, message: 'Reservation submitted! We will confirm shortly.' }
}

export async function updateReservationStatusAction(
  id: string,
  status: string
): Promise<ActionResult> {
  const parsed = reservationStatusEnum.safeParse(status)
  if (!parsed.success) return { success: false, error: 'Invalid status.' }

  const denied = await assertRestaurantCanWrite()
  if (denied) return denied

  const supabase = createClient()
  const { error } = await supabase
    .from('reservations')
    .update({ status: parsed.data })
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/reservations')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateReservationAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const id = formData.get('id') as string
  const parsed = adminReservationSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const denied = await assertRestaurantCanWrite()
  if (denied) return denied

  const supabase = createClient()
  const { error } = await supabase
    .from('reservations')
    .update({
      guest_name: parsed.data.guestName,
      guest_email: parsed.data.guestEmail,
      guest_phone: parsed.data.guestPhone ?? null,
      party_size: parsed.data.partySize,
      reservation_date: parsed.data.reservationDate,
      reservation_time: parsed.data.reservationTime,
      status: parsed.data.status,
      notes: parsed.data.notes ?? null,
      internal_notes: parsed.data.internalNotes ?? null,
    })
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/reservations')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteReservationAction(id: string): Promise<ActionResult> {
  const denied = await assertRestaurantCanWrite()
  if (denied) return denied

  const supabase = createClient()
  const { error } = await supabase.from('reservations').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/reservations')
  revalidatePath('/dashboard')
  return { success: true }
}
