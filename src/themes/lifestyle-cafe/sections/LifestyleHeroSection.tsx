'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface HeroSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function LifestyleHeroSection({ theme, restaurant }: HeroSectionProps) {
  return (
    <section className="relative min-h-[min(88dvh,760px)] overflow-hidden">
      {restaurant.cover_image_url ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={restaurant.cover_image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover saturate-[0.92]"
          />
          <div className={`absolute inset-0 ${theme.heroOverlay}`} />
        </>
      ) : (
        <div className={`absolute inset-0 ${theme.bgAlt}`} />
      )}

      <div className="relative flex min-h-[min(88dvh,760px)] flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-2xl text-center"
        >
          {restaurant.cuisine_type && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-white/85">{restaurant.cuisine_type}</p>
          )}
          <h1 className="font-sans text-4xl font-semibold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
            {restaurant.name}
          </h1>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href="#gallery"
              className="rounded-full border border-white/50 bg-white/15 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              Explore
            </a>
            <a
              href="#reserve"
              className={`rounded-full px-7 py-2.5 text-sm font-semibold shadow-lg ${theme.accent} ${theme.accentFg} ${theme.accentHover}`}
            >
              Reserve a table
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
