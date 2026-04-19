'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertRestaurantCanWrite } from '@/lib/access/server-assert'
import { sendReservationStatusUpdateEmail } from '@/lib/email/reservation-emails'
import {
  publicReservationSchema,
  adminReservationSchema,
  reservationStatusEnum,
} from '@/lib/validations/reservations'
import type { ActionResult } from '@/types/actions'
import type { ReservationStatus } from '@/types/reservation'

type ReservationRowWithRestaurant = {
  guest_name: string
  guest_email: string
  reservation_date: string
  reservation_time: string
  party_size: number
  status: ReservationStatus
  restaurants: { name: string; slug: string } | null
}

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

  const { data: existing, error: fetchErr } = await supabase
    .from('reservations')
    .select('guest_name, guest_email, reservation_date, reservation_time, party_size, status, restaurants(name, slug)')
    .eq('id', id)
    .single()

  if (fetchErr || !existing) {
    return { success: false, error: 'Reservation not found.' }
  }

  const row = existing as unknown as ReservationRowWithRestaurant
  const previousStatus = row.status
  if (previousStatus === parsed.data) {
    return { success: true }
  }

  const { error } = await supabase
    .from('reservations')
    .update({ status: parsed.data })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  await sendReservationStatusUpdateEmail(row, previousStatus, parsed.data)

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

  const { data: before, error: fetchErr } = await supabase
    .from('reservations')
    .select('guest_name, guest_email, reservation_date, reservation_time, party_size, status, restaurants(name, slug)')
    .eq('id', id)
    .single()

  if (fetchErr || !before) {
    return { success: false, error: 'Reservation not found.' }
  }

  const previousStatus = (before as unknown as ReservationRowWithRestaurant).status

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

  if (previousStatus !== parsed.data.status) {
    const emailRow: ReservationRowWithRestaurant = {
      ...(before as unknown as ReservationRowWithRestaurant),
      guest_name: parsed.data.guestName,
      guest_email: parsed.data.guestEmail,
      reservation_date: parsed.data.reservationDate,
      reservation_time: parsed.data.reservationTime,
      party_size: parsed.data.partySize,
      status: parsed.data.status,
    }
    await sendReservationStatusUpdateEmail(emailRow, previousStatus, parsed.data.status)
  }

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
