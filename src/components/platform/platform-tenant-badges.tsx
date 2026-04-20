import { Badge } from '@/components/ui/badge'
import {
  restaurantEntitlementPublic,
  restaurantEntitlementReservations,
} from '@/lib/access/restaurant-access'
import { cn } from '@/lib/utils'
import type { Database } from '@/types/database'

export type AccessStatus = Database['public']['Tables']['restaurants']['Row']['access_status']

type Row = Database['public']['Tables']['restaurants']['Row']

export function accessBadgeProps(status: AccessStatus): { label: string; className: string } {
  switch (status) {
    case 'trial':
      return {
        label: 'Trial',
        className:
          'border-amber-500/40 bg-amber-500/15 text-amber-200 hover:bg-amber-500/20',
      }
    case 'active':
      return {
        label: 'Active',
        className:
          'border-emerald-500/40 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/20',
      }
    case 'readonly':
      return {
        label: 'Read-only',
        className: 'border-sky-500/40 bg-sky-500/15 text-sky-200 hover:bg-sky-500/20',
      }
    case 'suspended':
      return {
        label: 'Suspended',
        className:
          'border-red-500/40 bg-red-500/15 text-red-200 hover:bg-red-500/20',
      }
    default:
      return {
        label: String(status),
        className: 'border-stone-600 bg-stone-800 text-stone-300',
      }
  }
}

/** Badge reflects guest /[slug] visibility and whether online bookings are enabled. */
export function platformTenantAccessBadgeProps(r: Row): { label: string; className: string; title: string } {
  if (!r.is_published) {
    return {
      label: 'Draft',
      className: 'border-stone-600 bg-stone-800/80 text-stone-400',
      title: 'Public page hidden until set to Live.',
    }
  }

  if (r.access_status === 'suspended') {
    const b = accessBadgeProps('suspended')
    return { ...b, title: 'Suspended — guest site is unavailable.' }
  }

  if (restaurantEntitlementPublic(r)) {
    const b = accessBadgeProps(r.access_status)
    if (restaurantEntitlementReservations(r)) {
      return {
        ...b,
        title: 'Guest URL live — menu visible and online reservations enabled.',
      }
    }
    return {
      ...b,
      title: 'Guest URL live (brochure) — menu visible; online reservations disabled until the plan is active.',
    }
  }

  return {
    label: 'No public access',
    className: 'border-stone-600 bg-stone-800 text-stone-400',
    title: 'Guest-facing page is not available for this venue.',
  }
}

export function PlatformAccessBadge({ restaurant }: { restaurant: Row }) {
  const b = platformTenantAccessBadgeProps(restaurant)
  return (
    <Badge variant="outline" title={b.title} className={cn('border font-medium tabular-nums', b.className)}>
      {b.label}
    </Badge>
  )
}
