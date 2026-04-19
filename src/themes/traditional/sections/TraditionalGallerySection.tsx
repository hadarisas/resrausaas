'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { MenuCategoryWithItems } from '@/types/menu'

interface GallerySectionProps {
  theme: ThemeConfig
  categories: MenuCategoryWithItems[]
  coverImageUrl: string | null
}

export default function TraditionalGallerySection({ categories, coverImageUrl }: GallerySectionProps) {
  const images = [coverImageUrl, ...categories.flatMap((c) => c.items.map((i) => i.image_url))]
    .filter(Boolean)
    .slice(0, 12) as string[]

  if (images.length < 4) return null

  return (
    <section className="border-t border-stone-300/50 bg-[#e8dfd4] px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center font-serif text-2xl font-medium text-stone-800 sm:text-3xl"
        >
          From our kitchen &amp; room
        </motion.h2>
        <div className="mx-auto mt-6 h-px w-16 bg-stone-400/50" />

        <div className="mt-12 columns-2 gap-4 sm:columns-3 sm:gap-5">
          {images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.75, delay: i * 0.05, ease: 'easeOut' }}
              className="mb-4 break-inside-avoid overflow-hidden rounded-sm border border-stone-400/40 bg-[#f3ece4] p-1 shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full object-cover saturate-[0.9]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
