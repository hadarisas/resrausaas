'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ThemeConfig } from '@/themes/shared/theme-config'

interface StickyReserveCTAProps {
  theme: ThemeConfig
  enabled?: boolean
}

export default function FastFoodStickyReserveCTA({ theme, enabled = true }: StickyReserveCTAProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.35)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] md:hidden"
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        >
          <div className="border-t-4 border-yellow-400 bg-neutral-900/95 px-3 pt-2 shadow-2xl backdrop-blur-sm">
            <div className="flex gap-2">
              <a
                href="#menu"
                className={`flex min-h-[52px] items-center justify-center rounded-xl border-2 border-yellow-400 bg-yellow-400 text-sm font-black uppercase tracking-wide text-neutral-900 transition-transform active:scale-95 ${enabled ? 'flex-1' : 'w-full'}`}
              >
                Menu
              </a>
              {enabled && (
                <a
                  href="#reserve"
                  className={`flex min-h-[52px] flex-[2] items-center justify-center rounded-xl text-sm font-black uppercase tracking-wide shadow-lg transition-transform active:scale-95 ${theme.accent} ${theme.accentFg}`}
                >
                  Reserve now
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
