import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getRevenueData } from '@/lib/queries/revenue'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'
import PeriodSelector from '@/components/revenue/PeriodSelector'
import RevenueEntryForm from '@/components/revenue/RevenueEntryForm'
import type { Metadata } from 'next'
import type { RevenuePeriod } from '@/types/revenue'
import { formatCurrency } from '@/lib/utils/format'

export const metadata: Metadata = { title: 'Revenue' }

const RevenueChart = dynamic(() => import('@/components/revenue/RevenueChart'), { ssr: false })

interface Props {
  searchParams: { period?: string }
}

export default async function RevenuePage({ searchParams }: Props) {
  const period = (searchParams.period as RevenuePeriod) ?? 'weekly'

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('restaurant_id')
    .eq('id', user.id)
    .single()

  if (!profile?.restaurant_id) redirect('/login')

  const revenueData = await getRevenueData(supabase, profile.restaurant_id, period)
  const total = revenueData.reduce((s, d) => s + d.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue</h1>
          <p className="text-sm text-muted-foreground">Total: {formatCurrency(total)}</p>
        </div>
        <Suspense>
          <PeriodSelector current={period} />
        </Suspense>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <RevenueChart data={revenueData} period={period} />
        </Suspense>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Add Entry</h2>
        <RevenueEntryForm />
      </div>
    </div>
  )
}
