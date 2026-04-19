import { z } from 'zod'

const availableFromForm = z.preprocess((val) => {
  if (val === undefined || val === null || val === '') return true
  return val === 'true' || val === true
}, z.boolean())

const featuredFromForm = z.preprocess((val) => val === 'true' || val === true, z.boolean())

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  description: z.string().max(500).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
})

export const menuItemSchema = z.object({
  categoryId: z.string().uuid('Invalid category'),
  name: z.string().min(1, 'Item name is required').max(200),
  description: z.string().max(1000).optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  isAvailable: availableFromForm,
  isFeatured: featuredFromForm,
  sortOrder: z.coerce.number().int().min(0).default(0),
})

export type CategoryInput = z.infer<typeof categorySchema>
export type MenuItemInput = z.infer<typeof menuItemSchema>
