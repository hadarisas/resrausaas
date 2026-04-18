import type { Metadata } from 'next'
import SignupForm from '@/components/auth/SignupForm'
import { AuthPageLayout } from '@/components/auth/AuthPageLayout'

export const metadata: Metadata = {
  title: 'Create account — TableFlow',
}

export default function SignupPage() {
  return (
    <AuthPageLayout
      title="Create your account"
      description="Start your restaurant on TableFlow — public page, bookings, and dashboard in one place."
    >
      <SignupForm />
    </AuthPageLayout>
  )
}
