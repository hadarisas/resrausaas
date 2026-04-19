import { z } from 'zod'

export const restaurantInfoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z
    .string()
    .min(1, 'URL slug is required')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(2000).optional(),
  cuisineType: z.string().max(100).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  coverImageUrl: z.preprocess(
    (val) => (val === undefined || val === null ? '' : val),
    z.union([z.string().url({ message: 'Cover image must be a valid URL' }), z.literal('')])
  ),
  maxPartySize: z.coerce.number().int().min(1).max(100).default(10),
  // z.coerce.boolean() treats any non-empty string as true — use preprocess instead
  isPublished: z.preprocess(val => val === 'true' || val === true, z.boolean()),
})

const hourRowSchema = z.object({
  dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  isClosed: z.coerce.boolean(),
  openTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
})

export const openingHoursSchema = z.object({
  hours: z.array(hourRowSchema).length(7),
})

export type RestaurantInfoInput = z.infer<typeof restaurantInfoSchema>
export type OpeningHoursInput = z.infer<typeof openingHoursSchema>
