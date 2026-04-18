import {
  LayoutDashboard,
  Calendar,
  UtensilsCrossed,
  TrendingUp,
  Settings,
} from 'lucide-react'

export const navItems = [
  { href: '/dashboard',              label: 'Overview',     icon: LayoutDashboard },
  { href: '/dashboard/reservations', label: 'Reservations', icon: Calendar },
  { href: '/dashboard/menu',         label: 'Menu',         icon: UtensilsCrossed },
  { href: '/dashboard/revenue',      label: 'Revenue',      icon: TrendingUp },
  { href: '/dashboard/settings',     label: 'Settings',     icon: Settings },
]
