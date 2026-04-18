'use client'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

interface AuthState {
  user: User | null
  loading: boolean
}

export function useAuth(): AuthState {
  const supabase = createClient()
  const [state, setState] = useState<AuthState>({ user: null, loading: true })

  useEffect(() => {
    const sync = () => {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setState({ user, loading: false })
      })
    }

    sync()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ user: session?.user ?? null, loading: false })
    })

    const onVisible = () => {
      if (document.visibilityState === 'visible') sync()
    }

    document.addEventListener('visibilitychange', onVisible)

    return () => {
      subscription.unsubscribe()
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [supabase])

  return state
}
