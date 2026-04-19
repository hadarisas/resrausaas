'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { DashboardAccessMode } from '@/lib/access/restaurant-access'

export function AccessRedirect({ mode }: { mode: DashboardAccessMode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (mode === 'suspended' && pathname && !pathname.startsWith('/dashboard/suspended')) {
      router.replace('/dashboard/suspended')
    }
  }, [mode, pathname, router])

  return null
}

export function ReadonlyBanner({ mode }: { mode: DashboardAccessMode }) {
  if (mode !== 'readonly') return null

  return (
    <div className="mb-6 flex gap-3 rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50 via-amber-50 to-amber-100/40 px-4 py-4 text-sm text-amber-950 shadow-sm ring-1 ring-amber-100/80">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
      <div>
        <p className="font-semibold tracking-tight">Read-only mode</p>
        <p className="mt-1.5 leading-relaxed text-amber-950/90">
          Your trial or subscription has ended. You can view your dashboard, but changes and your public page are
          disabled until your plan is renewed. Contact support if you need help.
        </p>
      </div>
    </div>
  )
}
