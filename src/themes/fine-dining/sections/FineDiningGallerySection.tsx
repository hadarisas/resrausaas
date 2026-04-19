'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { MenuCategoryWithItems } from '@/types/menu'

interface GallerySectionProps {
  theme: ThemeConfig
  categories: MenuCategoryWithItems[]
  coverImageUrl: string | null
}

export default function FineDiningGallerySection({ categories, coverImageUrl }: GallerySectionProps) {
  const images = [coverImageUrl, ...categories.flatMap((c) => c.items.map((i) => i.image_url))]
    .filter(Boolean)
    .slice(0, 12) as string[]

  if (images.length < 4) return null

  return (
    <section className="border-t border-stone-800/40 bg-[#0c0a09] px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.45em] text-amber-200/70">Gallery</p>
          <h2 className="mt-5 font-serif text-3xl font-medium text-stone-100 md:text-4xl">From our kitchen</h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3 lg:grid-cols-4">
          {images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group relative aspect-[3/4] overflow-hidden bg-stone-900"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover transition-[transform,filter] duration-[800ms] ease-out group-hover:scale-[1.03] saturate-[0.65] group-hover:saturate-[0.85]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
