import type { ThemeConfig } from './theme-config'
import PublicReservationForm from './PublicReservationForm'

interface ReservationSectionProps {
  theme: ThemeConfig
  restaurantId: string
  maxPartySize: number
}

export default function ReservationSection({ theme, restaurantId, maxPartySize }: ReservationSectionProps) {
  const headingColor = theme.reservationIsDark ? 'text-white' : theme.text
  const subtitleColor = theme.reservationIsDark ? 'text-white/60' : theme.textMuted
  const labelColor = theme.reservationIsDark ? 'text-white/50' : theme.textMuted
  const cardClass = theme.reservationIsDark
    ? 'bg-white rounded-2xl p-8 shadow-2xl'
    : `${theme.card} border ${theme.border} rounded-2xl p-8 shadow-sm`

  return (
    <section id="reserve" className={`${theme.reservationBg} px-6 py-24`}>
      <div className="mx-auto max-w-lg">
        <div className="mb-10 text-center">
          <p className={`mb-2 text-xs uppercase tracking-[0.4em] ${labelColor}`}>Reservations</p>
          <h2 className={`text-4xl font-bold ${theme.heading} ${headingColor}`}>
            Book Your Table
          </h2>
          <p className={`mt-3 text-sm ${subtitleColor}`}>
            We look forward to welcoming you
          </p>
        </div>

        <div className={cardClass}>
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
