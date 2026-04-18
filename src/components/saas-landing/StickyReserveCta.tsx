'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function StickyReserveCta() {
  const { user, loading } = useAuth()
  const [hidden, setHidden] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const el = document.getElementById('guest-experience')
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHidden(entry.isIntersecting)
      },
      { threshold: 0.08, rootMargin: '0px 0px 0px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={reduceMotion ? false : { y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? undefined : { y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-800/80 bg-stone-950/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
        >
          <div className="mx-auto flex max-w-lg gap-3">
            <motion.div className="min-w-0 flex-1" whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
              {loading ? (
                <div
                  className="min-h-[48px] w-full animate-pulse rounded-full bg-stone-800/90"
                  aria-hidden
                />
              ) : user ? (
                <Link
                  href="/dashboard"
                  className="flex min-h-[48px] w-full items-center justify-center gap-1 rounded-full bg-amber-500 px-4 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-500/15"
                >
                  Open dashboard
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="flex min-h-[48px] w-full items-center justify-center gap-1 rounded-full bg-amber-500 px-4 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-500/15"
                >
                  Start free
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                </Link>
              )}
            </motion.div>
            <motion.a
              href="#guest-experience"
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="flex min-h-[48px] flex-1 items-center justify-center rounded-full border border-white/20 bg-transparent px-4 text-sm font-semibold text-white"
            >
              Guest preview
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
