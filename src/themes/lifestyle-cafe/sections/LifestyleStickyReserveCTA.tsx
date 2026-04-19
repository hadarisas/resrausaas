'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'

interface StickyReserveCTAProps {
  theme: ThemeConfig
}

export default function LifestyleStickyReserveCTA({ theme }: StickyReserveCTAProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.45)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] sm:hidden"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="border-t border-rose-100/80 bg-[#fef7f7]/95 px-4 pt-3 shadow-[0_-8px_30px_rgba(190,24,93,0.08)] backdrop-blur-md">
            <a
              href="#reserve"
              className={`flex min-h-[3rem] w-full items-center justify-center rounded-full text-sm font-semibold shadow-lg ${theme.accent} ${theme.accentFg} ${theme.accentHover}`}
            >
              Book a table
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
