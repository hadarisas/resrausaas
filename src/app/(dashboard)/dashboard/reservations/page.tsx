import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ReservationTable from '@/components/reservations/ReservationTable'
import ReservationFilters from '@/components/reservations/ReservationFilters'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import type { Reservation } from '@/types/reservation'

export const metadata: Metadata = { title: 'Reservations' }

interface Props {
  searchParams: { date?: string; status?: string }
}

export default async function ReservationsPage({ searchParams }: Props) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('restaurant_id')
    .eq('id', user.id)
    .single()

  if (!profile?.restaurant_id) redirect('/login')

  let query = supabase
    .from('reservations')
    .select('*')
    .eq('restaurant_id', profile.restaurant_id)
    .order('reservation_date', { ascending: true })
    .order('reservation_time', { ascending: true })

  if (searchParams.date) query = query.eq('reservation_date', searchParams.date)
  if (searchParams.status) query = query.eq('status', searchParams.status as 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show')

  const { data: reservations } = await query

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Reservations</h1>
        <p className="mt-1 text-sm text-muted-foreground">Filter, edit, and track guest bookings.</p>
      </header>
      <Suspense>
        <ReservationFilters />
      </Suspense>
      <ReservationTable reservations={(reservations ?? []) as Reservation[]} />
    </div>
  )
}
