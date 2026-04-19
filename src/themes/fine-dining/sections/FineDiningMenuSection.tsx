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

export default function FineDiningMenuSection({ categories }: MenuSectionProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '')

  if (!categories.length) return null

  const activeCat = categories.find((c) => c.id === activeId) ?? categories[0]

  return (
    <section id="menu" className="scroll-mt-24 border-t border-stone-800/40 bg-[#0c0a09] px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.45em] text-amber-200/70">Menu</p>
          <h2 className="mt-5 font-serif text-4xl font-medium tracking-tight text-stone-100 md:text-5xl">
            A la carte
          </h2>
          <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        </motion.div>

        <div className="mt-16 flex flex-wrap justify-center gap-x-10 gap-y-3 border-b border-stone-800/50 pb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveId(cat.id)}
              className={`min-h-[44px] font-sans text-[11px] font-medium uppercase tracking-[0.35em] transition-colors duration-500 ${
                cat.id === activeId ? 'text-amber-200' : 'text-stone-500 hover:text-stone-300'
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
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            {activeCat?.description && (
              <p className="mb-14 text-center font-sans text-sm leading-relaxed text-stone-500">{activeCat.description}</p>
            )}

            <ul className="space-y-0">
              {activeCat?.items.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-stone-800/60 py-8 first:pt-4"
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
                    <div className="flex min-w-0 flex-1 gap-5">
                      {item.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image_url}
                          alt=""
                          className="hidden h-20 w-20 shrink-0 object-cover opacity-90 saturate-[0.65] sm:block sm:h-24 sm:w-24"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-serif text-xl font-medium leading-snug text-stone-100 md:text-2xl">{item.name}</p>
                        {item.description && (
                          <p className="mt-3 font-sans text-sm leading-relaxed text-stone-500">{item.description}</p>
                        )}
                      </div>
                    </div>
                    <p className="shrink-0 font-serif text-lg tabular-nums text-amber-200/90 sm:pt-1 sm:text-xl">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
