import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface FooterSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function MinimalFooterSection({ restaurant }: FooterSectionProps) {
  return (
    <footer className="border-t border-neutral-200 px-5 py-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm font-medium text-neutral-900">{restaurant.name}</p>
        <div className="flex gap-6 text-sm text-neutral-500">
          <a href="#menu" className="hover:text-neutral-900">
            Menu
          </a>
          <a href="#reserve" className="hover:text-neutral-900">
            Reserve
          </a>
          <a href="#hours" className="hover:text-neutral-900">
            Hours
          </a>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-neutral-400">© {new Date().getFullYear()} {restaurant.name}</p>
    </footer>
  )
}
