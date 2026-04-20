import type { PublicPageAccess } from '@/lib/access/restaurant-access'
import type { Restaurant, OpeningHour } from '@/types/restaurant'
import type { MenuCategoryWithItems } from '@/types/menu'

export interface ThemeProps {
  restaurant: Restaurant
  categories: MenuCategoryWithItems[]
  openingHours: OpeningHour[]
  restaurantId: string
  publicAccess: PublicPageAccess
}

export type ThemeName =
  | 'fine-dining'
  | 'fast-food'
  | 'traditional'
  | 'modern'
  | 'minimal'
  | 'lifestyle-cafe'
