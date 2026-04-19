'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertRestaurantCanWrite } from '@/lib/access/server-assert'
import { categorySchema, menuItemSchema } from '@/lib/validations/menu'
import { uploadImage } from '@/lib/utils/storage'
import type { ActionResult } from '@/types/actions'
import type { Database } from '@/types/database'

type MenuItemRow = Database['public']['Tables']['menu_items']['Row']

async function getMyRestaurantId(): Promise<string | null> {
  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('restaurant_id')
    .single()
  return profile?.restaurant_id ?? null
}

// --- CATEGORIES ---
export async function createCategoryAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = categorySchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const denied = await assertRestaurantCanWrite()
  if (denied) return denied

  const restaurantId = await getMyRestaurantId()
  if (!restaurantId) return { success: false, error: 'Restaurant not found.' }

  const supabase = createClient()
  const { error } = await supabase.from('menu_categories').insert({
    restaurant_id: restaurantId,
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    sort_order: parsed.data.sortOrder,
  })

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/menu')
  return { success: true }
}

export async function updateCategoryAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const id = formData.get('id') as string
  const parsed = categorySchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const denied = await assertRestaurantCanWrite()
  if (denied) return denied

  const supabase = createClient()
  const { error } = await supabase
    .from('menu_categories')
    .update({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      sort_order: parsed.data.sortOrder,
    })
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/menu')
  return { success: true }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  const denied = await assertRestaurantCanWrite()
  if (denied) return denied

  const supabase = createClient()
  const { error } = await supabase.from('menu_categories').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/menu')
  return { success: true }
}

// --- MENU ITEMS ---
export async function createMenuItemAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const imageFile = formData.get('image') as File | null
  const parsed = menuItemSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const denied = await assertRestaurantCanWrite()
  if (denied) return denied

  const restaurantId = await getMyRestaurantId()
  if (!restaurantId) return { success: false, error: 'Restaurant not found.' }

  const supabase = createClient()
  let imageUrl: string | null = null

  if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(supabase, imageFile, 'menu-images', restaurantId)
    if (!result.success) return result
    imageUrl = result.url ?? null
  }

  const { error } = await supabase.from('menu_items').insert({
    restaurant_id: restaurantId,
    category_id: parsed.data.categoryId,
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    price: parsed.data.price,
    image_url: imageUrl,
    is_available: parsed.data.isAvailable,
    is_featured: parsed.data.isFeatured,
    sort_order: parsed.data.sortOrder,
  })

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/menu')
  return { success: true }
}

export async function updateMenuItemAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const id = formData.get('id') as string
  const imageFile = formData.get('image') as File | null
  const parsed = menuItemSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const denied = await assertRestaurantCanWrite()
  if (denied) return denied

  const restaurantId = await getMyRestaurantId()
  if (!restaurantId) return { success: false, error: 'Restaurant not found.' }

  const supabase = createClient()
  let imageUrl: string | undefined = undefined

  if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(supabase, imageFile, 'menu-images', restaurantId)
    if (!result.success) return result
    imageUrl = result.url
  }

  const updateData: Partial<MenuItemRow> = {
    category_id: parsed.data.categoryId,
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    price: parsed.data.price,
    is_available: parsed.data.isAvailable,
    is_featured: parsed.data.isFeatured,
    sort_order: parsed.data.sortOrder,
    ...(imageUrl ? { image_url: imageUrl } : {}),
  }

  const { error } = await supabase.from('menu_items').update(updateData).eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/menu')
  return { success: true }
}

export async function deleteMenuItemAction(id: string): Promise<ActionResult> {
  const denied = await assertRestaurantCanWrite()
  if (denied) return denied

  const supabase = createClient()
  const { error } = await supabase.from('menu_items').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/menu')
  return { success: true }
}

export async function toggleItemAvailabilityAction(
  id: string,
  isAvailable: boolean
): Promise<ActionResult> {
  const denied = await assertRestaurantCanWrite()
  if (denied) return denied

  const supabase = createClient()
  const { error } = await supabase
    .from('menu_items')
    .update({ is_available: isAvailable })
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/menu')
  return { success: true }
}
