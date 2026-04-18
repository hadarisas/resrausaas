import type { SupabaseClient } from '@supabase/supabase-js'
import type { ActionResult } from '@/types/actions'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_MB = 4.5

export async function uploadImage(
  supabase: SupabaseClient,
  file: File,
  bucket: string,
  restaurantId: string
): Promise<ActionResult & { url?: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: 'File must be JPEG, PNG, WebP, or GIF.' }
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { success: false, error: `File must be under ${MAX_SIZE_MB}MB.` }
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const fileName = `${restaurantId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { upsert: false, contentType: file.type })

  if (uploadError) return { success: false, error: uploadError.message }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(fileName)

  return { success: true, url: publicUrl }
}
