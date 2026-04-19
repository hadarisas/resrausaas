import type { ThemeConfig } from '@/themes/shared/theme-config'
import type { Restaurant } from '@/types/restaurant'

interface FooterSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function TraditionalFooterSection({ restaurant }: FooterSectionProps) {
  return (
    <footer className="border-t border-[#2a241e] bg-[#3f3429] px-5 py-16 text-[#d4c4b0] sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-serif text-xl text-[#fdf8f3] sm:text-2xl">{restaurant.name}</p>
        {restaurant.cuisine_type && <p className="mt-2 font-sans text-sm tracking-wide text-[#b5a08c]">{restaurant.cuisine_type}</p>}

        <nav className="mt-10 flex flex-wrap justify-center gap-8 font-sans text-xs uppercase tracking-[0.25em]">
          <a href="#our-story" className="transition-colors hover:text-[#fdf8f3]">
            Welcome
          </a>
          <a href="#menu" className="transition-colors hover:text-[#fdf8f3]">
            Menu
          </a>
          <a href="#reserve" className="transition-colors hover:text-[#fdf8f3]">
            Reserve
          </a>
          <a href="#hours" className="transition-colors hover:text-[#fdf8f3]">
            Hours
          </a>
        </nav>

        <p className="mx-auto mt-12 max-w-md font-sans text-sm leading-relaxed text-[#9a8b7a]">
          {restaurant.address && (
            <>
              {restaurant.address}
              {restaurant.city ? `, ${restaurant.city}` : ''}
            </>
          )}
        </p>

        <p className="mt-10 font-sans text-xs text-[#7c6a58]">© {new Date().getFullYear()} {restaurant.name}</p>
      </div>
    </footer>
  )
}
