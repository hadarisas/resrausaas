import type { ThemeConfig } from '@/themes/shared/theme-config'
import PublicReservationForm from '@/themes/shared/PublicReservationForm'

interface ReservationSectionProps {
  theme: ThemeConfig
  restaurantId: string
  maxPartySize: number
}

export default function TraditionalReservationSection({ theme, restaurantId, maxPartySize }: ReservationSectionProps) {
  return (
    <section id="reserve" className={`scroll-mt-24 border-t border-stone-300/50 px-5 py-20 sm:px-8 sm:py-24 ${theme.reservationBg}`}>
      <div className="mx-auto max-w-lg">
        <div className="text-center">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.4em] text-[#7c6a58]">Visit us</p>
          <h2 className="mt-4 font-serif text-3xl font-medium text-stone-800 sm:text-4xl">Reserve a table</h2>
          <p className="mx-auto mt-4 max-w-sm font-sans text-sm leading-relaxed text-stone-600">
            Share your details — we will reply by email to confirm.
          </p>
          <div className="mx-auto mt-8 h-px w-16 bg-[#9c4c34]/30" />
        </div>

        <div
          className={`mt-10 rounded-sm border ${theme.border} p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5)] sm:p-10 ${theme.card}`}
        >
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
