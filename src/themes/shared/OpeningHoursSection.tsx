'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { ThemeConfig } from './theme-config'
import type { OpeningHour, Restaurant } from '@/types/restaurant'
import { DAYS_OF_WEEK, DAY_LABELS } from '@/types/restaurant'
import { formatTime } from '@/lib/utils/format'

interface OpeningHoursSectionProps {
  theme: ThemeConfig
  openingHours: OpeningHour[]
  restaurant: Restaurant
}

const WEEKDAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export default function OpeningHoursSection({ theme, openingHours, restaurant }: OpeningHoursSectionProps) {
  const [todayKey, setTodayKey] = useState('')

  useEffect(() => {
    setTodayKey(WEEKDAY_KEYS[new Date().getDay()])
  }, [])

  return (
    <section id="hours" className={`${theme.bg} px-6 py-24`}>
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-14 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className={`mb-2 text-xs uppercase tracking-[0.4em] ${theme.textMuted}`}>When to Visit</p>
            <h2 className={`mb-8 text-3xl font-bold ${theme.heading} ${theme.text}`}>Opening Hours</h2>
            <div className="space-y-2">
              {DAYS_OF_WEEK.map((day) => {
                const h = openingHours.find((oh) => oh.day_of_week === day)
                const isToday = day === todayKey
                return (
                  <div
                    key={day}
                    className={`flex items-center justify-between rounded-lg px-4 py-2.5 text-sm transition-colors ${
                      isToday
                        ? `${theme.accent} ${theme.accentFg}`
                        : `${theme.card} ${theme.text}`
                    }`}
                  >
                    <span className={`font-medium ${isToday ? 'opacity-100' : theme.textMuted}`}>
                      {DAY_LABELS[day]}
                      {isToday && <span className="ml-2 text-xs opacity-70">(today)</span>}
                    </span>
                    {h?.is_closed ? (
                      <span className={isToday ? 'opacity-70' : theme.textMuted}>Closed</span>
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className={`mb-2 text-xs uppercase tracking-[0.4em] ${theme.textMuted}`}>Come Find Us</p>
            <h2 className={`mb-8 text-3xl font-bold ${theme.heading} ${theme.text}`}>Contact</h2>
            <div className={`space-y-4 text-sm ${theme.text}`}>
              {restaurant.address && (
                <div>
                  <p className={`mb-0.5 text-xs uppercase tracking-wider ${theme.textMuted}`}>Address</p>
                  <p>{restaurant.address}{restaurant.city ? `, ${restaurant.city}` : ''}</p>
                </div>
              )}
              {restaurant.phone && (
                <div>
                  <p className={`mb-0.5 text-xs uppercase tracking-wider ${theme.textMuted}`}>Phone</p>
                  <a href={`tel:${restaurant.phone}`} className="hover:underline underline-offset-2">
                    {restaurant.phone}
                  </a>
                </div>
              )}
              {restaurant.email && (
                <div>
                  <p className={`mb-0.5 text-xs uppercase tracking-wider ${theme.textMuted}`}>Email</p>
                  <a href={`mailto:${restaurant.email}`} className={`hover:underline underline-offset-2 ${theme.textMuted}`}>
                    {restaurant.email}
                  </a>
                </div>
              )}
              {restaurant.website_url && (
                <div>
                  <p className={`mb-0.5 text-xs uppercase tracking-wider ${theme.textMuted}`}>Website</p>
                  <a
                    href={restaurant.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hover:underline underline-offset-2 ${theme.textMuted}`}
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
