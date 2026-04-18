import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string | number
  variant?: 'default' | 'warning' | 'success'
  description?: string
}

export default function StatsCard({ label, value, variant = 'default', description }: StatsCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p
        className={cn(
          'mt-2 text-3xl font-bold tracking-tight',
          variant === 'warning' && 'text-yellow-600',
          variant === 'success' && 'text-green-600'
        )}
      >
        {value}
      </p>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}
