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

export default function MinimalMenuSection({ categories }: MenuSectionProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '')

  if (!categories.length) return null

  const activeCat = categories.find((c) => c.id === activeId) ?? categories[0]

  return (
    <section id="menu" className="scroll-mt-20 border-t border-neutral-200 px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-xl">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center text-xs font-medium uppercase tracking-[0.2em] text-neutral-500"
        >
          Menu
        </motion.h2>

        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 border-b border-neutral-200 pb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveId(cat.id)}
              className={`text-sm font-medium transition-colors ${
                cat.id === activeId ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {activeCat?.description && (
              <p className="mb-8 text-center text-sm text-neutral-500">{activeCat.description}</p>
            )}
            <ul className="divide-y divide-neutral-200">
              {activeCat?.items.map((item) => (
                <li key={item.id} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                  <div>
                    <span className="text-base font-medium text-neutral-900">{item.name}</span>
                    {item.description && <p className="mt-1 text-sm text-neutral-500">{item.description}</p>}
                  </div>
                  <span className="shrink-0 text-sm tabular-nums text-neutral-900">{formatCurrency(item.price)}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
