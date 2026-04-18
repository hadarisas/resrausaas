'use server'
import { createClient } from '@/lib/supabase/server'
import { signupSchema, loginSchema } from '@/lib/validations/auth'
import { redirect } from 'next/navigation'
import type { ActionResult } from '@/types/actions'

export async function signupAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData)
  const parsed = signupSchema.safeParse(raw)

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        restaurant_name: parsed.data.restaurantName,
      },
    },
  })

  if (error) return { success: false, error: error.message }
  redirect('/dashboard')
}

export async function loginAction(
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
  redirect('/dashboard')
}

export async function signoutAction(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
