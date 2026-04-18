import { cn } from '@/lib/utils'
import { STATUS_COLORS, STATUS_LABELS, type ReservationStatus } from '@/types/reservation'

export default function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        STATUS_COLORS[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
