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

export default function MinimalNavBar({ theme, restaurantName, logoUrl }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
        scrolled ? `${theme.navScrolledBg} border-neutral-200` : 'border-transparent bg-white/80 backdrop-blur-sm'
      )}
    >
      <motion.div
        className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={restaurantName} className="h-7 w-auto max-w-[40%] object-contain" />
        ) : (
          <span className="truncate text-sm font-medium tracking-tight text-neutral-900">{restaurantName}</span>
        )}

        <nav className="hidden items-center gap-8 text-sm text-neutral-600 sm:flex">
          <a href="#menu" className="transition-colors hover:text-neutral-900">
            Menu
          </a>
          <a href="#reserve" className="transition-colors hover:text-neutral-900">
            Reserve
          </a>
          <a href="#hours" className="transition-colors hover:text-neutral-900">
            Hours
          </a>
        </nav>

        <a
          href="#reserve"
          className={cn(
            'rounded-md px-4 py-2 text-xs font-medium transition-opacity hover:opacity-90',
            theme.accent,
            theme.accentFg,
            theme.accentHover
          )}
        >
          Book
        </a>
      </motion.div>
    </header>
  )
}
