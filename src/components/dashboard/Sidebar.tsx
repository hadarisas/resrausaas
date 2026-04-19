'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navItems } from './nav-items'
import { signoutAction } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  restaurantName: string
}

export default function Sidebar({ restaurantName }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-stone-200/80 bg-white/95 shadow-sm backdrop-blur-sm md:flex">
      {/* Logo / brand */}
      <div className="flex h-16 items-center gap-3 border-b border-stone-200/80 bg-gradient-to-r from-stone-50/80 to-white px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm">
          <UtensilsCrossed className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-gray-900">{restaurantName}</p>
          <p className="text-xs text-muted-foreground">TableFlow</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/dashboard' ? pathname === href : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-stone-100 hover:text-gray-900'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t border-stone-200/80 p-4">
        <form action={signoutAction}>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-gray-600">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  )
}
