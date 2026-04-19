'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'

interface StickyReserveCTAProps {
  theme: ThemeConfig
}

export default function ModernStickyReserveCTA({ theme }: StickyReserveCTAProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] sm:hidden"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="border-t border-white/10 bg-white/90 px-4 pt-2 shadow-[0_-12px_40px_rgba(15,23,42,0.12)] backdrop-blur-lg">
            <a
              href="#reserve"
              className={`flex min-h-[3.25rem] w-full items-center justify-center rounded-2xl py-3.5 text-sm font-semibold shadow-lg transition-transform duration-200 active:scale-[0.98] ${theme.accent} ${theme.accentFg} ${theme.accentHover}`}
            >
              Reserve Now
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
