'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { MenuCategoryWithItems } from '@/types/menu'

interface GallerySectionProps {
  theme: ThemeConfig
  categories: MenuCategoryWithItems[]
  coverImageUrl: string | null
}

export default function MinimalGallerySection({ categories, coverImageUrl }: GallerySectionProps) {
  const images = [coverImageUrl, ...categories.flatMap((c) => c.items.map((i) => i.image_url))]
    .filter(Boolean)
    .slice(0, 12) as string[]

  if (images.length < 4) return null

  return (
    <section className="border-t border-neutral-200 px-3 py-12 sm:px-5 sm:py-16">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-neutral-500"
      >
        Gallery
      </motion.h2>
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-1 sm:grid-cols-3">
        {images.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.2) }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="aspect-square w-full object-cover" loading="lazy" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
