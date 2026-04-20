import type { ThemeConfig } from '@/themes/shared/theme-config'
import PublicReservationForm from '@/themes/shared/PublicReservationForm'
import { PublicReservationPanel } from '@/themes/shared/PublicReservationPanel'

interface ReservationSectionProps {
  theme: ThemeConfig
  restaurantId: string
  maxPartySize: number
  reservationsEnabled: boolean
}

export default function ModernReservationSection({
  theme,
  restaurantId,
  maxPartySize,
  reservationsEnabled,
}: ReservationSectionProps) {
  return (
    <section
      id="reserve"
      className={`scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8 ${theme.reservationBg}`}
    >
      <div className="mx-auto max-w-lg">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Reservations</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Book your table</h2>
          <p className="mt-3 text-slate-500">We&apos;ll confirm shortly by email.</p>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm sm:p-8">
          <PublicReservationPanel reservationsEnabled={reservationsEnabled} theme={theme}>
            <PublicReservationForm
              restaurantId={restaurantId}
              maxPartySize={maxPartySize}
              buttonClassName={theme.formButtonClass}
            />
          </PublicReservationPanel>
        </div>
      </div>
    </section>
  )
}
