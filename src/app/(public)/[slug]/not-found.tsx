import Link from 'next/link'

export default function RestaurantNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <p className="text-5xl">🍽</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Restaurant not found</h1>
      <p className="mt-2 text-gray-500">This restaurant page doesn&apos;t exist or is not yet published.</p>
      <Link href="/" className="mt-6 text-sm font-medium text-primary hover:underline">
        ← Back to home
      </Link>
    </div>
  )
}
