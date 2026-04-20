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
