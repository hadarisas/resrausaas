export interface Restaurant {
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
  theme: 'fine-dining' | 'fast-food' | 'traditional' | 'modern' | 'minimal'
  is_published: boolean
  max_party_size: number
  created_at: string
  updated_at: string
}

export interface OpeningHour {
  id: string
  restaurant_id: string
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  is_closed: boolean
  open_time: string | null
  close_time: string | null
}

export interface Profile {
  id: string
  restaurant_id: string | null
  role: 'owner' | 'staff'
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type DayOfWeek = OpeningHour['day_of_week']
export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
]
export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}
