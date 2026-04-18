'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { RevenuePeriod } from '@/types/revenue'

const OPTIONS: { value: RevenuePeriod; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

interface PeriodSelectorProps {
  current: RevenuePeriod
}

export default function PeriodSelector({ current }: PeriodSelectorProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function buildHref(period: RevenuePeriod) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('period', period)
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex rounded-lg border bg-white p-1 shadow-sm">
      {OPTIONS.map(({ value, label }) => (
        <Link
          key={value}
          href={buildHref(value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            current === value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  )
}
