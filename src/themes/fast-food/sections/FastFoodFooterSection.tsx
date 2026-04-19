import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface FooterSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function FastFoodFooterSection({ restaurant }: FooterSectionProps) {
  return (
    <footer className="bg-red-600 px-4 py-12 text-amber-100 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-2xl font-black uppercase tracking-tight text-white">{restaurant.name}</p>
          {restaurant.cuisine_type && <p className="mt-1 text-sm font-bold text-amber-200">{restaurant.cuisine_type}</p>}
        </div>
        <nav className="flex flex-wrap justify-center gap-6 text-sm font-black uppercase tracking-wide">
          <a href="#menu" className="text-white transition hover:text-yellow-300">
            Menu
          </a>
          <a href="#reserve" className="text-white transition hover:text-yellow-300">
            Reserve
          </a>
          <a href="#hours" className="text-white transition hover:text-yellow-300">
            Hours
          </a>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-7xl border-t border-red-500/80 pt-8 text-center text-xs font-bold text-amber-200/90">
        © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
      </p>
    </footer>
  )
}
