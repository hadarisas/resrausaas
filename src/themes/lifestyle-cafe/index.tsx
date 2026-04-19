import type { ThemeProps } from '@/themes/types'
import { themeConfigs } from '@/themes/shared/theme-config'
import LifestyleNavBar from './sections/LifestyleNavBar'
import LifestyleHeroSection from './sections/LifestyleHeroSection'
import LifestyleGallerySection from './sections/LifestyleGallerySection'
import LifestyleVibeSection from './sections/LifestyleVibeSection'
import LifestyleMenuSection from './sections/LifestyleMenuSection'
import LifestyleReservationSection from './sections/LifestyleReservationSection'
import LifestyleOpeningHoursSection from './sections/LifestyleOpeningHoursSection'
import LifestyleFooterSection from './sections/LifestyleFooterSection'
import LifestyleStickyReserveCTA from './sections/LifestyleStickyReserveCTA'

export default function LifestyleCafeTheme({ restaurant, categories, openingHours, restaurantId }: ThemeProps) {
  const t = themeConfigs['lifestyle-cafe']
  return (
    <div className={`min-h-screen ${t.bg} ${t.text} pb-24 font-sans antialiased selection:bg-rose-200/40 sm:pb-0`}>
      <LifestyleNavBar theme={t} restaurantName={restaurant.name} logoUrl={restaurant.logo_url} />
      <LifestyleHeroSection theme={t} restaurant={restaurant} />
      <LifestyleGallerySection theme={t} categories={categories} coverImageUrl={restaurant.cover_image_url} />
      <LifestyleVibeSection theme={t} restaurant={restaurant} />
      <LifestyleMenuSection theme={t} categories={categories} />
      <LifestyleReservationSection theme={t} restaurantId={restaurantId} maxPartySize={restaurant.max_party_size} />
      <LifestyleOpeningHoursSection theme={t} openingHours={openingHours} restaurant={restaurant} />
      <LifestyleFooterSection theme={t} restaurant={restaurant} />
      <LifestyleStickyReserveCTA theme={t} />
    </div>
  )
}
