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
    supabase.auth.getUser().then(({ data: { user } }) => {
      setState({ user, loading: false })
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ user: session?.user ?? null, loading: false })
    })

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return state
}
