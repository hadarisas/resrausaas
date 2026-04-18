import type { Database } from '@/types/database'

type RestaurantRow = Database['public']['Tables']['restaurants']['Row']

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
