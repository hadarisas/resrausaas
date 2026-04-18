'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

type Props = {
  eyebrow: string
  title: string
  body: string
  imageUrl: string
  imageAlt: string
}

export function AboutSection({ eyebrow, title, body, imageUrl, imageAlt }: Props) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="bg-white py-16 md:py-24" aria-labelledby="about-heading">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] overflow-hidden rounded-2xl lg:aspect-square"
        >
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-stone-900/5 rounded-2xl" aria-hidden />
        </motion.div>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-amber-700/90">{eyebrow}</p>
          <h2 id="about-heading" className="mt-3 font-serif text-3xl font-semibold text-stone-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-6 font-sans text-base leading-relaxed text-stone-600 sm:text-lg">{body}</p>
        </motion.div>
      </div>
    </section>
  )
}
