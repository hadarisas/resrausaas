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

export default function FineDiningNavBar({ theme, restaurantName, logoUrl }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const link = scrolled ? 'text-stone-400 hover:text-amber-200/90' : 'text-stone-300/90 hover:text-amber-100'

  return (
    <motion.header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[background,border-color,backdrop-filter] duration-700 ease-out',
        scrolled
          ? `${theme.navScrolledBg} border-stone-800/60 backdrop-blur-md`
          : 'border-transparent bg-transparent'
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={restaurantName}
            className={cn(
              'h-8 w-auto max-w-[45%] object-contain sm:h-9',
              !scrolled && 'brightness-110'
            )}
          />
        ) : (
          <span
            className={cn(
              'font-serif text-lg font-medium tracking-wide sm:text-xl',
              scrolled ? 'text-stone-200' : 'text-stone-100'
            )}
          >
            {restaurantName}
          </span>
        )}

        <nav className="hidden items-center gap-10 text-[11px] font-medium uppercase tracking-[0.35em] md:flex">
          <a href="#menu" className={cn('transition-colors duration-500', link)}>
            Menu
          </a>
          <a href="#reserve" className={cn('transition-colors duration-500', link)}>
            Reserve
          </a>
          <a href="#hours" className={cn('transition-colors duration-500', link)}>
            Hours
          </a>
        </nav>

        <a
          href="#reserve"
          className={cn(
            'hidden px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] shadow-lg shadow-black/20 transition-[transform,filter] duration-500 hover:scale-[1.02] md:inline-block',
            theme.accent,
            theme.accentFg,
            theme.accentHover
          )}
        >
          Book
        </a>

        <a
          href="#reserve"
          className={cn(
            'px-4 py-2 text-[10px] font-semibold uppercase tracking-widest md:hidden',
            theme.accent,
            theme.accentFg
          )}
        >
          Book
        </a>
      </div>
    </motion.header>
  )
}
