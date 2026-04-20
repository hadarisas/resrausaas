import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { ReactNode } from 'react'

interface PublicReservationPanelProps {
  reservationsEnabled: boolean
  theme: ThemeConfig
  children: ReactNode
}

/** Replaces the reservation form with a clear message when online bookings are disabled (e.g. read-only plan). */
export function PublicReservationPanel({
  reservationsEnabled,
  theme,
  children,
}: PublicReservationPanelProps) {
  if (!reservationsEnabled) {
    return (
      <div
        className={`rounded-3xl border ${theme.border} bg-white/90 p-8 text-center shadow-sm backdrop-blur-sm`}
      >
        <p className="font-semibold text-stone-900">Reservations temporarily unavailable</p>
        <p className="mt-2 text-sm text-stone-600">
          This restaurant is not currently accepting online reservations. Please contact them directly.
        </p>
      </div>
    )
  }
  return <>{children}</>
}
