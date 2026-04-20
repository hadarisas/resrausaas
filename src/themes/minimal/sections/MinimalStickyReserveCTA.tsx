'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'

interface StickyReserveCTAProps {
  theme: ThemeConfig
  enabled?: boolean
}

export default function MinimalStickyReserveCTA({ theme, enabled = true }: StickyReserveCTAProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled])

  if (!enabled) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm sm:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="mx-auto max-w-lg px-4 py-3">
            <a
              href="#reserve"
              className={`flex min-h-[48px] w-full items-center justify-center rounded-md text-sm font-medium ${theme.accent} ${theme.accentFg} ${theme.accentHover}`}
            >
              Reserve
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
