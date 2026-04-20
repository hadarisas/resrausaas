import { PublicEntitlementsChrome, PublicPoweredByFooter } from '@/components/public/PublicEntitlementsChrome'
import type { ThemeProps } from '@/themes/types'
import { themeConfigs } from '@/themes/shared/theme-config'
import ModernNavBar from './sections/ModernNavBar'
import ModernHeroSection from './sections/ModernHeroSection'
import ModernMenuSection from './sections/ModernMenuSection'
import ModernAboutSection from './sections/ModernAboutSection'
import ModernGallerySection from './sections/ModernGallerySection'
import ModernReservationSection from './sections/ModernReservationSection'
import ModernOpeningHoursSection from './sections/ModernOpeningHoursSection'
import ModernFooterSection from './sections/ModernFooterSection'
import ModernStickyReserveCTA from './sections/ModernStickyReserveCTA'

export default function ModernTheme({ restaurant, categories, openingHours, restaurantId, publicAccess }: ThemeProps) {
  const t = themeConfigs.modern
  return (
    <div className={`min-h-screen ${t.text} font-sans antialiased`}>
      <PublicEntitlementsChrome publicAccess={publicAccess} />
      <ModernNavBar theme={t} restaurantName={restaurant.name} logoUrl={restaurant.logo_url} />
      <ModernHeroSection theme={t} restaurant={restaurant} />
      <ModernMenuSection theme={t} categories={categories} />
      <ModernAboutSection theme={t} restaurant={restaurant} />
      <ModernGallerySection theme={t} categories={categories} coverImageUrl={restaurant.cover_image_url} />
      <ModernReservationSection
        theme={t}
        restaurantId={restaurantId}
        maxPartySize={restaurant.max_party_size}
        reservationsEnabled={publicAccess.reservationsEnabled}
      />
      <ModernOpeningHoursSection theme={t} openingHours={openingHours} restaurant={restaurant} />
      <ModernFooterSection theme={t} restaurant={restaurant} />
      <PublicPoweredByFooter visible={publicAccess.showPoweredBy} />
      <ModernStickyReserveCTA theme={t} enabled={publicAccess.reservationsEnabled} />
    </div>
  )
}
