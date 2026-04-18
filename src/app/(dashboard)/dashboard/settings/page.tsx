import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RestaurantInfoForm from '@/components/settings/RestaurantInfoForm'
import LogoUploader from '@/components/settings/LogoUploader'
import OpeningHoursForm from '@/components/settings/OpeningHoursForm'
import ThemeSelector from '@/components/settings/ThemeSelector'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
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

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', profile.restaurant_id)
    .single()

  const { data: hours } = await supabase
    .from('opening_hours')
    .select('*')
    .eq('restaurant_id', profile.restaurant_id)

  if (!restaurant) redirect('/login')

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <section className="space-y-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Restaurant Info</h2>
        <LogoUploader currentLogoUrl={restaurant.logo_url} restaurantId={restaurant.id} />
        <RestaurantInfoForm restaurant={restaurant} />
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Opening Hours</h2>
        <OpeningHoursForm hours={hours ?? []} restaurantId={restaurant.id} />
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Theme</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Choose how your public restaurant page looks. Changes apply immediately.
        </p>
        <ThemeSelector currentTheme={restaurant.theme} restaurantId={restaurant.id} />
      </section>
    </div>
  )
}
