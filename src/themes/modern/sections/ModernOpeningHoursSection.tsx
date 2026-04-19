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

export default function ModernOpeningHoursSection({ theme, openingHours, restaurant }: OpeningHoursSectionProps) {
  const [todayKey, setTodayKey] = useState('')

  useEffect(() => {
    setTodayKey(WEEKDAY_KEYS[new Date().getDay()])
  }, [])

  return (
    <section id="hours" className="scroll-mt-24 bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Visit</p>
            <h2 className="mb-10 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Opening hours</h2>
            <div className="space-y-2">
              {DAYS_OF_WEEK.map((day) => {
                const h = openingHours.find((oh) => oh.day_of_week === day)
                const isToday = day === todayKey
                return (
                  <div
                    key={day}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-shadow ${
                      isToday
                        ? `${theme.accent} ${theme.accentFg} shadow-lg shadow-orange-500/25`
                        : 'border border-slate-200/90 bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span className={`font-medium ${isToday ? '' : 'text-slate-500'}`}>
                      {DAY_LABELS[day]}
                      {isToday && <span className="ml-2 text-xs opacity-80">Today</span>}
                    </span>
                    {h?.is_closed ? (
                      <span className={isToday ? 'opacity-90' : 'text-slate-400'}>Closed</span>
                    ) : h ? (
                      <span className="font-semibold tabular-nums">
                        {formatTime(h.open_time!)} – {formatTime(h.close_time!)}
                      </span>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-3xl border border-slate-200/90 bg-slate-50/80 p-8 shadow-inner backdrop-blur-sm"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Contact</p>
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Get in touch</h2>
            <div className="space-y-6 text-sm text-slate-700">
              {restaurant.address && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Address</p>
                  <p>
                    {restaurant.address}
                    {restaurant.city ? `, ${restaurant.city}` : ''}
                  </p>
                </div>
              )}
              {restaurant.phone && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Phone</p>
                  <a href={`tel:${restaurant.phone}`} className="font-medium text-slate-900 hover:text-orange-600">
                    {restaurant.phone}
                  </a>
                </div>
              )}
              {restaurant.email && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Email</p>
                  <a href={`mailto:${restaurant.email}`} className="font-medium text-orange-600 hover:underline">
                    {restaurant.email}
                  </a>
                </div>
              )}
              {restaurant.website_url && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Website</p>
                  <a
                    href={restaurant.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-slate-900 hover:text-orange-600"
                  >
                    {restaurant.website_url.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
