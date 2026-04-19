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

export default function FastFoodMenuSection({ theme, categories }: MenuSectionProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '')

  if (!categories.length) return null

  const activeCat = categories.find((c) => c.id === activeId) ?? categories[0]

  return (
    <section id="menu" className="scroll-mt-24 bg-white px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <p className="text-xs font-black uppercase tracking-[0.35em] text-red-600">The menu</p>
          <h2 className="mt-2 text-4xl font-black uppercase tracking-tight text-neutral-900 sm:text-5xl">
            Order your favorites
          </h2>
        </motion.div>

        <div className="mt-10 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveId(cat.id)}
              className={`min-h-[48px] shrink-0 snap-center rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-wide transition-transform duration-200 active:scale-95 ${
                cat.id === activeId
                  ? `${theme.accent} ${theme.accentFg} shadow-lg scale-105`
                  : 'border-2 border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-red-300'
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
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            {activeCat?.description && (
              <p className="mb-8 text-center text-sm font-medium text-neutral-600">{activeCat.description}</p>
            )}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {activeCat?.items.map((item, i) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="overflow-hidden rounded-2xl border-2 border-neutral-100 bg-white shadow-lg"
                >
                  <div className="relative aspect-[16/11] overflow-hidden bg-amber-50">
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover saturate-125 transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 text-4xl font-black text-orange-300/80">
                        {item.name.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-black text-neutral-900">{item.name}</h3>
                      <span className="shrink-0 text-xl font-black text-red-600">{formatCurrency(item.price)}</span>
                    </div>
                    {item.description && <p className="mt-2 text-sm font-medium text-neutral-600">{item.description}</p>}
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
