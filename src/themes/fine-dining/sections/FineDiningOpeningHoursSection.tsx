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

export default function FineDiningOpeningHoursSection({ openingHours, restaurant }: OpeningHoursSectionProps) {
  const [todayKey, setTodayKey] = useState('')

  useEffect(() => {
    setTodayKey(WEEKDAY_KEYS[new Date().getDay()])
  }, [])

  return (
    <section id="hours" className="scroll-mt-24 border-t border-stone-800/40 bg-[#0c0a09] px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.45em] text-amber-200/70">Hours</p>
            <h2 className="mt-5 font-serif text-3xl font-medium text-stone-100 md:text-4xl">When we welcome you</h2>
            <ul className="mt-12 space-y-0 divide-y divide-stone-800/80 border-t border-stone-800/80">
              {DAYS_OF_WEEK.map((day) => {
                const h = openingHours.find((oh) => oh.day_of_week === day)
                const isToday = day === todayKey
                return (
                  <li
                    key={day}
                    className={`flex items-center justify-between gap-4 py-4 font-sans text-sm ${
                      isToday ? 'text-amber-100' : 'text-stone-400'
                    }`}
                  >
                    <span className="min-w-[7rem] uppercase tracking-[0.2em]">
                      {DAY_LABELS[day]}
                      {isToday && <span className="ml-2 text-[10px] text-amber-200/80">· today</span>}
                    </span>
                    {h?.is_closed ? (
                      <span className="text-stone-600">Closed</span>
                    ) : h ? (
                      <span className="tabular-nums text-stone-300">
                        {formatTime(h.open_time!)} — {formatTime(h.close_time!)}
                      </span>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="border border-stone-800/60 bg-stone-950/30 p-8 sm:p-10"
          >
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.45em] text-amber-200/70">Contact</p>
            <h3 className="mt-4 font-serif text-2xl text-stone-100">Visit & enquire</h3>
            <div className="mt-10 space-y-8 font-sans text-sm text-stone-400">
              {restaurant.address && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-stone-600">Address</p>
                  <p className="mt-2 leading-relaxed text-stone-300">
                    {restaurant.address}
                    {restaurant.city ? `, ${restaurant.city}` : ''}
                  </p>
                </div>
              )}
              {restaurant.phone && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-stone-600">Telephone</p>
                  <a href={`tel:${restaurant.phone}`} className="mt-2 block text-stone-200 transition-colors hover:text-amber-200">
                    {restaurant.phone}
                  </a>
                </div>
              )}
              {restaurant.email && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-stone-600">Email</p>
                  <a href={`mailto:${restaurant.email}`} className="mt-2 block text-amber-200/80 transition-colors hover:text-amber-100">
                    {restaurant.email}
                  </a>
                </div>
              )}
              {restaurant.website_url && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-stone-600">Web</p>
                  <a
                    href={restaurant.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-stone-400 transition-colors hover:text-stone-200"
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
