import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PlatformAppShell } from '@/components/platform/PlatformAppShell'

export default async function PlatformSegmentLayout({ children }: { children: React.ReactNode }) {
  const path = headers().get('x-invoke-path') ?? ''
  const isPlatformLogin =
    !path || path === '/platform/login' || path.startsWith('/platform/login?')
  if (isPlatformLogin) {
    return <>{children}</>
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/platform/login')

  const { data: admin } = await supabase
    .from('platform_admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!admin) {
    redirect('/?error=forbidden')
  }

  const email = user.email ?? ''

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-stone-950 text-stone-100">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.1),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(120,113,108,0.06),transparent)]"
        aria-hidden
      />
      <PlatformAppShell email={email}>{children}</PlatformAppShell>
    </div>
  )
}
