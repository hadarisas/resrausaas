'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface HeroSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export default function ModernHeroSection({ theme, restaurant }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-slate-50 pt-[4.5rem]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(249,115,22,0.12),transparent)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-8 sm:px-6 sm:pb-24 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:pt-12">
        <div className="order-2 flex flex-col justify-center lg:order-1">
          {restaurant.cuisine_type && (
            <motion.span
              {...fade(0)}
              className="mb-4 inline-flex w-fit rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-orange-700"
            >
              {restaurant.cuisine_type}
            </motion.span>
          )}

          <motion.h1
            {...fade(0.06)}
            className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            {restaurant.name}
          </motion.h1>

          {restaurant.description && (
            <motion.p
              {...fade(0.12)}
              className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg"
            >
              {restaurant.description}
            </motion.p>
          )}

          <motion.div
            {...fade(0.18)}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <a
              href="#reserve"
              className={`inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-center text-sm font-semibold shadow-lg shadow-orange-500/25 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] ${theme.accent} ${theme.accentFg} ${theme.accentHover}`}
            >
              Reserve Now
            </a>
            <a
              href="#menu"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:scale-[1.03] hover:border-slate-300 hover:shadow-md active:scale-[0.98]"
            >
              View menu
            </a>
          </motion.div>
        </div>

        <motion.div
          {...fade(0.1)}
          className="order-1 lg:order-2"
        >
          <div className="relative mx-auto max-w-lg lg:max-w-none">
            <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-orange-400/20 blur-3xl" />
            <div className="absolute -bottom-8 -left-4 h-32 w-32 rounded-full bg-slate-400/15 blur-2xl" />

            {restaurant.cover_image_url ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-200/80 sm:aspect-[5/6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={restaurant.cover_image_url}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
              </div>
            ) : (
              <div
                className={`flex aspect-[4/5] items-center justify-center rounded-3xl shadow-inner ring-1 ring-slate-200 sm:aspect-[5/6] ${theme.bgAlt}`}
              >
                <span className="text-sm font-medium text-slate-400">Add a cover image in settings</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
