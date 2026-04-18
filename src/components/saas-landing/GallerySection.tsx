'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import type { SaasGalleryImage } from '@/lib/data/saas-landing-dummy'

type Props = {
  images: SaasGalleryImage[]
  eyebrow: string
  title: string
  description: string
}

export function GallerySection({ images, eyebrow, title, description }: Props) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="bg-stone-950 py-16 md:py-24" aria-labelledby="gallery-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">{eyebrow}</p>
          <h2 id="gallery-heading" className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-lg font-sans text-stone-400">{description}</p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <motion.figure
              key={`${img.src}-${i}`}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.04 }}
              className="group overflow-hidden rounded-xl ring-1 ring-white/10"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
