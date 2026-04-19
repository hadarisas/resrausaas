import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface FooterSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function LifestyleFooterSection({ restaurant }: FooterSectionProps) {
  return (
    <footer className="bg-[#2d2628] px-5 py-14 text-rose-100/85 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-sans text-lg font-semibold text-white">{restaurant.name}</p>
          {restaurant.cuisine_type && <p className="mt-1 text-sm text-rose-200/80">{restaurant.cuisine_type}</p>}
        </div>
        <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <a href="#gallery" className="transition-colors hover:text-white">
            Gallery
          </a>
          <a href="#menu" className="transition-colors hover:text-white">
            Menu
          </a>
          <a href="#reserve" className="transition-colors hover:text-white">
            Reserve
          </a>
          <a href="#hours" className="transition-colors hover:text-white">
            Hours
          </a>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-5xl border-t border-white/10 pt-8 text-center text-xs text-rose-200/60">
        © {new Date().getFullYear()} {restaurant.name}
      </p>
    </footer>
  )
}
