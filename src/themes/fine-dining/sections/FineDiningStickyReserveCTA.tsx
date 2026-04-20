'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'

interface StickyReserveCTAProps {
  theme: ThemeConfig
  enabled?: boolean
}

export default function FineDiningStickyReserveCTA({ theme, enabled = true }: StickyReserveCTAProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.55)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled])

  if (!enabled) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] md:hidden"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="border-t border-stone-800/80 bg-[#0c0a09]/95 px-4 pt-3 backdrop-blur-md">
            <a
              href="#reserve"
              className={`flex min-h-[3.25rem] w-full items-center justify-center font-sans text-[11px] font-semibold uppercase tracking-[0.35em] shadow-lg shadow-black/30 transition-[transform,filter] duration-500 active:scale-[0.99] ${theme.accent} ${theme.accentFg} ${theme.accentHover}`}
            >
              Reserve a table
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
