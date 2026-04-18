'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from './theme-config'
import type { MenuCategoryWithItems } from '@/types/menu'

interface GallerySectionProps {
  theme: ThemeConfig
  categories: MenuCategoryWithItems[]
  coverImageUrl: string | null
}

export default function GallerySection({ theme, categories, coverImageUrl }: GallerySectionProps) {
  const images = [
    coverImageUrl,
    ...categories.flatMap((c) => c.items.map((i) => i.image_url)),
  ]
    .filter(Boolean)
    .slice(0, 12) as string[]

  if (images.length < 4) return null

  return (
    <section className={`${theme.bg} px-6 py-24`}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`mb-2 text-xs uppercase tracking-[0.4em] ${theme.textMuted}`}
          >
            Gallery
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-4xl font-bold ${theme.heading} ${theme.text}`}
          >
            A Taste of What Awaits
          </motion.h2>
        </div>

        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
          {images.map((src, i) => (
            <motion.div
              key={i}
              className="mb-3 break-inside-avoid overflow-hidden rounded-xl"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
