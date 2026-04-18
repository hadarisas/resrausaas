import { restaurantEntitlementPublic } from '@/lib/access/restaurant-access'
import { createClient } from '@/lib/supabase/server'
import type { MenuCategoryWithItems } from '@/types/menu'

export async function getRestaurantBySlug(slug: string) {
  const supabase = createClient()

  const { data: restaurant, error: rErr } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single()

  if (rErr || !restaurant) return null

  // Enforce same rules as anon RLS + restaurant_entitlement_public. Authenticated owners
  // otherwise bypass entitlement via auth_read_own_restaurant and could still load /[slug].
  if (!restaurantEntitlementPublic(restaurant)) return null

  const { data: categoriesRaw } = await supabase
    .from('menu_categories')
    .select('*, items:menu_items(*)')
    .eq('restaurant_id', restaurant.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const { data: openingHours } = await supabase
    .from('opening_hours')
    .select('*')
    .eq('restaurant_id', restaurant.id)

  const categories: MenuCategoryWithItems[] = (categoriesRaw ?? []).map((c) => ({
    ...c,
    items: ((c.items ?? []) as { is_available: boolean }[])
      .filter((i) => i.is_available) as MenuCategoryWithItems['items'],
  }))

  return {
    restaurant,
    categories,
    openingHours: openingHours ?? [],
  }
}
