'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface AboutSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function FineDiningAboutSection({ restaurant }: AboutSectionProps) {
  if (!restaurant.description) return null

  return (
    <section className="border-t border-stone-800/40 bg-[#141110] px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        {restaurant.cover_image_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mb-16 max-w-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#141110] via-transparent to-transparent" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={restaurant.cover_image_url}
              alt={restaurant.name}
              className="max-h-[420px] w-full object-cover saturate-[0.7] contrast-[1.02]"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.45em] text-amber-200/70">The house</p>
          <h2 className="mt-6 font-serif text-3xl font-medium leading-tight text-stone-100 md:text-4xl">
            {restaurant.cuisine_type ? `${restaurant.cuisine_type} — an evening apart` : 'An evening apart'}
          </h2>
          <p className="mx-auto mt-10 max-w-2xl font-sans text-base leading-[1.85] text-stone-400 sm:text-lg">
            {restaurant.description}
          </p>
          <div className="mx-auto mt-12 h-px w-20 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <div className="mt-12">
            <a
              href="#menu"
              className="font-sans text-[11px] font-medium uppercase tracking-[0.35em] text-amber-200/80 transition-colors duration-500 hover:text-amber-100"
            >
              Continue to menu →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
