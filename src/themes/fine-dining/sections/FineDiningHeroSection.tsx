'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface HeroSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function FineDiningHeroSection({ theme, restaurant }: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0])

  return (
    <section ref={ref} className="relative min-h-[max(640px,100dvh)] overflow-hidden">
      {restaurant.cover_image_url ? (
        <motion.div style={{ y: imageY }} className="absolute inset-0 will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={restaurant.cover_image_url}
            alt=""
            className="h-[120%] w-full scale-105 object-cover saturate-[0.75] contrast-[1.05]"
          />
        </motion.div>
      ) : (
        <div className={`absolute inset-0 ${theme.bgAlt}`} />
      )}

      <div className={`absolute inset-0 ${theme.heroOverlay}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-black/30" />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative flex min-h-[max(640px,100dvh)] flex-col items-center justify-center px-6 pb-24 pt-28 text-center sm:px-10"
      >
        {restaurant.cuisine_type && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 font-sans text-[11px] font-medium uppercase tracking-[0.55em] text-amber-200/80"
          >
            {restaurant.cuisine_type}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl font-serif text-5xl font-medium leading-[1.08] tracking-tight text-stone-100 sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {restaurant.name}
        </motion.h1>

        {restaurant.description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.75, ease: 'easeOut' }}
            className="mx-auto mt-10 max-w-2xl font-sans text-base leading-relaxed text-stone-400 sm:text-lg"
          >
            {restaurant.description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.1, ease: 'easeOut' }}
          className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:gap-6"
        >
          <a
            href="#reserve"
            className={`inline-flex min-h-[48px] min-w-[200px] items-center justify-center px-10 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] transition-[transform,filter] duration-500 hover:scale-[1.02] ${theme.accent} ${theme.accentFg} ${theme.accentHover}`}
          >
            Reserve a table
          </a>
          <a
            href="#menu"
            className="text-[11px] font-medium uppercase tracking-[0.35em] text-stone-400 underline-offset-[10px] transition-colors duration-500 hover:text-amber-200/90 hover:underline"
          >
            View the menu
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2, duration: 1.5 }}
          className="absolute bottom-10 left-1/2 h-px w-16 -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"
          aria-hidden
        />
      </motion.div>
    </section>
  )
}
