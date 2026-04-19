import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface FooterSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function FineDiningFooterSection({ restaurant }: FooterSectionProps) {
  return (
    <footer className="border-t border-stone-800/50 bg-[#080706] px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-serif text-xl font-medium text-stone-200 md:text-2xl">{restaurant.name}</p>
        {restaurant.cuisine_type && (
          <p className="mt-3 font-sans text-[11px] uppercase tracking-[0.35em] text-stone-500">{restaurant.cuisine_type}</p>
        )}

        <div className="mx-auto mt-10 flex flex-wrap justify-center gap-x-10 gap-y-2 font-sans text-[11px] uppercase tracking-[0.3em] text-stone-500">
          <a href="#menu" className="transition-colors hover:text-amber-200/80">
            Menu
          </a>
          <a href="#reserve" className="transition-colors hover:text-amber-200/80">
            Reserve
          </a>
          <a href="#hours" className="transition-colors hover:text-amber-200/80">
            Hours
          </a>
        </div>

        {(restaurant.address || restaurant.phone) && (
          <div className="mx-auto mt-10 max-w-md space-y-1 font-sans text-sm text-stone-600">
            {restaurant.address && (
              <p>
                {restaurant.address}
                {restaurant.city ? `, ${restaurant.city}` : ''}
              </p>
            )}
            {restaurant.phone && <p>{restaurant.phone}</p>}
          </div>
        )}

        <div className="mx-auto mt-12 h-px max-w-xs bg-gradient-to-r from-transparent via-stone-700/50 to-transparent" />

        <p className="mt-10 font-sans text-[11px] tracking-wide text-stone-600">
          © {new Date().getFullYear()} {restaurant.name}
        </p>
      </div>
    </footer>
  )
}
