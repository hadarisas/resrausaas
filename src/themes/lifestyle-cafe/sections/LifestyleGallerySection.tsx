'use client'
import { motion } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { MenuCategoryWithItems } from '@/types/menu'

interface GallerySectionProps {
  theme: ThemeConfig
  categories: MenuCategoryWithItems[]
  coverImageUrl: string | null
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVar = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

export default function LifestyleGallerySection({ categories, coverImageUrl }: GallerySectionProps) {
  const images = [coverImageUrl, ...categories.flatMap((c) => c.items.map((i) => i.image_url))]
    .filter(Boolean)
    .slice(0, 12) as string[]

  if (images.length < 4) return null

  return (
    <section id="gallery" className="scroll-mt-20 bg-[#fef7f7] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-sans text-2xl font-semibold tracking-tight text-stone-800 sm:text-3xl"
        >
          Moments &amp; mood
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-12 columns-2 gap-3 sm:columns-3 sm:gap-4"
        >
          {images.map((src, i) => (
            <motion.div
              key={i}
              variants={itemVar}
              className="mb-3 break-inside-avoid overflow-hidden rounded-3xl bg-white shadow-md shadow-rose-900/5 ring-1 ring-rose-100/80"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="w-full cursor-pointer object-cover transition-[transform,filter] duration-500 ease-out hover:scale-[1.04] hover:saturate-110"
                loading={i < 4 ? 'eager' : 'lazy'}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
