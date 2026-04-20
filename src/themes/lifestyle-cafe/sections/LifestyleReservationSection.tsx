import type { ThemeConfig } from '@/themes/shared/theme-config'
import PublicReservationForm from '@/themes/shared/PublicReservationForm'
import { PublicReservationPanel } from '@/themes/shared/PublicReservationPanel'

interface ReservationSectionProps {
  theme: ThemeConfig
  restaurantId: string
  maxPartySize: number
  reservationsEnabled: boolean
}

export default function LifestyleReservationSection({
  theme,
  restaurantId,
  maxPartySize,
  reservationsEnabled,
}: ReservationSectionProps) {
  return (
    <section id="reserve" className={`scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24 ${theme.reservationBg}`}>
      <div className="mx-auto max-w-lg">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">Visit</p>
          <h2 className="mt-3 font-sans text-3xl font-semibold text-stone-800 sm:text-4xl">Save your spot</h2>
          <p className="mt-3 text-sm text-stone-500">We&apos;ll confirm by email.</p>
        </div>
        <div
          className={`mt-10 rounded-3xl border border-rose-100/90 bg-white/95 p-6 shadow-xl shadow-rose-900/10 backdrop-blur-sm sm:p-8`}
        >
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
