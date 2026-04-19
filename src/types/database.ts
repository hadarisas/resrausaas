

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type RestaurantRow = {
  id: string
  slug: string
  name: string
  description: string | null
  cuisine_type: string | null
  address: string | null
  city: string | null
  phone: string | null
  email: string | null
  website_url: string | null
  logo_url: string | null
  cover_image_url: string | null
  theme: 'fine-dining' | 'fast-food' | 'traditional' | 'modern' | 'minimal' | 'lifestyle-cafe'
  is_published: boolean
  max_party_size: number
  trial_ends_at: string
  subscription_ends_at: string | null
  access_status: 'trial' | 'active' | 'readonly' | 'suspended'
  billing_notes: string | null
  created_at: string
  updated_at: string
}

type PlatformAdminRow = {
  user_id: string
  created_at: string
}

type ProfileRow = {
  id: string
  restaurant_id: string | null
  role: 'owner' | 'staff'
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

type MenuCategoryRow = {
  id: string
  restaurant_id: string
  name: string
  description: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

type MenuItemRow = {
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

type OpeningHourRow = {
  id: string
  restaurant_id: string
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  is_closed: boolean
  open_time: string | null
  close_time: string | null
}

type ReservationRow = {
  id: string
  restaurant_id: string
  guest_name: string
  guest_email: string
  guest_phone: string | null
  party_size: number
  reservation_date: string
  reservation_time: string
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show'
  notes: string | null
  internal_notes: string | null
  created_at: string
  updated_at: string
}

type RevenueEntryRow = {
  id: string
  restaurant_id: string
  entry_date: string
  amount: number
  category: string
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      restaurants: {
        Row: RestaurantRow
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          cuisine_type?: string | null
          address?: string | null
          city?: string | null
          phone?: string | null
          email?: string | null
          website_url?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          theme?: 'fine-dining' | 'fast-food' | 'traditional' | 'modern' | 'minimal' | 'lifestyle-cafe'
          is_published?: boolean
          max_party_size?: number
          trial_ends_at?: string
          subscription_ends_at?: string | null
          access_status?: 'trial' | 'active' | 'readonly' | 'suspended'
          billing_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<RestaurantRow>
        Relationships: []
      }
      platform_admins: {
        Row: PlatformAdminRow
        Insert: {
          user_id: string
          created_at?: string
        }
        Update: Partial<PlatformAdminRow>
        Relationships: []
      }
      profiles: {
        Row: ProfileRow
        Insert: {
          id: string
          restaurant_id?: string | null
          role?: 'owner' | 'staff'
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<ProfileRow>
        Relationships: []
      }
      menu_categories: {
        Row: MenuCategoryRow
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<MenuCategoryRow>
        Relationships: []
      }
      menu_items: {
        Row: MenuItemRow
        Insert: {
          id?: string
          restaurant_id: string
          category_id: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          allergens?: string[] | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<MenuItemRow>
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          }
        ]
      }
      opening_hours: {
        Row: OpeningHourRow
        Insert: {
          id?: string
          restaurant_id: string
          day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
          is_closed?: boolean
          open_time?: string | null
          close_time?: string | null
        }
        Update: Partial<OpeningHourRow>
        Relationships: []
      }
      reservations: {
        Row: ReservationRow
        Insert: {
          id?: string
          restaurant_id: string
          guest_name: string
          guest_email: string
          guest_phone?: string | null
          party_size: number
          reservation_date: string
          reservation_time: string
          status?: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<ReservationRow>
        Relationships: []
      }
      revenue_entries: {
        Row: RevenueEntryRow
        Insert: {
          id?: string
          restaurant_id: string
          entry_date: string
          amount: number
          category: string
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<RevenueEntryRow>
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: {
      restaurant_has_full_access: {
        Args: { p_restaurant_id: string }
        Returns: boolean
      }
      sync_restaurant_access_if_expired: {
        Args: { p_restaurant_id: string }
        Returns: undefined
      }
    }
    Enums: {
      reservation_status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show'
      user_role: 'owner' | 'staff'
      restaurant_theme: 'fine-dining' | 'fast-food' | 'traditional' | 'modern' | 'minimal' | 'lifestyle-cafe'
      day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
      restaurant_access_status: 'trial' | 'active' | 'readonly' | 'suspended'
    }
  }
}
