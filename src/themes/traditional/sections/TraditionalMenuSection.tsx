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

export default function TraditionalMenuSection({ theme, categories }: MenuSectionProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '')

  if (!categories.length) return null

  const activeCat = categories.find((c) => c.id === activeId) ?? categories[0]

  return (
    <section
      id="menu"
      className={`scroll-mt-24 border-t border-stone-300/50 px-5 py-20 sm:px-8 sm:py-24 ${theme.bg}`}
    >
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center"
        >
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.4em] text-[#7c6a58]">The table</p>
          <h2 className="mt-4 font-serif text-3xl font-medium text-stone-800 sm:text-4xl">Menu</h2>
          <div className="mx-auto mt-6 h-px w-20 bg-stone-400/40" />
        </motion.div>

        <div className="mt-12 flex flex-wrap justify-center gap-6 border-b border-stone-300/60 pb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveId(cat.id)}
              className={`min-h-[44px] font-serif text-lg transition-colors duration-300 ${
                cat.id === activeId ? 'text-[#9c4c34]' : 'text-stone-500 hover:text-stone-700'
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
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            {activeCat?.description && (
              <p className="mb-10 text-center font-sans text-sm italic leading-relaxed text-stone-600">
                {activeCat.description}
              </p>
            )}

            <ul className="divide-y divide-stone-300/70">
              {activeCat?.items.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.65, delay: i * 0.04, ease: 'easeOut' }}
                  className="py-7"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-serif text-xl text-stone-800">{item.name}</span>
                        <span className="hidden flex-1 border-b border-dotted border-stone-400/50 sm:block" aria-hidden />
                      </div>
                      {item.description && (
                        <p className="mt-2 max-w-lg font-sans text-sm leading-relaxed text-stone-600">{item.description}</p>
                      )}
                    </div>
                    <span className="shrink-0 font-serif text-lg tabular-nums text-[#9c4c34] sm:pt-0.5 sm:text-right">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                  {item.image_url && (
                    <div className="mt-4 overflow-hidden rounded-sm border border-stone-300/60 sm:max-w-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image_url} alt="" className="aspect-[4/3] w-full object-cover saturate-[0.92]" />
                    </div>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
