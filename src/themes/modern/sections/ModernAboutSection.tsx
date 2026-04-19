'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface AboutSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function ModernAboutSection({ restaurant }: AboutSectionProps) {
  if (!restaurant.description) return null

  return (
    <section className="relative bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {restaurant.cover_image_url && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-orange-400/20 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl shadow-xl ring-1 ring-slate-200/80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={restaurant.cover_image_url}
                  alt={restaurant.name}
                  className="h-80 w-full object-cover transition-transform duration-700 hover:scale-[1.03] lg:h-[28rem]"
                />
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={!restaurant.cover_image_url ? 'mx-auto max-w-2xl text-center lg:col-span-2' : ''}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Our story</p>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {restaurant.cuisine_type
                ? `${restaurant.cuisine_type} — thoughtfully plated`
                : 'A culinary experience'}
            </h2>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">{restaurant.description}</p>
            <div className="mt-8">
              <a
                href="#menu"
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
              >
                Explore the menu
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
