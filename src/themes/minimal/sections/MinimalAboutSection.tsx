'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface AboutSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function MinimalAboutSection({ restaurant }: AboutSectionProps) {
  if (!restaurant.description) return null

  return (
    <section className="border-t border-neutral-200 px-5 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-xl text-center"
      >
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">About</p>
        <p className="mt-6 text-sm leading-relaxed text-neutral-600 sm:text-base">{restaurant.description}</p>
      </motion.div>
    </section>
  )
}
