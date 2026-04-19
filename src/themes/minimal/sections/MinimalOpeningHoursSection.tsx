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

export default function MinimalOpeningHoursSection({ openingHours, restaurant }: OpeningHoursSectionProps) {
  const [todayKey, setTodayKey] = useState('')

  useEffect(() => {
    setTodayKey(WEEKDAY_KEYS[new Date().getDay()])
  }, [])

  return (
    <section id="hours" className="scroll-mt-20 border-t border-neutral-200 px-5 py-16 sm:py-20">
      <div className="mx-auto grid max-w-2xl gap-12 sm:grid-cols-2 sm:gap-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-500">Hours</h2>
          <ul className="mt-6 space-y-3 text-sm">
            {DAYS_OF_WEEK.map((day) => {
              const h = openingHours.find((oh) => oh.day_of_week === day)
              const isToday = day === todayKey
              return (
                <li key={day} className="flex justify-between gap-4">
                  <span className={isToday ? 'font-medium text-neutral-900' : 'text-neutral-600'}>
                    {DAY_LABELS[day]}
                  </span>
                  {h?.is_closed ? (
                    <span className="text-neutral-400">Closed</span>
                  ) : h ? (
                    <span className="tabular-nums text-neutral-700">
                      {formatTime(h.open_time!)}–{formatTime(h.close_time!)}
                    </span>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-500">Contact</h2>
          <div className="mt-6 space-y-4 text-sm text-neutral-600">
            {restaurant.address && (
              <p>
                {restaurant.address}
                {restaurant.city ? `, ${restaurant.city}` : ''}
              </p>
            )}
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`} className="block text-neutral-900 hover:underline">
                {restaurant.phone}
              </a>
            )}
            {restaurant.email && (
              <a href={`mailto:${restaurant.email}`} className="block hover:underline">
                {restaurant.email}
              </a>
            )}
            {restaurant.website_url && (
              <a
                href={restaurant.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block break-all hover:underline"
              >
                {restaurant.website_url.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
