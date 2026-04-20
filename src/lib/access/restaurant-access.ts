import type { Database } from '@/types/database'

type RestaurantRow = Database['public']['Tables']['restaurants']['Row']

/** Guest can load /[slug]: published and not suspended (includes read-only brochure). */
export function restaurantEntitlementPublic(r: RestaurantRow): boolean {
  return r.is_published === true && r.access_status !== 'suspended'
}

/** Public can submit online reservations (trial or paid in good standing). */
export function restaurantEntitlementReservations(r: RestaurantRow): boolean {
  if (!restaurantEntitlementPublic(r)) return false
  const now = new Date()
  if (r.access_status === 'trial' && r.trial_ends_at) {
    return new Date(r.trial_ends_at) > now
  }
  if (r.access_status === 'active' && r.subscription_ends_at) {
    return new Date(r.subscription_ends_at) > now
  }
  return false
}

export type PublicPageAccess = {
  reservationsEnabled: boolean
  /** Trial / SaaS branding on the public page */
  showTrialBranding: boolean
  showPoweredBy: boolean
  trialDaysRemaining: number | null
  /** Brochure mode: page visible but reservations off */
  storefrontLimited: boolean
}

export function getPublicPageAccess(r: RestaurantRow): PublicPageAccess {
  const now = Date.now()
  const reservationsEnabled = restaurantEntitlementReservations(r)
  const trialEnd = r.trial_ends_at ? new Date(r.trial_ends_at).getTime() : null
  const inTrialWindow =
    r.access_status === 'trial' && trialEnd !== null && trialEnd > now
  const showTrialBranding = inTrialWindow
  const showPoweredBy = inTrialWindow
  let trialDaysRemaining: number | null = null
  if (inTrialWindow && trialEnd !== null) {
    trialDaysRemaining = Math.max(0, Math.ceil((trialEnd - now) / (24 * 60 * 60 * 1000)))
  }
  return {
    reservationsEnabled,
    showTrialBranding,
    showPoweredBy,
    trialDaysRemaining,
    storefrontLimited: restaurantEntitlementPublic(r) && !reservationsEnabled,
  }
}

export type DashboardAccessMode = 'full' | 'readonly' | 'suspended'

export function getDashboardAccessMode(restaurant: RestaurantRow | null): DashboardAccessMode {
  if (!restaurant) return 'suspended'
  switch (restaurant.access_status) {
    case 'suspended':
      return 'suspended'
    case 'readonly':
      return 'readonly'
    case 'trial': {
      const end = restaurant.trial_ends_at ? new Date(restaurant.trial_ends_at) : null
      if (end && end > new Date()) return 'full'
      return 'readonly'
    }
    case 'active': {
      const sub = restaurant.subscription_ends_at ? new Date(restaurant.subscription_ends_at) : null
      if (sub && sub > new Date()) return 'full'
      return 'readonly'
    }
    default:
      return 'readonly'
  }
}
