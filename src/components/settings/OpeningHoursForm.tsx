'use client'
import { useState, useTransition } from 'react'
import { useDashboardAccess } from '@/components/dashboard/DashboardAccessContext'
import { updateOpeningHoursAction } from '@/lib/actions/settings'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { DAYS_OF_WEEK, DAY_LABELS, type DayOfWeek, type OpeningHour } from '@/types/restaurant'

interface OpeningHoursFormProps {
  hours: OpeningHour[]
  restaurantId: string
}

type HourState = {
  dayOfWeek: DayOfWeek
  isClosed: boolean
  openTime: string
  closeTime: string
}

export default function OpeningHoursForm({ hours, restaurantId }: OpeningHoursFormProps) {
  const { isReadOnly } = useDashboardAccess()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [rows, setRows] = useState<HourState[]>(() =>
    DAYS_OF_WEEK.map((day) => {
      const found = hours.find((h) => h.day_of_week === day)
      return {
        dayOfWeek: day,
        isClosed: found?.is_closed ?? false,
        openTime: found?.open_time?.slice(0, 5) ?? '09:00',
        closeTime: found?.close_time?.slice(0, 5) ?? '22:00',
      }
    })
  )

  function update(index: number, field: keyof HourState, value: string | boolean) {
    setRows((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    startTransition(async () => {
      const result = await updateOpeningHoursAction(restaurantId, rows)
      if (!result.success) setError(result.error)
      else setSuccess(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-700">Opening hours saved.</p>}

      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={row.dayOfWeek} className="flex items-center gap-4">
            <span className="w-28 text-sm font-medium text-gray-700">
              {DAY_LABELS[row.dayOfWeek]}
            </span>
            <Switch
              checked={!row.isClosed}
              onCheckedChange={(v) => update(i, 'isClosed', !v)}
              aria-label={`Toggle ${DAY_LABELS[row.dayOfWeek]}`}
              disabled={isReadOnly}
            />
            {row.isClosed ? (
              <span className="text-sm text-muted-foreground">Closed</span>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={row.openTime}
                  onChange={(e) => update(i, 'openTime', e.target.value)}
                  className="h-8 w-28 text-sm"
                  disabled={isReadOnly}
                />
                <span className="text-muted-foreground">–</span>
                <Input
                  type="time"
                  value={row.closeTime}
                  onChange={(e) => update(i, 'closeTime', e.target.value)}
                  className="h-8 w-28 text-sm"
                  disabled={isReadOnly}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isPending || isReadOnly}>
        {isPending ? 'Saving…' : 'Save hours'}
      </Button>
    </form>
  )
}
