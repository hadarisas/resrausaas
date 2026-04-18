import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Database } from '@/types/database'

export type AccessStatus = Database['public']['Tables']['restaurants']['Row']['access_status']

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

export function PlatformAccessBadge({ status }: { status: AccessStatus }) {
  const b = accessBadgeProps(status)
  return (
    <Badge variant="outline" className={cn('border font-medium tabular-nums', b.className)}>
      {b.label}
    </Badge>
  )
}
