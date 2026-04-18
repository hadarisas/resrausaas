'use client'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import { loginAction } from '@/lib/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ActionResult } from '@/types/actions'
import { cn } from '@/lib/utils'
import { AuthSubmitButton } from '@/components/auth/AuthSubmitButton'

const initialState: ActionResult = { success: false, error: '' }

const field =
  'h-11 rounded-xl border-stone-600 bg-stone-950/50 text-stone-100 placeholder:text-stone-500 focus-visible:border-amber-500/40 focus-visible:ring-amber-500/25'

export default function LoginForm() {
  const [state, action] = useFormState(loginAction, initialState)

  return (
    <form action={action} className="space-y-5">
      {'error' in state && state.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-950/50 px-4 py-3 text-sm text-red-200"
        >
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-stone-300">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@restaurant.com"
          required
          className={cn(field)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-stone-300">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          className={cn(field)}
        />
      </div>

      <AuthSubmitButton label="Sign in" pendingLabel="Signing in…" />

      <p className="text-center text-sm text-stone-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-amber-400/95 transition hover:text-amber-300">
          Create one
        </Link>
      </p>
    </form>
  )
}
