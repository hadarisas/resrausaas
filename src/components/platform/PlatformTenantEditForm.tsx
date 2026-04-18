'use client'

import { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { platformRestaurantUpdateAction } from '@/lib/actions/platform'
import { toDatetimeLocalValue } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { ActionResult } from '@/types/actions'
import type { Database } from '@/types/database'
import { AlertCircle, CheckCircle2, ExternalLink, Loader2 } from 'lucide-react'

type Restaurant = Database['public']['Tables']['restaurants']['Row']

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="min-w-[120px] bg-amber-500 font-semibold text-stone-950 hover:bg-amber-400"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
          Saving…
        </>
      ) : (
        'Save changes'
      )}
    </Button>
  )
}

const initialActionState: ActionResult = { success: true }

export function PlatformTenantEditForm({
  restaurant: r,
  onSuccess,
}: {
  restaurant: Restaurant
  /** e.g. `router.refresh()` so the directory reflects saved changes while the panel stays open. */
  onSuccess?: () => void
}) {
  const [state, formAction] = useFormState(platformRestaurantUpdateAction, initialActionState)

  useEffect(() => {
    if (state?.success && state.message) {
      onSuccess?.()
    }
  }, [state, onSuccess])

  return (
    <form action={formAction} className="flex flex-1 flex-col">
      <input type="hidden" name="restaurantId" value={r.id} />

      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-stone-500">/{r.slug}</p>
            <a
              href={`/${r.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-sm text-amber-500/90 hover:text-amber-400"
            >
              Open public page
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`pub-${r.id}`} className="text-stone-400">
              Public visibility
            </Label>
            <select
              id={`pub-${r.id}`}
              name="isPublished"
              defaultValue={r.is_published ? 'true' : 'false'}
              className={cn(
                'h-10 w-full rounded-lg border border-stone-700 bg-stone-950/80 px-3 text-sm text-stone-100',
                'shadow-inner shadow-black/20 outline-none transition-[box-shadow,border-color]',
                'focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/25'
              )}
            >
              <option value="true">Live — guest URL works when entitlement allows</option>
              <option value="false">Draft — page not shown publicly</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`access-${r.id}`} className="text-stone-400">
              Access status
            </Label>
            <select
              id={`access-${r.id}`}
              name="accessStatus"
              defaultValue={r.access_status}
              className={cn(
                'h-10 w-full rounded-lg border border-stone-700 bg-stone-950/80 px-3 text-sm text-stone-100',
                'shadow-inner shadow-black/20 outline-none transition-[box-shadow,border-color]',
                'focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/25'
              )}
            >
              <option value="trial">Trial</option>
              <option value="active">Active</option>
              <option value="readonly">Read-only</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`trial-${r.id}`} className="text-stone-400">
                Trial ends
              </Label>
              <Input
                id={`trial-${r.id}`}
                type="datetime-local"
                name="trialEndsAt"
                defaultValue={toDatetimeLocalValue(r.trial_ends_at)}
                className="border-stone-700 bg-stone-950/80 text-stone-100 focus-visible:ring-amber-500/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`sub-${r.id}`} className="text-stone-400">
                Subscription ends
              </Label>
              <Input
                id={`sub-${r.id}`}
                type="datetime-local"
                name="subscriptionEndsAt"
                defaultValue={toDatetimeLocalValue(r.subscription_ends_at)}
                className="border-stone-700 bg-stone-950/80 text-stone-100 focus-visible:ring-amber-500/30"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`notes-${r.id}`} className="text-stone-400">
              Billing notes
            </Label>
            <Textarea
              id={`notes-${r.id}`}
              name="billingNotes"
              defaultValue={r.billing_notes ?? ''}
              placeholder="Invoice ID, contract, offline payment reference…"
              rows={5}
              className="resize-y border-stone-700 bg-stone-950/80 text-stone-100 focus-visible:ring-amber-500/30"
            />
          </div>
        </div>

        {state && !state.success && 'error' in state && (
          <div
            className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-200"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{state.error}</span>
          </div>
        )}
        {state?.success && state.message && (
          <div
            className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/35 px-3 py-2 text-sm text-emerald-100"
            role="status"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
            <span>{state.message}</span>
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-stone-800 bg-stone-950/80 px-6 py-4">
        <SubmitButton />
      </div>
    </form>
  )
}
