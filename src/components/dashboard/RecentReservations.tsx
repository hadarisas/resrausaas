import Link from 'next/link'
import type { Reservation } from '@/types/reservation'
import { STATUS_COLORS, STATUS_LABELS } from '@/types/reservation'
import { formatDate, formatTime } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

interface RecentReservationsProps {
  reservations: Reservation[]
}

export default function RecentReservations({ reservations }: RecentReservationsProps) {
  return (
    <div className="rounded-2xl border border-stone-200/80 bg-white/90 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
        <h2 className="font-semibold text-gray-900">Upcoming Reservations</h2>
        <Link
          href="/dashboard/reservations"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="divide-y">
        {reservations.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted-foreground">
            No upcoming reservations.
          </p>
        ) : (
          reservations.map((r) => (
            <div key={r.id} className="flex items-center gap-4 px-6 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{r.guest_name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(r.reservation_date)} · {formatTime(r.reservation_time)} ·{' '}
                  {r.party_size} guests
                </p>
              </div>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  STATUS_COLORS[r.status]
                )}
              >
                {STATUS_LABELS[r.status]}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
