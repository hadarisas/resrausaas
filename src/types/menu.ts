export interface MenuCategory {
  id: string
  restaurant_id: string
  name: string
  description: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  restaurant_id: string
  category_id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
  is_featured: boolean
  allergens: string[] | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type MenuCategoryWithItems = MenuCategory & {
  items: MenuItem[]
}
