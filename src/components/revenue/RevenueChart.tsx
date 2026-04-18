'use client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { RevenueDataPoint, RevenuePeriod } from '@/types/revenue'

interface RevenueChartProps {
  data: RevenueDataPoint[]
  period: RevenuePeriod
}

const PERIOD_LABELS: Record<RevenuePeriod, string> = {
  daily: 'Last 30 Days',
  weekly: 'Last 12 Weeks',
  monthly: 'Last 12 Months',
}

export default function RevenueChart({ data, period }: RevenueChartProps) {
  return (
    <div>
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {PERIOD_LABELS[period]}
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
          />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={((value: number) => [`$${value.toFixed(2)}`, 'Revenue']) as any}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
          />
          <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
