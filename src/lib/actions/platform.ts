'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema } from '@/lib/validations/auth'
import { z } from 'zod'
import type { ActionResult } from '@/types/actions'

const updateSchema = z.object({
  restaurantId: z.string().uuid(),
  accessStatus: z.enum(['trial', 'active', 'readonly', 'suspended']),
  subscriptionEndsAt: z
    .preprocess((v) => (v === '' || v === undefined ? null : v), z.string().nullable().optional()),
  billingNotes: z
    .preprocess((v) => (v === '' || v === undefined ? null : v), z.string().max(5000).nullable().optional()),
})

async function assertPlatformAdmin(): Promise<ActionResult | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not signed in.' }

  const { data: row } = await supabase
    .from('platform_admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!row) return { success: false, error: 'Forbidden.' }
  return null
}

export async function platformLoginAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData)
  const parsed = loginSchema.safeParse(raw)

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) return { success: false, error: error.message }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Sign-in failed.' }

  const { data: admin } = await supabase
    .from('platform_admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!admin) {
    await supabase.auth.signOut()
    return {
      success: false,
      error: 'This account is not authorized for platform administration.',
    }
  }

  redirect('/platform')
}

export async function platformSignoutAction(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/platform/login')
}

export async function platformRestaurantUpdateAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const denied = await assertPlatformAdmin()
  if (denied) {
    return {
      success: false,
      error: 'error' in denied && denied.error ? denied.error : 'Forbidden',
    }
  }

  const raw = {
    restaurantId: formData.get('restaurantId'),
    accessStatus: formData.get('accessStatus'),
    subscriptionEndsAt: formData.get('subscriptionEndsAt'),
    billingNotes: formData.get('billingNotes'),
  }

  const parsed = updateSchema.safeParse(raw)

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid data.' }
  }

  const supabase = createClient()

  const subscriptionEndsAtIso =
    parsed.data.subscriptionEndsAt && parsed.data.subscriptionEndsAt.length > 0
      ? new Date(parsed.data.subscriptionEndsAt).toISOString()
      : null

  const { error } = await supabase
    .from('restaurants')
    .update({
      access_status: parsed.data.accessStatus,
      subscription_ends_at: subscriptionEndsAtIso,
      billing_notes: parsed.data.billingNotes ?? null,
    })
    .eq('id', parsed.data.restaurantId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/platform')
  revalidatePath('/dashboard')
  return { success: true, message: 'Tenant settings saved.' }
}
