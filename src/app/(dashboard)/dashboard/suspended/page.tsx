import Link from 'next/link'
import { signoutAction } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'

export default function AccountSuspendedPage() {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-xl font-semibold text-gray-900">Account suspended</h1>
      <p className="mt-3 text-sm text-gray-600">
        Your TableFlow access has been suspended by an administrator. If you believe this is a mistake, please
        contact support.
      </p>
      <form action={signoutAction} className="mt-8">
        <Button type="submit" variant="outline" className="w-full sm:w-auto">
          Sign out
        </Button>
      </form>
      <p className="mt-6 text-xs text-gray-500">
        <Link href="/" className="text-primary underline-offset-4 hover:underline">
          Back to home
        </Link>
      </p>
    </div>
  )
}
