import { cn } from '@/lib/utils'

type Counts = {
  total: number
  trial: number
  active: number
  readonly: number
  suspended: number
}

const items: { key: keyof Counts; label: string; dot: string }[] = [
  { key: 'total', label: 'Tenants', dot: 'bg-stone-400' },
  { key: 'trial', label: 'Trial', dot: 'bg-amber-400' },
  { key: 'active', label: 'Active', dot: 'bg-emerald-400' },
  { key: 'readonly', label: 'Read-only', dot: 'bg-sky-400' },
  { key: 'suspended', label: 'Suspended', dot: 'bg-red-400' },
]

export function PlatformStatsStrip({ counts }: { counts: Counts }) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-1 gap-y-2 rounded-xl border border-stone-800/90 bg-stone-900/40 px-3 py-2.5 sm:gap-x-2 sm:px-4',
        'ring-1 ring-white/[0.03]'
      )}
    >
      {items.map(({ key, label, dot }, i) => (
        <div key={key} className="flex items-center gap-2">
          {i > 0 && (
            <span className="hidden h-4 w-px bg-stone-700 sm:block" aria-hidden />
          )}
          <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dot)} aria-hidden />
          <span className="text-xs text-stone-500 sm:text-sm">{label}</span>
          <span className="text-sm font-semibold tabular-nums text-white sm:text-base">
            {counts[key]}
          </span>
        </div>
      ))}
    </div>
  )
}
