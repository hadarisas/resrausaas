import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import type { MenuCategoryWithItems } from '@/types/menu'

type Client = SupabaseClient<Database>

export async function getMenuWithCategories(
  supabase: Client,
  restaurantId: string
): Promise<MenuCategoryWithItems[]> {
  const { data } = await supabase
    .from('menu_categories')
    .select('*, items:menu_items(*)')
    .eq('restaurant_id', restaurantId)
    .order('sort_order', { ascending: true })

  return (data ?? []).map((c) => ({
    ...c,
    items: (c.items ?? []).sort((a, b) => a.sort_order - b.sort_order),
  })) as MenuCategoryWithItems[]
}
