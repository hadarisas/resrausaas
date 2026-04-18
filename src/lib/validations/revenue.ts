import { z } from 'zod'

export const revenueEntrySchema = z.object({
  entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  amount: z.coerce.number().min(0, 'Amount must be positive'),
  category: z.string().default('general'),
  notes: z.string().max(500).optional(),
})

export type RevenueEntryInput = z.infer<typeof revenueEntrySchema>
