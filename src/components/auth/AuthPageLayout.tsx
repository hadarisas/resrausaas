import type { ReactNode } from 'react'
import Link from 'next/link'

type Props = {
  title: string
  description: string
  children: ReactNode
}

export function AuthPageLayout({ title, description, children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,rgba(251,191,36,0.14),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(120,113,108,0.12),transparent_50%)]"
        aria-hidden
      />

      <div className="relative flex min-h-screen flex-col">
        

        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-12 pt-2 sm:pb-16">
          <div className="w-full max-w-[440px] space-y-8">
            <div className="text-center">
              <h1 className="font-sans text-3xl font-bold tracking-tight text-white sm:text-[2rem]">{title}</h1>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-stone-400 sm:text-base">{description}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-stone-900/75 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
              {children}
            </div>

            <p className="text-center text-xs text-stone-500">
              <Link href="/" className="text-stone-400 transition-colors hover:text-amber-400/90">
                ← Back to marketing site
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
