import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import type { RevenueDataPoint, RevenuePeriod } from '@/types/revenue'

type Client = SupabaseClient<Database>

export async function getRevenueData(
  supabase: Client,
  restaurantId: string,
  period: RevenuePeriod
): Promise<RevenueDataPoint[]> {
  const now = new Date()
  let fromDate: Date

  if (period === 'daily') {
    fromDate = new Date(now)
    fromDate.setDate(fromDate.getDate() - 29)
  } else if (period === 'weekly') {
    fromDate = new Date(now)
    fromDate.setDate(fromDate.getDate() - 83)
  } else {
    fromDate = new Date(now)
    fromDate.setMonth(fromDate.getMonth() - 11)
    fromDate.setDate(1)
  }

  const fromStr = fromDate.toISOString().split('T')[0]

  const { data } = await supabase
    .from('revenue_entries')
    .select('entry_date, amount')
    .eq('restaurant_id', restaurantId)
    .gte('entry_date', fromStr)
    .order('entry_date', { ascending: true })

  return aggregateRevenue(data ?? [], period)
}

function aggregateRevenue(
  rows: { entry_date: string; amount: number }[],
  period: RevenuePeriod
): RevenueDataPoint[] {
  const map = new Map<string, number>()

  for (const row of rows) {
    const d = new Date(row.entry_date + 'T12:00:00')
    let key: string

    if (period === 'daily') {
      key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else if (period === 'weekly') {
      const weekStart = new Date(d)
      weekStart.setDate(d.getDate() - d.getDay())
      key = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else {
      key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    }

    map.set(key, (map.get(key) ?? 0) + Number(row.amount))
  }

  return Array.from(map.entries()).map(([label, amount]) => ({ label, amount }))
}
