import type { ThemeProps } from '@/themes/types'
import { themeConfigs } from '@/themes/shared/theme-config'
import MinimalNavBar from './sections/MinimalNavBar'
import MinimalHeroSection from './sections/MinimalHeroSection'
import MinimalMenuSection from './sections/MinimalMenuSection'
import MinimalAboutSection from './sections/MinimalAboutSection'
import MinimalGallerySection from './sections/MinimalGallerySection'
import MinimalReservationSection from './sections/MinimalReservationSection'
import MinimalOpeningHoursSection from './sections/MinimalOpeningHoursSection'
import MinimalFooterSection from './sections/MinimalFooterSection'
import MinimalStickyReserveCTA from './sections/MinimalStickyReserveCTA'

export default function MinimalTheme({ restaurant, categories, openingHours, restaurantId }: ThemeProps) {
  const t = themeConfigs['minimal']
  return (
    <div className={`min-h-screen ${t.bg} ${t.text} pb-24 font-sans antialiased sm:pb-0`}>
      <MinimalNavBar theme={t} restaurantName={restaurant.name} logoUrl={restaurant.logo_url} />
      <MinimalHeroSection theme={t} restaurant={restaurant} />
      <MinimalMenuSection theme={t} categories={categories} />
      <MinimalAboutSection theme={t} restaurant={restaurant} />
      <MinimalGallerySection theme={t} categories={categories} coverImageUrl={restaurant.cover_image_url} />
      <MinimalReservationSection theme={t} restaurantId={restaurantId} maxPartySize={restaurant.max_party_size} />
      <MinimalOpeningHoursSection theme={t} openingHours={openingHours} restaurant={restaurant} />
      <MinimalFooterSection theme={t} restaurant={restaurant} />
      <MinimalStickyReserveCTA theme={t} />
    </div>
  )
}
