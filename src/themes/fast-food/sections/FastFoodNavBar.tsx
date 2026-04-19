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

export default function FastFoodNavBar({ theme, restaurantName, logoUrl }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b-4 border-red-600 transition-shadow duration-200',
        scrolled ? 'bg-white shadow-lg shadow-red-600/10' : 'bg-white/95 shadow-md backdrop-blur-sm'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={restaurantName} className="h-10 w-auto max-w-[46%] object-contain sm:h-12" />
        ) : (
          <span className="truncate text-xl font-black uppercase tracking-tight text-neutral-900 sm:text-2xl">
            {restaurantName}
          </span>
        )}

        <nav className="hidden items-center gap-8 text-sm font-bold uppercase tracking-wide text-neutral-700 md:flex">
          <a href="#menu" className="transition-colors hover:text-red-600">
            Menu
          </a>
          <a href="#reserve" className="transition-colors hover:text-red-600">
            Reserve
          </a>
          <a href="#hours" className="transition-colors hover:text-red-600">
            Hours
          </a>
        </nav>

        <a
          href="#menu"
          className="hidden rounded-xl border-2 border-amber-400 bg-amber-400 px-4 py-2 text-xs font-black uppercase tracking-wide text-neutral-900 shadow-sm transition-transform duration-200 hover:scale-105 active:scale-95 md:inline-flex"
        >
          View menu
        </a>

        <a
          href="#reserve"
          className={cn(
            'rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-wide shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95',
            theme.accent,
            theme.accentFg,
            theme.accentHover
          )}
        >
          Book
        </a>
      </div>
    </motion.header>
  )
}
