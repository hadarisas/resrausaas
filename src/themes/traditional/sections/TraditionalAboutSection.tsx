'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface AboutSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function TraditionalAboutSection({ restaurant }: AboutSectionProps) {
  if (!restaurant.description) return null

  return (
    <section id="heritage" className="scroll-mt-24 border-t border-stone-300/50 bg-[#ebe3d8] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div
            className="pointer-events-none absolute -inset-4 rounded-sm bg-[#f3ece4] opacity-60 shadow-[inset_0_0_0_1px_rgba(124,106,88,0.12)] sm:-inset-8"
            aria-hidden
          />
          <div className="relative px-2 py-8 sm:px-8 sm:py-12">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.45em] text-[#7c6a58]">Our story</p>
            <h2 className="mt-6 font-serif text-3xl font-medium leading-snug text-stone-800 sm:text-4xl md:text-[2.35rem]">
              {restaurant.cuisine_type ? `Rooted in ${restaurant.cuisine_type.toLowerCase()} hospitality` : 'Rooted in hospitality'}
            </h2>
            <p className="mx-auto mt-8 max-w-2xl font-sans text-base leading-[1.9] text-stone-600 sm:text-lg">
              {restaurant.description}
            </p>
            {restaurant.cover_image_url && (
              <div className="mx-auto mt-12 max-w-xl overflow-hidden rounded-sm border border-stone-300/80 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={restaurant.cover_image_url}
                  alt=""
                  className="aspect-[16/10] w-full object-cover saturate-[0.9]"
                />
              </div>
            )}
            <div className="mx-auto mt-12 h-px w-24 bg-[#9c4c34]/35" />
            <a
              href="#menu"
              className="mt-8 inline-block font-sans text-sm font-medium text-[#9c4c34] underline-offset-4 transition-colors hover:text-[#863d28]"
            >
              Continue to the menu
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
