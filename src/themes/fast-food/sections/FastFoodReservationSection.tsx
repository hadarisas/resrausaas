import type { ThemeConfig } from '@/themes/shared/theme-config'
import PublicReservationForm from '@/themes/shared/PublicReservationForm'
import { PublicReservationPanel } from '@/themes/shared/PublicReservationPanel'

interface ReservationSectionProps {
  theme: ThemeConfig
  restaurantId: string
  maxPartySize: number
  reservationsEnabled: boolean
}

export default function FastFoodReservationSection({
  theme,
  restaurantId,
  maxPartySize,
  reservationsEnabled,
}: ReservationSectionProps) {
  return (
    <section id="reserve" className={`scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16 ${theme.reservationBg}`}>
      <div className="mx-auto max-w-lg">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-300">Book a table</p>
          <h2 className="mt-2 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">Reserve in seconds</h2>
          <p className="mt-4 text-sm font-medium text-red-100">Tell us when — we&apos;ll confirm fast.</p>
        </div>

        <div className="mt-8 rounded-3xl border-4 border-yellow-400 bg-white p-6 shadow-2xl shadow-black/40 sm:p-8">
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
