import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string | number
  variant?: 'default' | 'warning' | 'success'
  description?: string
}

export default function StatsCard({ label, value, variant = 'default', description }: StatsCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm',
        variant === 'warning' && 'border-l-4 border-l-amber-400',
        variant === 'success' && 'border-l-4 border-l-emerald-500',
        variant === 'default' && 'border-l-4 border-l-stone-300'
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/50 to-transparent" />
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p
        className={cn(
          'mt-2 text-3xl font-bold tracking-tight text-gray-900',
          variant === 'warning' && 'text-amber-700',
          variant === 'success' && 'text-emerald-700'
        )}
      >
        {value}
      </p>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}
