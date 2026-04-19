'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { MenuCategoryWithItems } from '@/types/menu'

interface GallerySectionProps {
  theme: ThemeConfig
  categories: MenuCategoryWithItems[]
  coverImageUrl: string | null
}

export default function FastFoodGallerySection({ categories, coverImageUrl }: GallerySectionProps) {
  const images = [coverImageUrl, ...categories.flatMap((c) => c.items.map((i) => i.image_url))]
    .filter(Boolean)
    .slice(0, 12) as string[]

  if (images.length < 4) return null

  return (
    <section className="bg-neutral-900 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="mb-8 text-center text-3xl font-black uppercase tracking-tight text-white sm:text-4xl"
        >
          Food gallery
        </motion.h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3 lg:grid-cols-4">
          {images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
              className="aspect-square overflow-hidden rounded-2xl border-4 border-yellow-400 bg-red-600/20"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover saturate-125" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
