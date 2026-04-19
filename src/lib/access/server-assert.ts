'use server'

import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/types/actions'

export async function assertRestaurantCanWrite(): Promise<ActionResult | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not signed in.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('restaurant_id')
    .eq('id', user.id)
    .single()

  const rid = profile?.restaurant_id
  if (!rid) return { success: false, error: 'No restaurant.' }

  const { data: can, error } = await supabase.rpc('restaurant_has_full_access', {
    p_restaurant_id: rid,
  })

  if (error) return { success: false, error: error.message }
  if (!can) {
    return {
      success: false,
      error: 'Your account is read-only or suspended. Contact support to restore full access.',
    }
  }

  return null
}
