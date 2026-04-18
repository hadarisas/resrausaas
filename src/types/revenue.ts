export interface RevenueEntry {
  id: string
  restaurant_id: string
  entry_date: string
  amount: number
  category: string
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface RevenueDataPoint {
  label: string
  amount: number
}

export type RevenuePeriod = 'daily' | 'weekly' | 'monthly'
