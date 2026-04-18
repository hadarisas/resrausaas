import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import type { Reservation } from '@/types/reservation'
import type { RevenueDataPoint } from '@/types/revenue'

type Client = SupabaseClient<Database>

export async function getTodayStats(supabase: Client, restaurantId: string) {
  const today = new Date().toISOString().split('T')[0]

  const [
    { count: todayReservations },
    { count: pendingCount },
    { data: todayRevenue },
    { count: activeMenuItems },
  ] = await Promise.all([
    supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true })
      .eq('restaurant_id', restaurantId)
      .eq('reservation_date', today),
    supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true })
      .eq('restaurant_id', restaurantId)
      .eq('status', 'pending'),
    supabase
      .from('revenue_entries')
      .select('amount')
      .eq('restaurant_id', restaurantId)
      .eq('entry_date', today),
    supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true })
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true),
  ])

  const todayRevenueTotal = (todayRevenue ?? []).reduce((s, r) => s + Number(r.amount), 0)

  return {
    todayReservations: todayReservations ?? 0,
    pendingCount: pendingCount ?? 0,
    todayRevenue: todayRevenueTotal,
    activeMenuItems: activeMenuItems ?? 0,
  }
}

export async function getUpcomingReservations(
  supabase: Client,
  restaurantId: string,
  limit = 5
): Promise<Reservation[]> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('reservations')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .gte('reservation_date', today)
    .in('status', ['pending', 'confirmed'])
    .order('reservation_date', { ascending: true })
    .order('reservation_time', { ascending: true })
    .limit(limit)

  return (data ?? []) as Reservation[]
}

export async function getWeeklyRevenue(
  supabase: Client,
  restaurantId: string
): Promise<RevenueDataPoint[]> {
  const days: RevenueDataPoint[] = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('en-US', { weekday: 'short' })
    days.push({ label, amount: 0, date: dateStr } as RevenueDataPoint & { date: string })
  }

  const from = (days[0] as RevenueDataPoint & { date: string }).date
  const { data } = await supabase
    .from('revenue_entries')
    .select('entry_date, amount')
    .eq('restaurant_id', restaurantId)
    .gte('entry_date', from)

  for (const row of data ?? []) {
    const point = days.find((d) => (d as RevenueDataPoint & { date: string }).date === row.entry_date)
    if (point) point.amount += Number(row.amount)
  }

  return days.map(({ label, amount }) => ({ label, amount }))
}
