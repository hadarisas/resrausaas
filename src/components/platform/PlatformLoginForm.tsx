'use client'

import { useFormState } from 'react-dom'
import { platformLoginAction } from '@/lib/actions/platform'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ActionResult } from '@/types/actions'
import { cn } from '@/lib/utils'
import { AuthSubmitButton } from '@/components/auth/AuthSubmitButton'

const initialState: ActionResult = { success: false, error: '' }

const field =
  'h-11 rounded-xl border-stone-600 bg-stone-950/50 text-stone-100 placeholder:text-stone-500 focus-visible:border-amber-500/40 focus-visible:ring-amber-500/25'

export function PlatformLoginForm() {
  const [state, action] = useFormState(platformLoginAction, initialState)

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="redirect" value="/platform" />

      {'error' in state && state.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-950/50 px-4 py-3 text-sm text-red-200"
        >
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="platform-email" className="text-stone-300">
          Email
        </Label>
        <Input
          id="platform-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={cn(field)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="platform-password" className="text-stone-300">
          Password
        </Label>
        <Input
          id="platform-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={cn(field)}
        />
      </div>

      <AuthSubmitButton label="Sign in to platform" pendingLabel="Signing in…" />
    </form>
  )
}
