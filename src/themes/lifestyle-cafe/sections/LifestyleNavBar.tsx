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

export default function LifestyleNavBar({ theme, restaurantName, logoUrl }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,box-shadow] duration-500',
        scrolled ? `${theme.navScrolledBg} border-b border-rose-100/80 shadow-sm backdrop-blur-md` : 'bg-transparent'
      )}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={restaurantName} className="h-9 w-auto max-w-[48%] rounded-full object-cover sm:h-10" />
        ) : (
          <span
            className={cn(
              'font-sans text-lg font-semibold tracking-tight',
              scrolled ? 'text-stone-800' : 'text-white drop-shadow-md'
            )}
          >
            {restaurantName}
          </span>
        )}

        <nav
          className={cn(
            'hidden items-center gap-8 text-sm font-medium sm:flex',
            scrolled ? 'text-stone-600' : 'text-white/90'
          )}
        >
          <a href="#gallery" className="transition-colors hover:text-rose-300">
            Gallery
          </a>
          <a href="#menu" className="transition-colors hover:text-rose-300">
            Menu
          </a>
          <a href="#reserve" className="transition-colors hover:text-rose-300">
            Visit
          </a>
        </nav>

        <a
          href="#reserve"
          className={cn(
            'rounded-full px-5 py-2 text-sm font-semibold shadow-lg shadow-rose-900/10 transition-transform duration-300 hover:scale-[1.03]',
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
