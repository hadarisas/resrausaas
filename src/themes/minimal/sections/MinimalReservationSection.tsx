import type { ThemeConfig } from '@/themes/shared/theme-config'
import PublicReservationForm from '@/themes/shared/PublicReservationForm'

interface ReservationSectionProps {
  theme: ThemeConfig
  restaurantId: string
  maxPartySize: number
}

export default function MinimalReservationSection({ theme, restaurantId, maxPartySize }: ReservationSectionProps) {
  return (
    <section id="reserve" className={`scroll-mt-20 border-t border-neutral-200 px-5 py-16 sm:py-20 ${theme.reservationBg}`}>
      <div className="mx-auto max-w-md">
        <h2 className="text-center text-xl font-semibold text-neutral-900">Reserve</h2>
        <p className="mt-2 text-center text-sm text-neutral-500">We&apos;ll confirm by email.</p>
        <div className={`mt-10 rounded-lg border ${theme.border} bg-white p-6 sm:p-8`}>
          <PublicReservationForm
            restaurantId={restaurantId}
            maxPartySize={maxPartySize}
            buttonClassName={theme.formButtonClass}
          />
        </div>
      </div>
    </section>
  )
}
