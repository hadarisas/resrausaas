'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface HeroSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function FastFoodHeroSection({ theme, restaurant }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-[4.25rem]">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-orange-500 to-amber-400" />
      <div className="absolute inset-0 opacity-30 mix-blend-overlay">
        <div className="h-full w-full bg-[repeating-linear-gradient(135deg,transparent,transparent_12px,rgba(0,0,0,0.06)_12px,rgba(0,0,0,0.06)_24px)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:items-center sm:gap-10 sm:px-6 sm:py-14 lg:gap-16 lg:py-16">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="text-center sm:text-left"
        >
          {restaurant.cuisine_type && (
            <p className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
              {restaurant.cuisine_type}
            </p>
          )}
          <h1 className="text-4xl font-black uppercase leading-[1.05] tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl xl:text-7xl">
            {restaurant.name}
          </h1>
          {restaurant.description && (
            <p className="mt-4 text-base font-medium leading-relaxed text-white/95 sm:text-lg">
              {restaurant.description}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <motion.div className="relative inline-flex w-full sm:w-auto" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <motion.span
                className="absolute -inset-1 rounded-2xl bg-yellow-300/50 blur-md"
                animate={{ opacity: [0.45, 0.85, 0.45] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <a
                href="#reserve"
                className={`relative inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl px-10 py-3.5 text-center text-base font-black uppercase tracking-wide shadow-xl sm:min-w-[220px] ${theme.accent} ${theme.accentFg} ${theme.accentHover}`}
              >
                Reserve now
              </a>
            </motion.div>
            <a
              href="#menu"
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl border-4 border-white bg-white/10 px-8 py-3.5 text-center text-base font-black uppercase tracking-wide text-white backdrop-blur-sm transition-transform duration-200 hover:scale-105 hover:bg-white/20 active:scale-95 sm:w-auto"
            >
              See the menu
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.08 }}
          className="relative mx-auto w-full max-w-lg sm:max-w-none"
        >
          <div className="absolute -right-2 -top-2 h-24 w-24 rounded-full bg-yellow-300/80 blur-2xl" />
          <div className="absolute -bottom-4 -left-2 h-20 w-20 rounded-full bg-red-500/60 blur-2xl" />
          {restaurant.cover_image_url ? (
            <div className="relative rotate-2 overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl shadow-red-900/40 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={restaurant.cover_image_url}
                alt=""
                className="aspect-[5/4] w-full object-cover saturate-125"
              />
            </div>
          ) : (
            <div className="flex aspect-[5/4] items-center justify-center rounded-[2rem] border-4 border-dashed border-white/50 bg-white/10 text-sm font-bold text-white">
              Add a cover photo in settings
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
