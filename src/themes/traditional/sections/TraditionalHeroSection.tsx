'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface HeroSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function TraditionalHeroSection({ theme, restaurant }: HeroSectionProps) {
  return (
    <section id="our-story" className="relative min-h-[min(92dvh,820px)] overflow-hidden pt-20 scroll-mt-24">
      {restaurant.cover_image_url ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={restaurant.cover_image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover saturate-[0.88] contrast-[0.98]"
          />
          <div className={`absolute inset-0 ${theme.heroOverlay}`} />
        </>
      ) : (
        <div className={`absolute inset-0 ${theme.bgAlt}`} />
      )}

      <div className="relative mx-auto max-w-3xl px-5 py-16 sm:px-8 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          {restaurant.cuisine_type && (
            <p className="mb-4 font-sans text-[11px] font-medium uppercase tracking-[0.4em] text-[#e8dfd4]/90">
              {restaurant.cuisine_type}
            </p>
          )}
          <h1 className="font-serif text-4xl font-medium leading-[1.15] tracking-tight text-[#fdf8f3] sm:text-5xl md:text-6xl">
            {restaurant.name}
          </h1>
          {restaurant.description && (
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-[#e8dfd4]/95 sm:text-lg">
              {restaurant.description}
            </p>
          )}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#reserve"
              className={`inline-flex min-h-[46px] items-center justify-center rounded-sm px-8 py-2.5 text-xs font-medium uppercase tracking-[0.2em] transition-opacity duration-300 hover:opacity-90 ${theme.accent} ${theme.accentFg}`}
            >
              Request a table
            </a>
            <a
              href="#menu"
              className="inline-flex min-h-[46px] items-center justify-center border border-[#fdf8f3]/40 bg-transparent px-8 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-[#fdf8f3] transition-colors duration-300 hover:bg-[#fdf8f3]/10"
            >
              See the menu
            </a>
          </div>
          <div className="mt-14 h-px max-w-xs bg-gradient-to-r from-[#c4a574]/70 to-transparent" aria-hidden />
        </motion.div>
      </div>
    </section>
  )
}
