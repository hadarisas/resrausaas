import type { ThemeProps } from '@/themes/types'
import { themeConfigs } from '@/themes/shared/theme-config'
import TraditionalNavBar from './sections/TraditionalNavBar'
import TraditionalHeroSection from './sections/TraditionalHeroSection'
import TraditionalAboutSection from './sections/TraditionalAboutSection'
import TraditionalMenuSection from './sections/TraditionalMenuSection'
import TraditionalGallerySection from './sections/TraditionalGallerySection'
import TraditionalReservationSection from './sections/TraditionalReservationSection'
import TraditionalOpeningHoursSection from './sections/TraditionalOpeningHoursSection'
import TraditionalFooterSection from './sections/TraditionalFooterSection'
import TraditionalStickyReserveCTA from './sections/TraditionalStickyReserveCTA'

export default function TraditionalTheme({ restaurant, categories, openingHours, restaurantId }: ThemeProps) {
  const t = themeConfigs['traditional']
  return (
    <div className={`min-h-screen ${t.text} font-sans antialiased`}>
      <TraditionalNavBar theme={t} restaurantName={restaurant.name} logoUrl={restaurant.logo_url} />
      <TraditionalHeroSection theme={t} restaurant={restaurant} />
      <TraditionalAboutSection theme={t} restaurant={restaurant} />
      <TraditionalMenuSection theme={t} categories={categories} />
      <TraditionalGallerySection theme={t} categories={categories} coverImageUrl={restaurant.cover_image_url} />
      <TraditionalReservationSection theme={t} restaurantId={restaurantId} maxPartySize={restaurant.max_party_size} />
      <TraditionalOpeningHoursSection theme={t} openingHours={openingHours} restaurant={restaurant} />
      <TraditionalFooterSection theme={t} restaurant={restaurant} />
      <TraditionalStickyReserveCTA theme={t} />
    </div>
  )
}
