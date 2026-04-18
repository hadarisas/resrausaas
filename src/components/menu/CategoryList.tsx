'use client'
import { useState, useTransition } from 'react'
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { deleteCategoryAction } from '@/lib/actions/menu'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import CategoryForm from './CategoryForm'
import MenuItemCard from './MenuItemCard'
import MenuItemForm from './MenuItemForm'
import type { MenuCategoryWithItems, MenuCategory } from '@/types/menu'

interface CategoryListProps {
  categories: MenuCategoryWithItems[]
}

export default function CategoryList({ categories }: CategoryListProps) {
  const [showNewCat, setShowNewCat] = useState(false)
  const [editingCat, setEditingCat] = useState<MenuCategory | null>(null)
  const [addItemFor, setAddItemFor] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [isPending, startTransition] = useTransition()

  function handleDeleteCategory(id: string, name: string) {
    if (!confirm(`Delete category "${name}" and all its items?`)) return
    startTransition(async () => {
      await deleteCategoryAction(id)
    })
  }

  function toggleCollapse(id: string) {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const allCategories: MenuCategory[] = categories.map(({ items: _items, ...c }) => c)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowNewCat(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add category
        </Button>
      </div>

      {categories.length === 0 && (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-muted-foreground">No categories yet. Add your first category to get started.</p>
        </div>
      )}

      {categories.map((category) => (
        <div key={category.id} className="rounded-xl border bg-white shadow-sm">
          {/* Category header */}
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <button
              onClick={() => toggleCollapse(category.id)}
              className="flex flex-1 items-center gap-2 text-left"
            >
              {collapsed[category.id] ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="font-semibold text-gray-900">{category.name}</span>
              <span className="text-xs text-muted-foreground">({category.items.length} items)</span>
            </button>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setEditingCat(category)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => handleDeleteCategory(category.id, category.name)}
                disabled={isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Items */}
          {!collapsed[category.id] && (
            <div className="space-y-2 p-4">
              {category.items.map((item) => (
                <MenuItemCard key={item.id} item={item} categories={allCategories} />
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setAddItemFor(category.id)}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add item
              </Button>
            </div>
          )}
        </div>
      ))}

      {/* Add category dialog */}
      <Dialog open={showNewCat} onOpenChange={setShowNewCat}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New category</DialogTitle>
          </DialogHeader>
          <CategoryForm onClose={() => setShowNewCat(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit category dialog */}
      <Dialog open={!!editingCat} onOpenChange={(o) => !o && setEditingCat(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
          </DialogHeader>
          {editingCat && (
            <CategoryForm category={editingCat} onClose={() => setEditingCat(null)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Add item dialog */}
      <Dialog open={!!addItemFor} onOpenChange={(o) => !o && setAddItemFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add menu item</DialogTitle>
          </DialogHeader>
          {addItemFor && (
            <MenuItemForm
              categories={allCategories}
              defaultCategoryId={addItemFor}
              onClose={() => setAddItemFor(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
