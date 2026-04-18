import { z } from 'zod'

export const reservationStatusEnum = z.enum([
  'pending',
  'confirmed',
  'seated',
  'completed',
  'cancelled',
  'no_show',
])

export const publicReservationSchema = z.object({
  restaurantId: z.string().uuid(),
  guestName: z.string().min(2, 'Name is required').max(200),
  guestEmail: z.string().email('Valid email required'),
  guestPhone: z.string().max(30).optional(),
  partySize: z.coerce.number().int().min(1, 'Party size must be at least 1').max(50),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  reservationTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  notes: z.string().max(500).optional(),
})

export const adminReservationSchema = z.object({
  guestName: z.string().min(2, 'Name is required').max(200),
  guestEmail: z.string().email('Valid email required'),
  guestPhone: z.string().max(30).optional(),
  partySize: z.coerce.number().int().min(1).max(50),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  reservationTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  status: reservationStatusEnum,
  notes: z.string().max(500).optional(),
  internalNotes: z.string().max(1000).optional(),
})

export type PublicReservationInput = z.infer<typeof publicReservationSchema>
export type AdminReservationInput = z.infer<typeof adminReservationSchema>
