import Link from 'next/link'
import type { RevenueDataPoint } from '@/types/revenue'
import { formatCurrency } from '@/lib/utils/format'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

const RevenueSummaryChart = dynamic(() => import('./RevenueSummaryChart'), { ssr: false })

interface RevenueSummaryProps {
  data: RevenueDataPoint[]
}

export default function RevenueSummary({ data }: RevenueSummaryProps) {
  const total = data.reduce((s, d) => s + d.amount, 0)

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="font-semibold text-gray-900">Weekly Revenue</h2>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(total)}</p>
        </div>
        <Link href="/dashboard/revenue" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="p-6">
        <Suspense fallback={<Skeleton className="h-[180px] w-full" />}>
          <RevenueSummaryChart data={data} />
        </Suspense>
      </div>
    </div>
  )
}
