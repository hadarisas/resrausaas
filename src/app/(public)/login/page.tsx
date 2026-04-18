import type { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'
import { AuthPageLayout } from '@/components/auth/AuthPageLayout'

export const metadata: Metadata = {
  title: 'Sign in — TableFlow',
}

export default function LoginPage() {
  return (
    <AuthPageLayout
      title="Welcome back"
      description="Sign in to manage your restaurant, menu, and reservations."
    >
      <LoginForm />
    </AuthPageLayout>
  )
}
