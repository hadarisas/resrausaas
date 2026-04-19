'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from './theme-config'

interface NavBarProps {
  theme: ThemeConfig
  restaurantName: string
  logoUrl: string | null
}

export default function NavBar({ theme, restaurantName, logoUrl }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const desktopLink = scrolled ? theme.textMuted : 'text-white/70'
  const mobileRowBorder = scrolled ? `border-t ${theme.border}` : 'border-t border-white/15'
  const mobileLink = scrolled ? theme.textMuted : 'text-white/75'

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? `${theme.navScrolledBg} shadow-sm backdrop-blur-sm` : 'bg-transparent'
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 py-3 sm:py-4">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={restaurantName} className="h-9 w-auto max-w-[55%] object-contain sm:max-w-none" />
          ) : (
            <span
              className={`min-w-0 truncate text-lg font-semibold ${theme.heading} transition-colors duration-300 ${
                scrolled ? theme.text : 'text-white'
              }`}
            >
              {restaurantName}
            </span>
          )}

          <nav className={`hidden gap-8 text-sm sm:flex ${desktopLink}`}>
            <a href="#menu" className="transition-opacity hover:opacity-100 opacity-80">
              Menu
            </a>
            <a href="#reserve" className="transition-opacity hover:opacity-100 opacity-80">
              Reserve
            </a>
            <a href="#hours" className="transition-opacity hover:opacity-100 opacity-80">
              Hours
            </a>
          </nav>

          <a
            href="#reserve"
            className={`hidden shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold shadow-md shadow-black/10 transition-all sm:inline-flex ${theme.accent} ${theme.accentFg} ${theme.accentHover}`}
          >
            Book a Table
          </a>

          <a
            href="#reserve"
            className={`inline-flex shrink-0 items-center justify-center rounded-full px-4 py-2 text-xs font-semibold shadow-md shadow-black/15 transition-all sm:hidden ${theme.accent} ${theme.accentFg} ${theme.accentHover}`}
          >
            Book
          </a>
        </div>

        <nav
          className={cn(
            '-mx-4 flex gap-5 overflow-x-auto px-4 pb-3 pt-0 text-xs font-medium [-webkit-overflow-scrolling:touch] sm:hidden',
            mobileRowBorder,
            mobileLink
          )}
        >
          <a href="#menu" className="shrink-0 whitespace-nowrap opacity-90 transition-opacity hover:opacity-100">
            Menu
          </a>
          <a href="#reserve" className="shrink-0 whitespace-nowrap opacity-90 transition-opacity hover:opacity-100">
            Reserve
          </a>
          <a href="#hours" className="shrink-0 whitespace-nowrap opacity-90 transition-opacity hover:opacity-100">
            Hours
          </a>
        </nav>
      </div>
    </motion.header>
  )
}
