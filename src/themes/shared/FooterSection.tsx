import type { ThemeConfig } from './theme-config'
import type { Restaurant } from '@/types/restaurant'

interface FooterSectionProps {
  theme: ThemeConfig
  restaurant: Restaurant
}

export default function FooterSection({ theme, restaurant }: FooterSectionProps) {
  return (
    <footer className={`${theme.footerBg} border-t ${theme.border} px-6 py-12`}>
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className={`mb-1 text-lg font-bold ${theme.heading} ${theme.footerText}`}>
              {restaurant.name}
            </p>
            {restaurant.cuisine_type && (
              <p className={`text-sm ${theme.footerText} opacity-70`}>{restaurant.cuisine_type}</p>
            )}
          </div>

          <div>
            <p className={`mb-3 text-xs uppercase tracking-widest ${theme.footerText} opacity-50`}>Contact</p>
            <div className={`space-y-1.5 text-sm ${theme.footerText} opacity-80`}>
              {restaurant.address && (
                <p>{restaurant.address}{restaurant.city ? `, ${restaurant.city}` : ''}</p>
              )}
              {restaurant.phone && (
                <p>
                  <a href={`tel:${restaurant.phone}`} className="hover:opacity-100 transition-opacity">
                    {restaurant.phone}
                  </a>
                </p>
              )}
              {restaurant.email && (
                <p>
                  <a href={`mailto:${restaurant.email}`} className="hover:opacity-100 transition-opacity">
                    {restaurant.email}
                  </a>
                </p>
              )}
            </div>
          </div>

          <div>
            <p className={`mb-3 text-xs uppercase tracking-widest ${theme.footerText} opacity-50`}>Quick Links</p>
            <div className={`space-y-1.5 text-sm ${theme.footerText} opacity-80`}>
              <p><a href="#menu" className="hover:opacity-100 transition-opacity">Menu</a></p>
              <p><a href="#reserve" className="hover:opacity-100 transition-opacity">Reservations</a></p>
              <p><a href="#hours" className="hover:opacity-100 transition-opacity">Hours &amp; Contact</a></p>
            </div>
          </div>
        </div>

        <div className={`mt-10 border-t ${theme.border} pt-6 text-center text-xs ${theme.footerText} opacity-50`}>
          © {new Date().getFullYear()} {restaurant.name} · All rights reserved
        </div>
      </div>
    </footer>
  )
}
