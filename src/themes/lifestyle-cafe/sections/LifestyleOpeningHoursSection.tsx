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

export default function LifestyleOpeningHoursSection({ openingHours, restaurant }: OpeningHoursSectionProps) {
  const [todayKey, setTodayKey] = useState('')

  useEffect(() => {
    setTodayKey(WEEKDAY_KEYS[new Date().getDay()])
  }, [])

  return (
    <section id="hours" className="scroll-mt-20 bg-white px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">Hours</p>
          <h2 className="mt-3 font-sans text-2xl font-semibold text-stone-800 sm:text-3xl">When we&apos;re open</h2>
          <ul className="mt-8 space-y-2">
            {DAYS_OF_WEEK.map((day) => {
              const h = openingHours.find((oh) => oh.day_of_week === day)
              const isToday = day === todayKey
              return (
                <li
                  key={day}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm ${
                    isToday ? 'bg-rose-50 font-medium text-rose-800 ring-1 ring-rose-100' : 'text-stone-600'
                  }`}
                >
                  <span>{DAY_LABELS[day]}</span>
                  {h?.is_closed ? (
                    <span className="text-stone-400">Closed</span>
                  ) : h ? (
                    <span className="tabular-nums text-stone-700">
                      {formatTime(h.open_time!)} – {formatTime(h.close_time!)}
                    </span>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="rounded-3xl bg-[#fdf2f4] p-8 ring-1 ring-rose-100/80 sm:p-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">Find us</p>
          <h3 className="mt-3 font-sans text-xl font-semibold text-stone-800">Contact</h3>
          <div className="mt-6 space-y-4 text-sm text-stone-600">
            {restaurant.address && (
              <p>
                {restaurant.address}
                {restaurant.city ? `, ${restaurant.city}` : ''}
              </p>
            )}
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`} className="block font-medium text-stone-800 hover:text-rose-500">
                {restaurant.phone}
              </a>
            )}
            {restaurant.email && (
              <a href={`mailto:${restaurant.email}`} className="block text-rose-500 hover:underline">
                {restaurant.email}
              </a>
            )}
            {restaurant.website_url && (
              <a
                href={restaurant.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block break-all text-stone-600 hover:text-rose-500"
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
