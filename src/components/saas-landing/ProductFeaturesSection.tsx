'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Calendar, LayoutGrid, LineChart, UtensilsCrossed } from 'lucide-react'
import type { ProductFeature } from '@/lib/data/saas-landing-dummy'

const iconMap = {
  layout: LayoutGrid,
  calendar: Calendar,
  utensils: UtensilsCrossed,
  lineChart: LineChart,
} as const

type Props = {
  features: ProductFeature[]
}

export function ProductFeaturesSection({ features }: Props) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="border-y border-stone-200 bg-white py-16 md:py-20" aria-labelledby="product-features-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-amber-800/90">The product</p>
          <h2 id="product-features-heading" className="mt-3 font-sans text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Everything you run the house with
          </h2>
          <p className="mt-3 font-sans text-stone-600">
            One login. Your data stays in your restaurant — not spread across five apps.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const Icon = iconMap[f.icon]
            return (
              <motion.article
                key={f.title}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: reduceMotion ? 0 : i * 0.05 }}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                className="rounded-2xl border border-stone-200/90 bg-stone-50/80 p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-amber-400">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-4 font-sans text-base font-semibold text-stone-900">{f.title}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-stone-600">{f.description}</p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
