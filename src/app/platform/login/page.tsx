import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthPageLayout } from '@/components/auth/AuthPageLayout'
import { PlatformLoginForm } from '@/components/platform/PlatformLoginForm'

export const metadata: Metadata = {
  title: 'Platform sign in — TableFlow',
  robots: { index: false, follow: false },
}

export default function PlatformLoginPage() {
  return (
    <AuthPageLayout
      title="Platform administration"
      description="Restricted area. Sign in with a platform administrator account."
    >
      <PlatformLoginForm />
      <p className="mt-6 text-center text-xs text-stone-500">
        Restaurant owner?{' '}
        <Link href="/login" className="text-amber-400 hover:text-amber-300">
          Sign in at the regular login
        </Link>
      </p>
    </AuthPageLayout>
  )
}
