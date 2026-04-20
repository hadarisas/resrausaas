'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'

interface StickyReserveCTAProps {
  theme: ThemeConfig
  enabled?: boolean
}

export default function TraditionalStickyReserveCTA({ theme, enabled = true }: StickyReserveCTAProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.45)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled])

  if (!enabled) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] md:hidden"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="border-t border-stone-600/50 bg-[#f3ece4]/95 px-4 pt-3 backdrop-blur-sm">
            <a
              href="#reserve"
              className={`flex min-h-[3rem] w-full items-center justify-center rounded-sm font-sans text-xs font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-90 ${theme.accent} ${theme.accentFg}`}
            >
              Reserve a table
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
