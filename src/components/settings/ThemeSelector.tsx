'use client'
import { useState, useTransition } from 'react'
import { updateThemeAction } from '@/lib/actions/settings'
import { cn } from '@/lib/utils'

const THEMES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, white, minimal borders',
    preview: 'bg-gradient-to-br from-slate-50 to-slate-100',
    accent: 'bg-slate-800',
  },
  {
    id: 'fine-dining',
    name: 'Fine Dining',
    description: 'Elegant dark with gold accents',
    preview: 'bg-gradient-to-br from-stone-900 to-stone-800',
    accent: 'bg-amber-400',
  },
  {
    id: 'fast-food',
    name: 'Fast Food',
    description: 'Bold, vibrant, high-energy',
    preview: 'bg-gradient-to-br from-red-500 to-orange-400',
    accent: 'bg-yellow-400',
  },
  {
    id: 'traditional',
    name: 'Traditional',
    description: 'Warm, classic, inviting',
    preview: 'bg-gradient-to-br from-amber-50 to-orange-50',
    accent: 'bg-amber-700',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Pure white, typography-first',
    preview: 'bg-white border',
    accent: 'bg-black',
  },
] as const

interface ThemeSelectorProps {
  currentTheme: string
  restaurantId: string
}

export default function ThemeSelector({ currentTheme, restaurantId }: ThemeSelectorProps) {
  const [selected, setSelected] = useState(currentTheme)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function handleSelect(themeId: string) {
    setSelected(themeId)
    setError('')
    startTransition(async () => {
      const result = await updateThemeAction(restaurantId, themeId)
      if (!result.success) setError(result.error)
    })
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleSelect(theme.id)}
            disabled={isPending}
            className={cn(
              'relative rounded-xl border-2 p-4 text-left transition-all hover:shadow-md',
              selected === theme.id
                ? 'border-primary ring-2 ring-primary ring-offset-1'
                : 'border-border hover:border-primary/50'
            )}
          >
            <div className={cn('mb-3 h-16 w-full rounded-lg', theme.preview)}>
              <div className={cn('m-2 h-3 w-12 rounded-full opacity-80', theme.accent)} />
              <div className="m-2 mt-1 h-2 w-20 rounded-full bg-current opacity-20" />
            </div>
            <p className="text-sm font-semibold text-gray-900">{theme.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{theme.description}</p>
            {selected === theme.id && (
              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
