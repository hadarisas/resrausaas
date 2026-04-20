import { createClient } from '@/lib/supabase/server'
import { PlatformTenantsPanel } from '@/components/platform/PlatformTenantsPanel'
import { PlatformStatsStrip } from '@/components/platform/PlatformStatsStrip'
import type { PlatformTenant } from '@/components/platform/types'
import type { Database } from '@/types/database'
import { AlertTriangle } from 'lucide-react'

type Restaurant = Database['public']['Tables']['restaurants']['Row']

function computeCounts(rows: PlatformTenant[]) {
  return {
    total: rows.length,
    trial: rows.filter((r) => r.access_status === 'trial').length,
    active: rows.filter((r) => r.access_status === 'active').length,
    readonly: rows.filter((r) => r.access_status === 'readonly').length,
    suspended: rows.filter((r) => r.access_status === 'suspended').length,
  }
}

export default async function PlatformAdminPage() {
  const supabase = createClient()

  const { data: restaurants, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: ownerRows } = await supabase.rpc('platform_tenant_owner_directory')

  const ownerByRestaurant = new Map(
    (ownerRows ?? []).map((o) => [
      o.restaurant_id,
      { full_name: o.full_name ?? null, email: o.email ?? null },
    ])
  )

  const restaurantIds = (restaurants ?? []).map((r) => r.id)
  const { data: ownerProfiles } =
    restaurantIds.length > 0
      ? await supabase
          .from('profiles')
          .select('restaurant_id, full_name')
          .eq('role', 'owner')
          .in('restaurant_id', restaurantIds)
      : { data: null as null }

  const ownerNameFallback = new Map<string, string | null>()
  for (const p of ownerProfiles ?? []) {
    if (p.restaurant_id) ownerNameFallback.set(p.restaurant_id, p.full_name)
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-5">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" aria-hidden />
          <div>
            <h1 className="font-semibold text-red-100">Could not load tenants</h1>
            <p className="mt-1 text-sm text-red-200/90">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  const rows: PlatformTenant[] = (restaurants ?? []).map((r) => {
    const o = ownerByRestaurant.get(r.id)
    const nameFallback = ownerNameFallback.get(r.id) ?? null
    return {
      ...(r as Restaurant),
      owner_full_name: o?.full_name ?? nameFallback,
      owner_email: o?.email ?? null,
    }
  })
  const counts = computeCounts(rows)

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Tenants</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-400 sm:text-[15px]">
          Access, trial window, subscription, public visibility, and billing notes. Default trial at
          signup is 14 days; you can extend or adjust trial end here.
        </p>
      </div>

      <PlatformStatsStrip counts={counts} />

      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Directory</h2>
        <PlatformTenantsPanel restaurants={rows} />
      </section>
    </div>
  )
}
