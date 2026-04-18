'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { SaasMenuCategory } from '@/lib/data/saas-landing-dummy'
import { cn } from '@/lib/utils'

type Props = {
  categories: SaasMenuCategory[]
  eyebrow: string
  title: string
  description: string
}

export function MenuSection({ categories, eyebrow, title, description }: Props) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '')
  const reduceMotion = useReducedMotion()
  const active = categories.find((c) => c.id === activeId) ?? categories[0]

  return (
    <section
      id="guest-experience"
      className="scroll-mt-24 bg-stone-50 py-16 md:py-24"
      aria-labelledby="menu-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-amber-700/90">{eyebrow}</p>
          <h2 id="menu-heading" className="mt-3 font-serif text-3xl font-semibold text-stone-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 font-sans text-stone-600">{description}</p>
        </motion.div>

        <div
          className="mt-10 flex flex-wrap justify-center gap-2 border-b border-stone-200/80 pb-4"
          role="tablist"
          aria-label="Menu categories"
        >
          {categories.map((cat) => {
            const isActive = cat.id === active?.id
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(cat.id)}
                className={cn(
                  'relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors min-h-[44px]',
                  isActive
                    ? 'text-stone-900'
                    : 'text-stone-500 hover:text-stone-800'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="menu-tab"
                    className="absolute inset-0 rounded-full bg-stone-900"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={cn('relative z-10', isActive ? 'text-white' : 'text-stone-600')}>{cat.name}</span>
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              role="tabpanel"
            >
              {active.items.map((item, i) => (
                <motion.article
                  key={item.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: reduceMotion ? 0 : i * 0.05, duration: 0.35 }}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-lg font-semibold text-stone-900">{item.name}</h3>
                      <span className="shrink-0 font-sans text-sm font-semibold text-amber-800">{item.price}</span>
                    </div>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-stone-600">{item.description}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
