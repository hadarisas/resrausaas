'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

type Props = {
  brandName: string
  className?: string
}

export function SaasNav({ brandName, className }: Props) {
  const reduceMotion = useReducedMotion()
  const router = useRouter()
  const { user, loading } = useAuth()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'sticky top-0 z-40 border-b border-stone-800/60 bg-stone-950/85 backdrop-blur-md',
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-stone-100 transition-opacity hover:opacity-90">
          <UtensilsCrossed className="h-5 w-5 text-amber-400" aria-hidden />
          <span className="font-sans text-sm font-semibold tracking-tight sm:text-base">{brandName}</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Account">
          {loading ? (
            <div className="flex items-center gap-2" aria-hidden>
              <div className="h-10 w-20 animate-pulse rounded-lg bg-stone-800/80" />
              <div className="h-10 w-24 animate-pulse rounded-lg bg-stone-800/80" />
            </div>
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-stone-100 transition-colors hover:bg-stone-800/80 hover:text-white min-h-[44px] flex items-center"
              >
                Dashboard
              </Link>
              <Button
                type="button"
                variant="outline"
                onClick={() => void signOut()}
                className="min-h-[44px] border-stone-600 bg-transparent text-stone-200 hover:bg-stone-800 hover:text-white"
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-stone-300 transition-colors hover:text-white min-h-[44px] flex items-center"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-stone-950 shadow-sm transition hover:bg-amber-400 min-h-[44px] flex items-center"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  )
}
