'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ThemeConfig } from './theme-config'

interface StickyReserveCTAProps {
  theme: ThemeConfig
}

export default function StickyReserveCTA({ theme }: StickyReserveCTAProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] sm:hidden"
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <a
            href="#reserve"
            className={`flex min-h-[3.25rem] w-full items-center justify-center rounded-t-2xl py-3.5 text-sm font-semibold shadow-[0_-8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md ${theme.accent} ${theme.accentFg} ${theme.accentHover} transition-colors active:opacity-90`}
          >
            Book a Table
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
