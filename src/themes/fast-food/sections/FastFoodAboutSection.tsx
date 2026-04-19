'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface AboutSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function FastFoodAboutSection({ restaurant }: AboutSectionProps) {
  if (!restaurant.description) return null

  return (
    <section className="border-y-4 border-red-600 bg-amber-50 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-xs font-black uppercase tracking-widest text-red-600">Why us</p>
          <h2 className="mt-2 text-3xl font-black uppercase text-neutral-900 sm:text-4xl">
            {restaurant.cuisine_type ? `${restaurant.cuisine_type} done right` : 'Flavor first'}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-neutral-700 sm:text-lg">
            {restaurant.description}
          </p>
          <a
            href="#menu"
            className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-red-600 px-8 py-3 text-sm font-black uppercase tracking-wide text-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            Browse menu
          </a>
        </motion.div>
      </div>
    </section>
  )
}
