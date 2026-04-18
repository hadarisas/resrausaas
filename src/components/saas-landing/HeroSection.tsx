'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

type HeroContent = {
  saasEyebrow: string
  saasHeadline: string
  saasSubheadline: string
  demoLabel: string
  demoVenueName: string
  demoVenueDescriptor: string
  heroImageUrl: string
}

type Props = {
  content: HeroContent
}

export function HeroSection({ content }: Props) {
  const reduceMotion = useReducedMotion()
  const c = content

  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden">
      <Image
        src={c.heroImageUrl}
        alt="Warm restaurant dining room — example imagery for a guest-facing page"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-stone-950/95 via-stone-950/80 to-stone-900/50"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,_rgba(251_191_36_/_0.12),_transparent)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:flex-row lg:items-center lg:gap-12 lg:pb-24">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl flex-1 lg:max-w-none"
        >
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/95">
            {c.saasEyebrow}
          </p>
          <h1 className="mt-4 font-sans text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[2.75rem] xl:text-6xl">
            {c.saasHeadline}
          </h1>
          <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-stone-300 sm:text-lg">
            {c.saasSubheadline}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <motion.div whileHover={reduceMotion ? undefined : { scale: 1.02 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
              <Link
                href="/signup"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-amber-500 px-8 py-3.5 text-center text-sm font-semibold text-stone-950 shadow-lg shadow-amber-500/25 transition-colors hover:bg-amber-400 sm:w-auto"
              >
                Start free
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </motion.div>
            <motion.a
              href="#guest-experience"
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-center text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 sm:w-auto"
            >
              See guest preview
            </motion.a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 shrink-0 text-amber-400/90" aria-hidden />
            <p className="font-sans text-sm text-stone-300">
              <span className="font-medium text-white">{c.demoLabel} · </span>
              <span className="font-serif text-lg text-amber-100/95">{c.demoVenueName}</span>
              <span className="text-stone-400"> — </span>
              {c.demoVenueDescriptor}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 w-full max-w-md shrink-0 lg:mt-0"
          aria-hidden
        >
          <div className="rounded-2xl border border-white/10 bg-stone-950/60 p-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-sans text-xs font-medium text-stone-400">TableFlow</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                Live
              </span>
            </div>
            <p className="mt-4 font-sans text-xs font-medium uppercase tracking-wider text-stone-500">Today</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                <p className="font-sans text-2xl font-semibold tabular-nums text-white">24</p>
                <p className="mt-1 font-sans text-xs text-stone-400">Covers</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                <p className="font-sans text-2xl font-semibold tabular-nums text-amber-400">3</p>
                <p className="mt-1 font-sans text-xs text-stone-400">Pending</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-2 w-full rounded-full bg-white/10">
                <div className="h-2 w-[68%] rounded-full bg-amber-500/80" />
              </div>
              <p className="font-sans text-xs text-stone-500">Weekly revenue vs. goal (illustrative)</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
