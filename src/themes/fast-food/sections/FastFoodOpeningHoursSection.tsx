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

export default function FastFoodOpeningHoursSection({ openingHours, restaurant }: OpeningHoursSectionProps) {
  const [todayKey, setTodayKey] = useState('')

  useEffect(() => {
    setTodayKey(WEEKDAY_KEYS[new Date().getDay()])
  }, [])

  return (
    <section id="hours" className="scroll-mt-24 bg-white px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs font-black uppercase tracking-widest text-red-600">We&apos;re open</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-neutral-900 sm:text-4xl">Hours</h2>
            <ul className="mt-8 space-y-2">
              {DAYS_OF_WEEK.map((day) => {
                const h = openingHours.find((oh) => oh.day_of_week === day)
                const isToday = day === todayKey
                return (
                  <li
                    key={day}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold ${
                      isToday ? 'bg-red-600 text-white shadow-lg' : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <span>
                      {DAY_LABELS[day]}
                      {isToday && <span className="ml-2 text-xs font-black text-yellow-300">TODAY</span>}
                    </span>
                    {h?.is_closed ? (
                      <span className={isToday ? 'text-red-100' : 'text-neutral-500'}>Closed</span>
                    ) : h ? (
                      <span className="tabular-nums">
                        {formatTime(h.open_time!)} – {formatTime(h.close_time!)}
                      </span>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="rounded-3xl border-4 border-neutral-200 bg-amber-50 p-6 sm:p-8"
          >
            <p className="text-xs font-black uppercase tracking-widest text-red-600">Find us</p>
            <h3 className="mt-2 text-2xl font-black uppercase text-neutral-900">Contact</h3>
            <div className="mt-6 space-y-4 text-sm font-bold text-neutral-800">
              {restaurant.address && (
                <p>
                  {restaurant.address}
                  {restaurant.city ? `, ${restaurant.city}` : ''}
                </p>
              )}
              {restaurant.phone && (
                <a href={`tel:${restaurant.phone}`} className="block text-lg text-red-600 hover:underline">
                  {restaurant.phone}
                </a>
              )}
              {restaurant.email && (
                <a href={`mailto:${restaurant.email}`} className="block font-semibold text-neutral-700 hover:text-red-600">
                  {restaurant.email}
                </a>
              )}
              {restaurant.website_url && (
                <a
                  href={restaurant.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block break-all text-red-600 hover:underline"
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
