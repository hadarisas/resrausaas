'use client'
import { useState, useTransition } from 'react'
import {
  updateReservationStatusAction,
  deleteReservationAction,
} from '@/lib/actions/reservations'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ReservationStatusBadge from './ReservationStatusBadge'
import ReservationEditDialog from './ReservationEditDialog'
import { formatDate, formatTime } from '@/lib/utils/format'
import type { Reservation, ReservationStatus } from '@/types/reservation'
import { Users, Trash2, Pencil } from 'lucide-react'

interface ReservationTableProps {
  reservations: Reservation[]
}

const STATUS_OPTIONS: ReservationStatus[] = [
  'pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show',
]

export default function ReservationTable({ reservations }: ReservationTableProps) {
  const [isPending, startTransition] = useTransition()
  const [editTarget, setEditTarget] = useState<Reservation | null>(null)

  function handleStatusChange(id: string, status: string) {
    startTransition(async () => {
      await updateReservationStatusAction(id, status)
    })
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete reservation for ${name}?`)) return
    startTransition(async () => {
      await deleteReservationAction(id)
    })
  }

  if (reservations.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
        <p className="text-muted-foreground">No reservations found for the selected filters.</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Date & Time</th>
              <th className="px-4 py-3">Guests</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {reservations.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{r.guest_name}</p>
                  <p className="text-xs text-muted-foreground">{r.guest_email}</p>
                  {r.guest_phone && <p className="text-xs text-muted-foreground">{r.guest_phone}</p>}
                </td>
                <td className="px-4 py-3">
                  <p>{formatDate(r.reservation_date)}</p>
                  <p className="text-xs text-muted-foreground">{formatTime(r.reservation_time)}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    {r.party_size}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Select
                    value={r.status}
                    onValueChange={(v) => handleStatusChange(r.id, v)}
                    disabled={isPending}
                  >
                    <SelectTrigger className="h-8 w-36 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s} className="text-xs capitalize">
                          {s.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="max-w-[200px] px-4 py-3">
                  <p className="truncate text-xs text-muted-foreground">{r.notes ?? '—'}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setEditTarget(r)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => handleDelete(r.id, r.guest_name)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {reservations.map((r) => (
          <div key={r.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900">{r.guest_name}</p>
                <p className="text-xs text-muted-foreground">{r.guest_email}</p>
              </div>
              <ReservationStatusBadge status={r.status} />
            </div>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <span>{formatDate(r.reservation_date)}, {formatTime(r.reservation_time)}</span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />{r.party_size}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <Select
                value={r.status}
                onValueChange={(v) => handleStatusChange(r.id, v)}
                disabled={isPending}
              >
                <SelectTrigger className="h-8 flex-1 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs capitalize">
                      {s.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setEditTarget(r)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => handleDelete(r.id, r.guest_name)}
                disabled={isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit reservation</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <ReservationEditDialog
              reservation={editTarget}
              onClose={() => setEditTarget(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
