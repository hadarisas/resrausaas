'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
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
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-medium">Read-only mode</p>
      <p className="mt-1 text-amber-900/90">
        Your trial or subscription has ended. You can view your dashboard, but changes and your public page are
        disabled until your plan is renewed. Contact support if you need help.
      </p>
    </div>
  )
}
