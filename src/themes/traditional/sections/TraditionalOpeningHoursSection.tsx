'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { OpeningHour, Restaurant } from '@/types/restaurant'
import { DAYS_OF_WEEK, DAY_LABELS } from '@/types/restaurant'
import { formatTime } from '@/lib/utils/format'

interface OpeningHoursSectionProps {
  theme: ThemeConfig
  openingHours: OpeningHour[]
  restaurant: Restaurant
}

const WEEKDAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export default function TraditionalOpeningHoursSection({ theme, openingHours, restaurant }: OpeningHoursSectionProps) {
  const [todayKey, setTodayKey] = useState('')

  useEffect(() => {
    setTodayKey(WEEKDAY_KEYS[new Date().getDay()])
  }, [])

  return (
    <section id="hours" className={`scroll-mt-24 border-t border-stone-300/50 px-5 py-20 sm:px-8 sm:py-24 ${theme.bg}`}>
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-16 md:grid-cols-2 md:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          >
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.4em] text-[#7c6a58]">Hours</p>
            <h2 className="mt-3 font-serif text-2xl font-medium text-stone-800 sm:text-3xl">When we are open</h2>
            <ul className="mt-10 space-y-0 divide-y divide-stone-300/80 font-sans text-sm text-stone-700">
              {DAYS_OF_WEEK.map((day) => {
                const h = openingHours.find((oh) => oh.day_of_week === day)
                const isToday = day === todayKey
                return (
                  <li key={day} className="flex items-center justify-between gap-4 py-3.5">
                    <span className={isToday ? 'font-medium text-[#9c4c34]' : ''}>
                      {DAY_LABELS[day]}
                      {isToday && <span className="ml-2 text-xs text-stone-500">today</span>}
                    </span>
                    {h?.is_closed ? (
                      <span className="text-stone-500">Closed</span>
                    ) : h ? (
                      <span className="tabular-nums text-stone-600">
                        {formatTime(h.open_time!)} – {formatTime(h.close_time!)}
                      </span>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.08, ease: 'easeOut' }}
            className="border border-stone-300/70 bg-[#faf6f0]/80 p-8 shadow-sm sm:p-10"
          >
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.4em] text-[#7c6a58]">Find us</p>
            <h3 className="mt-3 font-serif text-xl text-stone-800">Contact</h3>
            <div className="mt-8 space-y-6 font-sans text-sm leading-relaxed text-stone-600">
              {restaurant.address && (
                <p>
                  {restaurant.address}
                  {restaurant.city ? `, ${restaurant.city}` : ''}
                </p>
              )}
              {restaurant.phone && (
                <a href={`tel:${restaurant.phone}`} className="block text-stone-800 transition-colors hover:text-[#9c4c34]">
                  {restaurant.phone}
                </a>
              )}
              {restaurant.email && (
                <a href={`mailto:${restaurant.email}`} className="block text-[#9c4c34] hover:underline">
                  {restaurant.email}
                </a>
              )}
              {restaurant.website_url && (
                <a
                  href={restaurant.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block break-all text-stone-700 hover:text-[#9c4c34]"
                >
                  {restaurant.website_url.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
