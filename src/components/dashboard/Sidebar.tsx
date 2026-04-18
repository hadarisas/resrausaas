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
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-white md:flex">
      {/* Logo / brand */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <UtensilsCrossed className="h-5 w-5 text-primary" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">{restaurantName}</p>
          <p className="text-xs text-muted-foreground">TableFlow</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/dashboard' ? pathname === href : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t p-4">
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
