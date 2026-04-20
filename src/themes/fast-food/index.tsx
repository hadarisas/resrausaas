import { PublicEntitlementsChrome, PublicPoweredByFooter } from '@/components/public/PublicEntitlementsChrome'
import type { ThemeProps } from '@/themes/types'
import { themeConfigs } from '@/themes/shared/theme-config'
import FastFoodNavBar from './sections/FastFoodNavBar'
import FastFoodHeroSection from './sections/FastFoodHeroSection'
import FastFoodPromoBar from './sections/FastFoodPromoBar'
import FastFoodQuickPicksSection from './sections/FastFoodQuickPicksSection'
import FastFoodMenuSection from './sections/FastFoodMenuSection'
import FastFoodAboutSection from './sections/FastFoodAboutSection'
import FastFoodGallerySection from './sections/FastFoodGallerySection'
import FastFoodReservationSection from './sections/FastFoodReservationSection'
import FastFoodOpeningHoursSection from './sections/FastFoodOpeningHoursSection'
import FastFoodFooterSection from './sections/FastFoodFooterSection'
import FastFoodStickyReserveCTA from './sections/FastFoodStickyReserveCTA'

export default function FastFoodTheme({ restaurant, categories, openingHours, restaurantId, publicAccess }: ThemeProps) {
  const t = themeConfigs['fast-food']
  return (
    <div className={`min-h-screen ${t.bg} ${t.text} font-sans antialiased`}>
      <PublicEntitlementsChrome publicAccess={publicAccess} />
      <FastFoodNavBar theme={t} restaurantName={restaurant.name} logoUrl={restaurant.logo_url} />
      <FastFoodHeroSection theme={t} restaurant={restaurant} />
      <FastFoodPromoBar theme={t} />
      <FastFoodQuickPicksSection theme={t} categories={categories} />
      <FastFoodMenuSection theme={t} categories={categories} />
      <FastFoodAboutSection theme={t} restaurant={restaurant} />
      <FastFoodGallerySection theme={t} categories={categories} coverImageUrl={restaurant.cover_image_url} />
      <FastFoodReservationSection
        theme={t}
        restaurantId={restaurantId}
        maxPartySize={restaurant.max_party_size}
        reservationsEnabled={publicAccess.reservationsEnabled}
      />
      <FastFoodOpeningHoursSection theme={t} openingHours={openingHours} restaurant={restaurant} />
      <FastFoodFooterSection theme={t} restaurant={restaurant} />
      <PublicPoweredByFooter visible={publicAccess.showPoweredBy} />
      <FastFoodStickyReserveCTA theme={t} enabled={publicAccess.reservationsEnabled} />
    </div>
  )
}
