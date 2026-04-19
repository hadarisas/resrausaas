'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { navItems } from './nav-items'

export default function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200/90 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-md md:hidden">
      <div className="flex">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/dashboard' ? pathname === href : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors active:bg-stone-50',
                isActive ? 'text-stone-900' : 'text-gray-500'
              )}
            >
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
                  isActive ? 'bg-stone-900 text-white shadow-sm' : 'text-gray-500'
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="max-w-full truncate px-0.5">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
