'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from './theme-config'
import type { Restaurant } from '@/types/restaurant'

interface HeroSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' as const },
})

export default function HeroSection({ theme, restaurant }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[max(600px,100dvh)] flex-col overflow-hidden">
      {restaurant.cover_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={restaurant.cover_image_url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className={`absolute inset-0 ${theme.bgAlt}`} />
      )}

      <div className={`absolute inset-0 ${theme.heroOverlay}`} />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pb-[max(5rem,env(safe-area-inset-bottom))] pt-28 sm:px-16 sm:pb-24 lg:px-20">
        {restaurant.cuisine_type && (
          <motion.p
            {...fadeUp(0.1)}
            className="mb-3 text-xs uppercase tracking-[0.5em] text-white/60"
          >
            {restaurant.cuisine_type}
          </motion.p>
        )}

        <motion.h1
          {...fadeUp(0.25)}
          className={`text-5xl font-bold leading-tight text-white sm:text-7xl lg:text-8xl ${theme.heading}`}
        >
          {restaurant.name}
        </motion.h1>

        {restaurant.description && (
          <motion.p
            {...fadeUp(0.4)}
            className="mt-4 max-w-xl text-base leading-relaxed text-white/70"
          >
            {restaurant.description}
          </motion.p>
        )}

        <motion.div {...fadeUp(0.55)} className="mt-8 flex flex-wrap gap-3 sm:gap-4">
          <a
            href="#reserve"
            className={`${theme.accent} ${theme.accentFg} ${theme.accentHover} rounded-full px-8 py-3.5 text-sm font-semibold shadow-lg shadow-black/25 transition-colors`}
          >
            Book a Table
          </a>
          <a
            href="#menu"
            className="rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/80 hover:bg-white/10"
          >
            View Menu
          </a>
        </motion.div>
      </div>
    </section>
  )
}
