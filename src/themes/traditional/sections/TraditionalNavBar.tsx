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

export default function TraditionalNavBar({ theme, restaurantName, logoUrl }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[background,backdrop-filter] duration-500',
        scrolled ? `${theme.navScrolledBg} border-stone-300/60 shadow-sm backdrop-blur-sm` : 'border-transparent bg-transparent'
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={restaurantName} className="h-9 w-auto max-w-[50%] object-contain opacity-95 sm:h-10" />
        ) : (
          <span
            className={cn(
              'font-serif text-xl font-medium tracking-wide sm:text-2xl',
              scrolled ? 'text-stone-800' : 'text-[#fdf8f3]'
            )}
          >
            {restaurantName}
          </span>
        )}

        <nav
          className={cn(
            'hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.25em] md:flex',
            scrolled ? 'text-stone-600' : 'text-[#fdf8f3]/90'
          )}
        >
          <a href="#our-story" className="transition-colors hover:text-[#9c4c34]">
            Welcome
          </a>
          <a href="#menu" className="transition-colors hover:text-[#9c4c34]">
            Menu
          </a>
          <a href="#reserve" className="transition-colors hover:text-[#9c4c34]">
            Visit
          </a>
          <a href="#hours" className="transition-colors hover:text-[#9c4c34]">
            Hours
          </a>
        </nav>

        <a
          href="#reserve"
          className={cn(
            'rounded-sm px-5 py-2 text-[11px] font-medium uppercase tracking-[0.2em] shadow-sm transition-transform duration-300 hover:scale-[1.02]',
            theme.accent,
            theme.accentFg,
            theme.accentHover
          )}
        >
          Reserve
        </a>
      </div>
    </motion.header>
  )
}
