'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface VibeSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function LifestyleVibeSection({ restaurant }: VibeSectionProps) {
  if (!restaurant.description) return null

  return (
    <section className="border-y border-rose-100/80 bg-white/60 px-5 py-16 backdrop-blur-sm sm:px-8 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-400">The vibe</p>
        <p className="mt-6 font-sans text-lg leading-relaxed text-stone-600 sm:text-xl">{restaurant.description}</p>
      </motion.div>
    </section>
  )
}
