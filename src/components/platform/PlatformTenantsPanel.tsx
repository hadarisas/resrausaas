'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PlatformTenantEditForm } from '@/components/platform/PlatformTenantEditForm'
import { PlatformAccessBadge } from '@/components/platform/platform-tenant-badges'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { Database } from '@/types/database'
import { Building2, ExternalLink, Pencil, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

type Restaurant = Database['public']['Tables']['restaurants']['Row']

function formatShort(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function PlatformTenantsPanel({ restaurants }: { restaurants: Restaurant[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selected, setSelected] = useState<Restaurant | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return restaurants
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        (r.billing_notes?.toLowerCase().includes(q) ?? false)
    )
  }, [restaurants, query])

  useEffect(() => {
    if (!selected) return
    const next = restaurants.find((r) => r.id === selected.id)
    if (next && next.updated_at !== selected.updated_at) {
      setSelected(next)
    }
  }, [restaurants, selected])

  function openEdit(r: Restaurant) {
    setSelected(r)
    setSheetOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tenants by name, slug, or billing note…"
            className="h-10 border-stone-700 bg-stone-900/60 pl-10 text-sm text-stone-100 placeholder:text-stone-600 focus-visible:ring-amber-500/30"
            aria-label="Search tenants"
          />
        </div>
        <p className="text-xs text-stone-500 sm:text-right">
          {filtered.length === restaurants.length
            ? `${restaurants.length} total`
            : `${filtered.length} of ${restaurants.length} match`}
        </p>
      </div>

      {restaurants.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-700/80 bg-stone-900/20 px-6 py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-stone-800/80 ring-1 ring-stone-700">
            <Building2 className="h-6 w-6 text-stone-500" aria-hidden />
          </div>
          <p className="font-medium text-stone-300">No tenants yet</p>
          <p className="mt-1 max-w-sm text-sm text-stone-500">
            New signups will show up here for access and billing control.
          </p>
        </div>
      )}

      {restaurants.length > 0 && filtered.length === 0 && (
        <p className="rounded-lg border border-dashed border-stone-700 bg-stone-900/30 px-4 py-10 text-center text-sm text-stone-500">
          No results for &ldquo;{query.trim()}&rdquo;.
        </p>
      )}

      {filtered.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-stone-800/90 bg-stone-900/25 ring-1 ring-white/[0.03]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/80 text-xs font-medium uppercase tracking-wide text-stone-500">
                  <th className="whitespace-nowrap px-4 py-3">Tenant</th>
                  <th className="whitespace-nowrap px-4 py-3">Access</th>
                  <th className="whitespace-nowrap px-4 py-3">Site</th>
                  <th className="whitespace-nowrap px-4 py-3">Trial ends</th>
                  <th className="whitespace-nowrap px-4 py-3">Subscription</th>
                  <th className="whitespace-nowrap px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80">
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className={cn(
                      'cursor-pointer transition-colors',
                      'hover:bg-stone-800/40 focus-within:bg-stone-800/40'
                    )}
                    onClick={() => openEdit(r)}
                  >
                    <td className="max-w-[220px] px-4 py-3">
                      <div className="font-medium text-stone-100">{r.name}</div>
                      <div className="mt-0.5 font-mono text-xs text-stone-500">/{r.slug}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <PlatformAccessBadge status={r.access_status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-stone-400">
                      {r.is_published ? (
                        <span className="text-emerald-400/90">Live</span>
                      ) : (
                        <span className="text-stone-500">Draft</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-stone-400">
                      {formatShort(r.trial_ends_at)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-stone-400">
                      {formatShort(r.subscription_ends_at)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-stone-400 hover:bg-stone-800 hover:text-white"
                          asChild
                        >
                          <Link href={`/${r.slug}`} target="_blank" rel="noopener noreferrer" title="Open site">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Open site</span>
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 border-stone-600 bg-stone-950/50 text-stone-200 hover:bg-stone-800"
                          onClick={() => openEdit(r)}
                        >
                          <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open)
          if (!open) setSelected(null)
        }}
      >
        <SheetContent className="flex w-full flex-col border-stone-800 p-0 sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="pr-8">{selected.name}</SheetTitle>
                <SheetDescription>Update access, subscription window, and billing notes.</SheetDescription>
              </SheetHeader>
              <PlatformTenantEditForm
                key={`${selected.id}-${selected.updated_at ?? ''}`}
                restaurant={selected}
                onSuccess={() => router.refresh()}
              />
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
