import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface FooterSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function ModernFooterSection({ restaurant }: FooterSectionProps) {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-4 py-16 text-slate-400 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="mb-2 text-lg font-bold tracking-tight text-white">{restaurant.name}</p>
            {restaurant.cuisine_type && <p className="text-sm text-slate-500">{restaurant.cuisine_type}</p>}
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Contact</p>
            <div className="space-y-2 text-sm">
              {restaurant.address && (
                <p>
                  {restaurant.address}
                  {restaurant.city ? `, ${restaurant.city}` : ''}
                </p>
              )}
              {restaurant.phone && (
                <p>
                  <a href={`tel:${restaurant.phone}`} className="transition-colors hover:text-white">
                    {restaurant.phone}
                  </a>
                </p>
              )}
              {restaurant.email && (
                <p>
                  <a href={`mailto:${restaurant.email}`} className="transition-colors hover:text-white">
                    {restaurant.email}
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Explore</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <a href="#menu" className="transition-colors hover:text-white">
                Menu
              </a>
              <a href="#reserve" className="transition-colors hover:text-white">
                Reservations
              </a>
              <a href="#hours" className="transition-colors hover:text-white">
                Hours
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
