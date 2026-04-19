'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertRestaurantCanWrite } from '@/lib/access/server-assert'
import { restaurantInfoSchema } from '@/lib/validations/settings'
import { uploadImage } from '@/lib/utils/storage'
import type { ActionResult } from '@/types/actions'

export async function updateRestaurantInfoAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = restaurantInfoSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const denied = await assertRestaurantCanWrite()
  if (denied) return denied

  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('restaurant_id')
    .single()

  if (!profile?.restaurant_id) return { success: false, error: 'Restaurant not found.' }

  // Check slug uniqueness (excluding own restaurant)
  const { data: existing } = await supabase
    .from('restaurants')
    .select('id')
    .eq('slug', parsed.data.slug)
    .neq('id', profile.restaurant_id)
    .single()

  if (existing) return { success: false, error: 'That URL slug is already taken. Choose another.' }

  const { error } = await supabase
    .from('restaurants')
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description ?? null,
      cuisine_type: parsed.data.cuisineType ?? null,
      address: parsed.data.address ?? null,
      city: parsed.data.city ?? null,
      phone: parsed.data.phone ?? null,
      email: parsed.data.email ?? null,
      website_url: parsed.data.websiteUrl ?? null,
      cover_image_url: parsed.data.coverImageUrl === '' ? null : parsed.data.coverImageUrl,
      max_party_size: parsed.data.maxPartySize,
      is_published: parsed.data.isPublished,
    })
    .eq('id', profile.restaurant_id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/settings')
  revalidatePath(`/${parsed.data.slug}`)
  return { success: true, message: 'Settings saved.' }
}

export async function uploadLogoAction(
  restaurantId: string,
  formData: FormData
): Promise<ActionResult & { url?: string }> {
  const denied = await assertRestaurantCanWrite()
  if (denied) return denied

  const file = formData.get('logo') as File
  if (!file || file.size === 0) return { success: false, error: 'No file selected.' }

  const supabase = createClient()
  const result = await uploadImage(supabase, file, 'restaurant-logos', restaurantId)
  if (!result.success) return result

  const { error } = await supabase
    .from('restaurants')
    .update({ logo_url: result.url })
    .eq('id', restaurantId)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/settings')
  return { success: true, url: result.url }
}

export async function updateThemeAction(
  restaurantId: string,
  theme: string
): Promise<ActionResult> {
  const denied = await assertRestaurantCanWrite()
  if (denied) return denied

  const supabase = createClient()
  const { error } = await supabase
    .from('restaurants')
    .update({
      theme: theme as
        | 'fine-dining'
        | 'fast-food'
        | 'traditional'
        | 'modern'
        | 'minimal'
        | 'lifestyle-cafe',
    })
    .eq('id', restaurantId)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/settings')
  return { success: true }
}

export async function updateOpeningHoursAction(
  restaurantId: string,
  hours: Array<{
    dayOfWeek: string
    isClosed: boolean
    openTime?: string
    closeTime?: string
  }>
): Promise<ActionResult> {
  const denied = await assertRestaurantCanWrite()
  if (denied) return denied

  const supabase = createClient()

  const upserts = hours.map((h) => ({
    restaurant_id: restaurantId,
    day_of_week: h.dayOfWeek as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
    is_closed: h.isClosed,
    open_time: h.isClosed ? null : (h.openTime ?? null),
    close_time: h.isClosed ? null : (h.closeTime ?? null),
  }))

  const { error } = await supabase
    .from('opening_hours')
    .upsert(upserts, { onConflict: 'restaurant_id,day_of_week' })

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/settings')
  return { success: true, message: 'Opening hours saved.' }
}
