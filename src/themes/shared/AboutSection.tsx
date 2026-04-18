'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from './theme-config'
import type { Restaurant } from '@/types/restaurant'

interface AboutSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function AboutSection({ theme, restaurant }: AboutSectionProps) {
  if (!restaurant.description) return null

  return (
    <section className={`${theme.bgAlt} px-6 py-24`}>
      <div className="mx-auto max-w-4xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {restaurant.cover_image_url && (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="overflow-hidden rounded-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={restaurant.cover_image_url}
                alt={restaurant.name}
                className="h-80 w-full object-cover lg:h-96"
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            className={!restaurant.cover_image_url ? 'lg:col-span-2 max-w-2xl mx-auto text-center' : ''}
          >
            <p className={`mb-3 text-xs uppercase tracking-[0.4em] ${theme.textMuted}`}>Our Story</p>
            <h2 className={`mb-5 text-3xl font-bold ${theme.heading} ${theme.text}`}>
              {restaurant.cuisine_type
                ? `${restaurant.cuisine_type} at Its Finest`
                : 'A Culinary Experience'}
            </h2>
            <p className={`text-base leading-relaxed ${theme.textMuted}`}>
              {restaurant.description}
            </p>
            <div className="mt-8">
              <a
                href="#menu"
                className={`inline-flex items-center gap-2 text-sm font-semibold ${theme.text} underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity`}
              >
                Explore our menu →
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
