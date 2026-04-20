import type { ThemeConfig } from '@/themes/shared/theme-config'
import PublicReservationForm from '@/themes/shared/PublicReservationForm'
import { PublicReservationPanel } from '@/themes/shared/PublicReservationPanel'

interface ReservationSectionProps {
  theme: ThemeConfig
  restaurantId: string
  maxPartySize: number
  reservationsEnabled: boolean
}

export default function FineDiningReservationSection({
  theme,
  restaurantId,
  maxPartySize,
  reservationsEnabled,
}: ReservationSectionProps) {
  return (
    <section id="reserve" className={`scroll-mt-24 border-t border-stone-800/40 px-5 py-24 sm:px-8 md:py-32 ${theme.reservationBg}`}>
      <div className="mx-auto max-w-lg">
        <div className="text-center">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.45em] text-amber-200/70">Reservations</p>
          <h2 className="mt-6 font-serif text-4xl font-medium text-stone-100 md:text-5xl">Join us</h2>
          <p className="mx-auto mt-6 max-w-md font-sans text-sm leading-relaxed text-stone-500">
            Share your preferred date and time — we will confirm by email.
          </p>
          <div className="mx-auto mt-10 h-px w-20 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        </div>

        <div
          className={`mt-14 border border-stone-800/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-10 ${theme.card}`}
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
