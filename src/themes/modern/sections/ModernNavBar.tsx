'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/themes/shared/theme-config'

interface NavBarProps {
  theme: ThemeConfig
  restaurantName: string
  logoUrl: string | null
}

export default function ModernNavBar({ theme, restaurantName, logoUrl }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-300',
        scrolled
          ? 'border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      )}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={restaurantName}
            className="h-9 w-auto max-w-[48%] object-contain sm:h-10"
          />
        ) : (
          <span className="truncate text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
            {restaurantName}
          </span>
        )}

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#menu" className="transition-colors hover:text-orange-600">
            Menu
          </a>
          <a href="#reserve" className="transition-colors hover:text-orange-600">
            Reserve
          </a>
          <a href="#hours" className="transition-colors hover:text-orange-600">
            Hours
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#reserve"
            className={cn(
              'hidden rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] sm:inline-flex',
              theme.accent,
              theme.accentFg,
              theme.accentHover
            )}
          >
            Reserve Now
          </a>
          <a
            href="#reserve"
            className={cn(
              'inline-flex rounded-xl px-4 py-2 text-xs font-semibold shadow-md transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] sm:hidden',
              theme.accent,
              theme.accentFg,
              theme.accentHover
            )}
          >
            Book
          </a>
        </div>
      </div>

      <nav className="flex gap-5 overflow-x-auto border-t border-slate-200/80 px-4 pb-3 pt-2 text-xs font-medium text-slate-600 md:hidden [-webkit-overflow-scrolling:touch]">
        <a href="#menu" className="shrink-0 whitespace-nowrap">
          Menu
        </a>
        <a href="#reserve" className="shrink-0 whitespace-nowrap">
          Reserve
        </a>
        <a href="#hours" className="shrink-0 whitespace-nowrap">
          Hours
        </a>
      </nav>
    </motion.header>
  )
}
