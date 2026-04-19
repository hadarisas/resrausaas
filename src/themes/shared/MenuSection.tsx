'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ThemeConfig } from './theme-config'
import type { MenuCategoryWithItems } from '@/types/menu'
import { formatCurrency } from '@/lib/utils/format'

interface MenuSectionProps {
  theme: ThemeConfig
  categories: MenuCategoryWithItems[]
}

export default function MenuSection({ theme, categories }: MenuSectionProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '')

  if (!categories.length) return null

  const activeCat = categories.find((c) => c.id === activeId) ?? categories[0]

  return (
    <section id="menu" className={`${theme.bg} px-6 py-24`}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`mb-2 text-xs uppercase tracking-[0.4em] ${theme.textMuted}`}
          >
            Explore
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-4xl font-bold ${theme.heading} ${theme.text}`}
          >
            Our Menu
          </motion.h2>
        </div>

        {/* Category tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveId(cat.id)}
              className={`min-h-[44px] rounded-full px-5 py-2.5 text-sm font-medium transition-all active:scale-[0.98] ${
                cat.id === activeId
                  ? `${theme.accent} ${theme.accentFg} shadow-md`
                  : `border ${theme.border} ${theme.textMuted} hover:opacity-90`
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            {activeCat?.description && (
              <p className={`mb-8 text-center text-sm ${theme.textMuted}`}>{activeCat.description}</p>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              {activeCat?.items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`group flex gap-4 rounded-2xl border ${theme.border} ${theme.card} p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md`}
                >
                  {item.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-24 w-24 shrink-0 rounded-xl object-cover shadow-inner sm:h-20 sm:w-20"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-semibold ${theme.text} ${theme.heading}`}>{item.name}</p>
                      <p className={`shrink-0 text-sm font-bold ${theme.text}`}>
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    {item.description && (
                      <p className={`mt-1 text-sm ${theme.textMuted}`}>{item.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
