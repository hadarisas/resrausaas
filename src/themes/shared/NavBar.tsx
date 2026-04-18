'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? `${theme.navScrolledBg} shadow-sm backdrop-blur-sm` : 'bg-transparent'
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={restaurantName} className="h-9 w-auto object-contain" />
        ) : (
          <span
            className={`text-lg font-semibold ${theme.heading} transition-colors duration-300 ${
              scrolled ? theme.text : 'text-white'
            }`}
          >
            {restaurantName}
          </span>
        )}

        <nav
          className={`hidden gap-8 text-sm sm:flex transition-colors duration-300 ${
            scrolled ? theme.textMuted : 'text-white/70'
          }`}
        >
          <a href="#menu" className="transition-opacity hover:opacity-100 opacity-80">Menu</a>
          <a href="#reserve" className="transition-opacity hover:opacity-100 opacity-80">Reserve</a>
          <a href="#hours" className="transition-opacity hover:opacity-100 opacity-80">Hours</a>
        </nav>

        <a
          href="#reserve"
          className={`${theme.accent} ${theme.accentFg} ${theme.accentHover} rounded-full px-5 py-2 text-sm font-semibold transition-colors`}
        >
          Book a Table
        </a>
      </div>
    </motion.header>
  )
}
