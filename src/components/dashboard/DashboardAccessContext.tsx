'use client'

import { createContext, useContext } from 'react'
import type { DashboardAccessMode } from '@/lib/access/restaurant-access'

type DashboardAccessContextValue = {
  mode: DashboardAccessMode
  /** True when owner can view but not mutate (expired trial/subscription). */
  isReadOnly: boolean
}

const DashboardAccessContext = createContext<DashboardAccessContextValue>({
  mode: 'full',
  isReadOnly: false,
})

export function DashboardAccessProvider({
  mode,
  children,
}: {
  mode: DashboardAccessMode
  children: React.ReactNode
}) {
  const isReadOnly = mode === 'readonly'
  return (
    <DashboardAccessContext.Provider value={{ mode, isReadOnly }}>{children}</DashboardAccessContext.Provider>
  )
}

export function useDashboardAccess() {
  return useContext(DashboardAccessContext)
}
