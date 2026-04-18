'use client'
import { useTransition, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { toggleItemAvailabilityAction, deleteMenuItemAction } from '@/lib/actions/menu'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import MenuItemForm from './MenuItemForm'
import { formatCurrency } from '@/lib/utils/format'
import type { MenuItem, MenuCategory } from '@/types/menu'

interface MenuItemCardProps {
  item: MenuItem
  categories: MenuCategory[]
}

export default function MenuItemCard({ item, categories }: MenuItemCardProps) {
  const [isPending, startTransition] = useTransition()
  const [isAvailable, setIsAvailable] = useState(item.is_available)
  const [showEdit, setShowEdit] = useState(false)

  function handleToggle(checked: boolean) {
    setIsAvailable(checked)
    startTransition(async () => {
      await toggleItemAvailabilityAction(item.id, checked)
    })
  }

  function handleDelete() {
    if (!confirm(`Delete "${item.name}"?`)) return
    startTransition(async () => {
      await deleteMenuItemAction(item.id)
    })
  }

  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border bg-white p-3">
        {item.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image_url} alt={item.name} className="h-14 w-14 shrink-0 rounded-md object-cover" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
              {item.description && (
                <p className="truncate text-xs text-muted-foreground">{item.description}</p>
              )}
            </div>
            <p className="shrink-0 text-sm font-semibold">{formatCurrency(item.price)}</p>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <Switch
              checked={isAvailable}
              onCheckedChange={handleToggle}
              disabled={isPending}
              aria-label="Toggle availability"
            />
            <span className="text-xs text-muted-foreground">
              {isAvailable ? 'Available' : 'Unavailable'}
            </span>
            <div className="ml-auto flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setShowEdit(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={handleDelete}
                disabled={isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit menu item</DialogTitle>
          </DialogHeader>
          <MenuItemForm
            item={item}
            categories={categories}
            onClose={() => setShowEdit(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
