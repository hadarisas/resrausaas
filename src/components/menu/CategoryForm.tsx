'use client'
import { useFormState } from 'react-dom'
import { createCategoryAction, updateCategoryAction } from '@/lib/actions/menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { MenuCategory } from '@/types/menu'
import type { ActionResult } from '@/types/actions'

const initialState: ActionResult = { success: false, error: '' }

interface CategoryFormProps {
  category?: MenuCategory
  onClose: () => void
}

export default function CategoryForm({ category, onClose }: CategoryFormProps) {
  const action = category ? updateCategoryAction : createCategoryAction
  const [state, formAction, isPending] = useFormState(action, initialState)

  if ('success' in state && state.success) {
    onClose()
  }

  return (
    <form action={formAction} className="space-y-4">
      {category && <input type="hidden" name="id" value={category.id} />}

      {'error' in state && state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="cat-name">Name *</Label>
        <Input id="cat-name" name="name" defaultValue={category?.name} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cat-description">Description</Label>
        <Textarea id="cat-description" name="description" defaultValue={category?.description ?? ''} rows={2} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? 'Saving…' : category ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
