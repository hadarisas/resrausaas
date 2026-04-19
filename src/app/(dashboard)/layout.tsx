import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDashboardAccessMode } from '@/lib/access/restaurant-access'
import Sidebar from '@/components/dashboard/Sidebar'
import MobileTabBar from '@/components/dashboard/MobileTabBar'
import { AccessRedirect, ReadonlyBanner } from '@/components/dashboard/AccessShell'
import type { Database } from '@/types/database'

type Restaurant = Database['public']['Tables']['restaurants']['Row']

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
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

  await supabase.rpc('sync_restaurant_access_if_expired', {
    p_restaurant_id: profile.restaurant_id,
  })

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', profile.restaurant_id)
    .single()

  if (!restaurant) redirect('/login')

  const accessMode = getDashboardAccessMode(restaurant as Restaurant)
  const restaurantName = restaurant.name ?? 'My Restaurant'

  return (
    <div className="dashboard-app flex min-h-screen">
      <AccessRedirect mode={accessMode} />
      <Sidebar restaurantName={restaurantName} />
      <main className="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0 md:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <ReadonlyBanner mode={accessMode} />
          {children}
        </div>
      </main>
      <MobileTabBar />
    </div>
  )
}
