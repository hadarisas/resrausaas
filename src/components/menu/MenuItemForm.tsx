'use client'
import { useFormState } from 'react-dom'
import { createMenuItemAction, updateMenuItemAction } from '@/lib/actions/menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { MenuItem, MenuCategory } from '@/types/menu'
import type { ActionResult } from '@/types/actions'
import { useState } from 'react'

const initialState: ActionResult = { success: false, error: '' }

interface MenuItemFormProps {
  item?: MenuItem
  categories: MenuCategory[]
  defaultCategoryId?: string
  onClose: () => void
}

export default function MenuItemForm({ item, categories, defaultCategoryId, onClose }: MenuItemFormProps) {
  const action = item ? updateMenuItemAction : createMenuItemAction
  const [state, formAction, isPending] = useFormState(action, initialState)
  const [isAvailable, setIsAvailable] = useState(item?.is_available ?? true)
  const [categoryId, setCategoryId] = useState(item?.category_id ?? defaultCategoryId ?? categories[0]?.id ?? '')

  if ('success' in state && state.success) {
    onClose()
  }

  return (
    <form action={formAction} className="space-y-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      <input type="hidden" name="categoryId" value={categoryId} />
      <input type="hidden" name="isAvailable" value={isAvailable ? 'true' : 'false'} />

      {'error' in state && state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="space-y-1.5">
        <Label>Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="item-name">Name *</Label>
          <Input id="item-name" name="name" defaultValue={item?.name} required />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="item-desc">Description</Label>
          <Textarea id="item-desc" name="description" defaultValue={item?.description ?? ''} rows={2} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="item-price">Price *</Label>
          <Input id="item-price" name="price" type="number" step="0.01" min="0" defaultValue={item?.price} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="item-image">Image</Label>
          <Input id="item-image" name="image" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={isAvailable}
          onCheckedChange={setIsAvailable}
          id="item-available"
        />
        <Label htmlFor="item-available" className="cursor-pointer">Available</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? 'Saving…' : item ? 'Update item' : 'Add item'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
