'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertRestaurantCanWrite } from '@/lib/access/server-assert'
import { revenueEntrySchema } from '@/lib/validations/revenue'
import type { ActionResult } from '@/types/actions'

export async function createRevenueEntryAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = revenueEntrySchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const denied = await assertRestaurantCanWrite()
  if (denied) return denied

  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('restaurant_id')
    .single()

  if (!profile?.restaurant_id) return { success: false, error: 'Restaurant not found.' }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from('revenue_entries').upsert(
    {
      restaurant_id: profile.restaurant_id,
      entry_date: parsed.data.entryDate,
      amount: parsed.data.amount,
      category: parsed.data.category,
      notes: parsed.data.notes ?? null,
      created_by: user?.id ?? null,
    },
    { onConflict: 'restaurant_id,entry_date,category' }
  )

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/revenue')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteRevenueEntryAction(id: string): Promise<ActionResult> {
  const denied = await assertRestaurantCanWrite()
  if (denied) return denied

  const supabase = createClient()
  const { error } = await supabase.from('revenue_entries').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/revenue')
  return { success: true }
}
