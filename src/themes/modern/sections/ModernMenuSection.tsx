'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { MenuCategoryWithItems } from '@/types/menu'
import { formatCurrency } from '@/lib/utils/format'

interface MenuSectionProps {
  theme: ThemeConfig
  categories: MenuCategoryWithItems[]
}

export default function ModernMenuSection({ theme, categories }: MenuSectionProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '')

  if (!categories.length) return null

  const activeCat = categories.find((c) => c.id === activeId) ?? categories[0]

  return (
    <section id="menu" className="relative scroll-mt-24 bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Menu</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Crafted for sharing
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-500">
            Seasonal picks from our kitchen — swipe categories on mobile.
          </p>
        </motion.div>

        <div className="mb-12 flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveId(cat.id)}
              className={`min-h-[44px] rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                cat.id === activeId
                  ? `${theme.accent} ${theme.accentFg} shadow-lg shadow-orange-500/20`
                  : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            {activeCat?.description && (
              <p className="mb-10 text-center text-sm text-slate-500">{activeCat.description}</p>
            )}
            <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
              {activeCat?.items.map((item, i) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="group flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl"
                >
                  {item.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-24 w-24 shrink-0 rounded-xl object-cover ring-1 ring-slate-100 transition-transform duration-300 group-hover:scale-[1.03] sm:h-28 sm:w-28"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold leading-snug text-slate-900">{item.name}</h3>
                      <span className="shrink-0 text-sm font-bold tabular-nums text-orange-600">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
