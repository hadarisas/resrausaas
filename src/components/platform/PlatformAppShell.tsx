'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { platformSignoutAction } from '@/lib/actions/platform'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Building2, LayoutDashboard, Menu, Shield, UtensilsCrossed, X, LogOut } from 'lucide-react'

const nav = [{ href: '/platform', label: 'Tenants', icon: Building2 }]

export function PlatformAppShell({
  email,
  children,
}: {
  email: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-stone-800 bg-stone-950 transition-transform duration-200 ease-out lg:static lg:z-0 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b border-stone-800 px-4 lg:h-auto lg:flex-col lg:items-stretch lg:gap-6 lg:border-b-0 lg:px-0 lg:py-6">
          <div className="flex flex-1 items-center gap-2 lg:px-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 ring-1 ring-amber-500/20">
              <UtensilsCrossed className="h-4 w-4 text-amber-400" aria-hidden />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-medium text-stone-500">TableFlow</p>
              <p className="flex items-center gap-1 truncate text-sm font-semibold text-white">
                <Shield className="h-3.5 w-3.5 shrink-0 text-amber-500/90" aria-hidden />
                Platform
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-800 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-2 lg:px-2">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-amber-500/15 text-amber-100 ring-1 ring-amber-500/25'
                    : 'text-stone-400 hover:bg-stone-800/80 hover:text-stone-100'
                )}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-stone-800 p-3 text-xs text-stone-500 lg:mt-auto">
          <p className="mb-2 font-medium uppercase tracking-wider text-stone-600">Shortcuts</p>
          <Link
            href="/"
            className="block rounded-md px-2 py-1.5 text-stone-400 hover:bg-stone-800/80 hover:text-stone-200"
          >
            Marketing site
          </Link>
          <Link
            href="/dashboard"
            className="mt-0.5 flex items-center gap-2 rounded-md px-2 py-1.5 text-stone-400 hover:bg-stone-800/80 hover:text-stone-200"
          >
            <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
            Restaurant dashboard
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-stone-800/80 bg-stone-950/90 px-4 backdrop-blur-md sm:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-800 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-xs text-stone-500">
              <span className="text-stone-400">Platform</span>
              <span className="mx-1.5 text-stone-600">/</span>
              <span className="font-medium text-stone-300">Tenants</span>
            </p>
          </div>

          {email ? (
            <span
              className="hidden max-w-[200px] truncate rounded-md border border-stone-800 bg-stone-900/50 px-2 py-1 text-xs text-stone-400 md:inline-block"
              title={email}
            >
              {email}
            </span>
          ) : null}

          <form action={platformSignoutAction}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="border-stone-700 bg-stone-900/50 text-stone-200 hover:bg-stone-800 hover:text-white"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </form>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  )
}
