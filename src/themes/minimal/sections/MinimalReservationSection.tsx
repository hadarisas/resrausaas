import type { ThemeConfig } from '@/themes/shared/theme-config'
import PublicReservationForm from '@/themes/shared/PublicReservationForm'
import { PublicReservationPanel } from '@/themes/shared/PublicReservationPanel'

interface ReservationSectionProps {
  theme: ThemeConfig
  restaurantId: string
  maxPartySize: number
  reservationsEnabled: boolean
}

export default function MinimalReservationSection({
  theme,
  restaurantId,
  maxPartySize,
  reservationsEnabled,
}: ReservationSectionProps) {
  return (
    <section id="reserve" className={`scroll-mt-20 border-t border-neutral-200 px-5 py-16 sm:py-20 ${theme.reservationBg}`}>
      <div className="mx-auto max-w-md">
        <h2 className="text-center text-xl font-semibold text-neutral-900">Reserve</h2>
        <p className="mt-2 text-center text-sm text-neutral-500">We&apos;ll confirm by email.</p>
        <div className={`mt-10 rounded-lg border ${theme.border} bg-white p-6 sm:p-8`}>
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
