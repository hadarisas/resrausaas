import type { Database } from '@/types/database'

type RestaurantRow = Database['public']['Tables']['restaurants']['Row']


export function restaurantEntitlementPublic(r: RestaurantRow): boolean {
  if (!r.is_published) return false
  const now = new Date()
  if (r.access_status === 'trial' && r.trial_ends_at) {
    return new Date(r.trial_ends_at) > now
  }
  if (r.access_status === 'active' && r.subscription_ends_at) {
    return new Date(r.subscription_ends_at) > now
  }
  return false
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
