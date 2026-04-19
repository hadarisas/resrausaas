'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { MenuCategoryWithItems } from '@/types/menu'
import { formatCurrency } from '@/lib/utils/format'

interface QuickPicksProps {
  theme: ThemeConfig
  categories: MenuCategoryWithItems[]
}

export default function FastFoodQuickPicksSection({ categories }: QuickPicksProps) {
  const flat = categories.flatMap((c) => c.items.map((item) => ({ item, categoryId: c.id, categoryName: c.name })))
  const featured = flat.filter(({ item }) => item.is_featured)
  const picks = (featured.length ? featured : flat).slice(0, 6)

  if (picks.length === 0) return null

  return (
    <section className="scroll-mt-24 bg-neutral-50 px-4 py-10 sm:px-6" aria-label="Popular picks">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-red-600">Fan favorites</p>
            <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-neutral-900 sm:text-4xl">
              Quick picks
            </h2>
          </div>
          <a
            href="#menu"
            className="text-sm font-bold text-red-600 underline-offset-4 transition hover:underline"
          >
            Full menu
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map(({ item, categoryName }, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.28, delay: i * 0.05 }}
              className="group overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <a href="#menu" className="block">
                <div className="relative aspect-[16/10] overflow-hidden bg-amber-100">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 saturate-125"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-bold text-amber-800/60">
                      {item.name}
                    </div>
                  )}
                  <span className="absolute left-2 top-2 rounded-md bg-yellow-400 px-2 py-0.5 text-[10px] font-black uppercase text-neutral-900 shadow-sm">
                    {categoryName}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-black leading-tight text-neutral-900">{item.name}</h3>
                    <span className="shrink-0 text-lg font-black text-red-600">{formatCurrency(item.price)}</span>
                  </div>
                  {item.description && (
                    <p className="mt-1 line-clamp-2 text-sm font-medium text-neutral-600">{item.description}</p>
                  )}
                </div>
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
