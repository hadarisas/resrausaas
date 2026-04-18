'use client'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import { signupAction } from '@/lib/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ActionResult } from '@/types/actions'
import { cn } from '@/lib/utils'
import { AuthSubmitButton } from '@/components/auth/AuthSubmitButton'

const initialState: ActionResult = { success: false, error: '' }

const field =
  'h-11 rounded-xl border-stone-600 bg-stone-950/50 text-stone-100 placeholder:text-stone-500 focus-visible:border-amber-500/40 focus-visible:ring-amber-500/25'

export default function SignupForm() {
  const [state, action] = useFormState(signupAction, initialState)

  return (
    <form action={action} className="space-y-4">
      {'error' in state && state.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-950/50 px-4 py-3 text-sm text-red-200"
        >
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-stone-300">
          Full name
        </Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Jane Smith"
          required
          className={cn(field)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="restaurantName" className="text-stone-300">
          Restaurant name
        </Label>
        <Input
          id="restaurantName"
          name="restaurantName"
          type="text"
          placeholder="Aurelia Bistro"
          required
          className={cn(field)}
        />
      </div>

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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          required
          className={cn(field)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-stone-300">
          Confirm password
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          className={cn(field)}
        />
      </div>

      <AuthSubmitButton
        label="Create account"
        pendingLabel="Creating account…"
        className="mt-2"
      />

      <p className="pt-1 text-center text-sm text-stone-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-amber-400/95 transition hover:text-amber-300">
          Sign in
        </Link>
      </p>
    </form>
  )
}
