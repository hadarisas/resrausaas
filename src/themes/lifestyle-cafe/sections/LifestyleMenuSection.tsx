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

export default function LifestyleMenuSection({ theme, categories }: MenuSectionProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '')

  if (!categories.length) return null

  const activeCat = categories.find((c) => c.id === activeId) ?? categories[0]

  return (
    <section id="menu" className="scroll-mt-20 bg-[#fef7f7] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">Eat &amp; drink</p>
          <h2 className="mt-3 font-sans text-3xl font-semibold text-stone-800 sm:text-4xl">Menu</h2>
        </motion.div>

        <div className="mt-10 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveId(cat.id)}
              className={`snap-center shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                cat.id === activeId
                  ? `${theme.accent} ${theme.accentFg} shadow-md`
                  : 'bg-white/80 text-stone-600 shadow-sm ring-1 ring-rose-100 hover:ring-rose-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            {activeCat?.description && (
              <p className="mb-10 text-center text-sm text-stone-500">{activeCat.description}</p>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              {activeCat?.items.map((item, i) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.25) }}
                  className={`overflow-hidden rounded-3xl ${theme.card} shadow-lg shadow-rose-900/5 ring-1 ring-rose-100/90`}
                >
                  {item.image_url && (
                    <div className="aspect-[16/11] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.05]"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-sans text-lg font-semibold text-stone-800">{item.name}</h3>
                      <span className="shrink-0 text-sm font-semibold text-rose-500">{formatCurrency(item.price)}</span>
                    </div>
                    {item.description && <p className="mt-2 text-sm leading-relaxed text-stone-500">{item.description}</p>}
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
