'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/themes/shared/theme-config'

interface PromoBarProps {
  theme: ThemeConfig
}

export default function FastFoodPromoBar({ theme }: PromoBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="border-y-4 border-red-600 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:px-6">
        <p className={cn('text-center text-sm font-black uppercase tracking-wide sm:text-left', theme.text)}>
          Combos & specials — grab something epic today
        </p>
        <a
          href="#menu"
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl bg-red-600 px-6 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          Jump to menu
        </a>
      </div>
    </motion.div>
  )
}
