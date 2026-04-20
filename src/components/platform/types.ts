import type { Database } from '@/types/database'

export type PlatformTenant = Database['public']['Tables']['restaurants']['Row'] & {
  owner_full_name: string | null
  owner_email: string | null
}
