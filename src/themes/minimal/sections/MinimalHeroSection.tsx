'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface HeroSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.45, ease: 'easeOut' as const },
}

export default function MinimalHeroSection({ theme, restaurant }: HeroSectionProps) {
  return (
    <section className="pt-20">
      {restaurant.cover_image_url && (
        <div className="relative w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={restaurant.cover_image_url}
            alt=""
            className="max-h-[min(52vh,480px)] w-full object-cover"
          />
          <div className={`absolute inset-0 ${theme.heroOverlay}`} />
        </div>
      )}

      <div className="mx-auto max-w-xl px-5 py-14 text-center sm:py-20">
        <motion.div {...fade}>
          {restaurant.cuisine_type && (
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">{restaurant.cuisine_type}</p>
          )}
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">{restaurant.name}</h1>
          {restaurant.description && (
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-neutral-600 sm:text-base">
              {restaurant.description}
            </p>
          )}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="#reserve"
              className={`inline-flex min-h-[44px] min-w-[140px] items-center justify-center rounded-md px-6 text-sm font-medium transition-opacity hover:opacity-90 ${theme.accent} ${theme.accentFg} ${theme.accentHover}`}
            >
              Reserve
            </a>
            <a
              href="#menu"
              className="inline-flex min-h-[44px] items-center justify-center text-sm font-medium text-neutral-900 underline-offset-4 transition-opacity hover:opacity-70"
            >
              View menu
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
