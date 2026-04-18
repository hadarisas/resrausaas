'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export default function ReservationFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1.5">
        <Label htmlFor="date-filter" className="text-xs">Date</Label>
        <Input
          id="date-filter"
          type="date"
          className="h-8 text-sm"
          defaultValue={searchParams.get('date') ?? ''}
          onChange={(e) => update('date', e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Status</Label>
        <Select
          defaultValue={searchParams.get('status') ?? 'all'}
          onValueChange={(v) => update('status', v)}
        >
          <SelectTrigger className="h-8 w-36 text-sm">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="seated">Seated</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="no_show">No show</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {(searchParams.get('date') || searchParams.get('status')) && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={() => router.push(pathname)}
        >
          Clear filters
        </Button>
      )}
    </div>
  )
}
