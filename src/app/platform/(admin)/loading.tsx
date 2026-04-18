import { Skeleton } from '@/components/ui/skeleton'

export default function PlatformLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 rounded-md bg-stone-800" />
        <Skeleton className="h-14 max-w-2xl rounded-lg bg-stone-800/80" />
      </div>
      <Skeleton className="h-14 w-full rounded-xl bg-stone-800/90" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-24 rounded-md bg-stone-800" />
        <Skeleton className="h-10 max-w-md rounded-lg bg-stone-800" />
        <Skeleton className="h-72 w-full rounded-xl bg-stone-800/80" />
      </div>
    </div>
  )
}
