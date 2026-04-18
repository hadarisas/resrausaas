'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  label: string
  pendingLabel: string
  className?: string
}

/**
 * Must be rendered inside a <form> — useFormStatus only works as a descendant of the form.
 */
export function AuthSubmitButton({ label, pendingLabel, className }: Props) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        'h-11 w-full rounded-full bg-amber-500 font-semibold text-stone-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 disabled:opacity-90',
        className
      )}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {pending && <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />}
        {pending ? pendingLabel : label}
      </span>
    </Button>
  )
}
