import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTodayStats, getUpcomingReservations, getWeeklyRevenue } from '@/lib/queries/dashboard'
import StatsCard from '@/components/dashboard/StatsCard'
import RecentReservations from '@/components/dashboard/RecentReservations'
import RevenueSummary from '@/components/dashboard/RevenueSummary'
import { formatCurrency } from '@/lib/utils/format'

export default async function DashboardPage() {
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

  const restaurantId = profile.restaurant_id

  const [stats, reservations, weeklyRevenue] = await Promise.all([
    getTodayStats(supabase, restaurantId),
    getUpcomingReservations(supabase, restaurantId),
    getWeeklyRevenue(supabase, restaurantId),
  ])

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Overview</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatsCard label="Today&apos;s Reservations" value={stats.todayReservations} />
        <StatsCard label="Pending" value={stats.pendingCount} variant="warning" />
        <StatsCard
          label="Today&apos;s Revenue"
          value={formatCurrency(stats.todayRevenue)}
          variant="success"
        />
        <StatsCard label="Active Items" value={stats.activeMenuItems} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentReservations reservations={reservations} />
        <RevenueSummary data={weeklyRevenue} />
      </div>
    </div>
  )
}
