import type { ThemeProps } from '@/themes/types'
import { themeConfigs } from '@/themes/shared/theme-config'
import FineDiningNavBar from './sections/FineDiningNavBar'
import FineDiningHeroSection from './sections/FineDiningHeroSection'
import FineDiningMenuSection from './sections/FineDiningMenuSection'
import FineDiningAboutSection from './sections/FineDiningAboutSection'
import FineDiningGallerySection from './sections/FineDiningGallerySection'
import FineDiningReservationSection from './sections/FineDiningReservationSection'
import FineDiningOpeningHoursSection from './sections/FineDiningOpeningHoursSection'
import FineDiningFooterSection from './sections/FineDiningFooterSection'
import FineDiningStickyReserveCTA from './sections/FineDiningStickyReserveCTA'

export default function FineDiningTheme({ restaurant, categories, openingHours, restaurantId }: ThemeProps) {
  const t = themeConfigs['fine-dining']
  return (
    <div className={`min-h-screen ${t.bg} ${t.text} font-sans antialiased selection:bg-amber-900/30`}>
      <FineDiningNavBar theme={t} restaurantName={restaurant.name} logoUrl={restaurant.logo_url} />
      <FineDiningHeroSection theme={t} restaurant={restaurant} />
      <FineDiningMenuSection theme={t} categories={categories} />
      <FineDiningAboutSection theme={t} restaurant={restaurant} />
      <FineDiningGallerySection theme={t} categories={categories} coverImageUrl={restaurant.cover_image_url} />
      <FineDiningReservationSection theme={t} restaurantId={restaurantId} maxPartySize={restaurant.max_party_size} />
      <FineDiningOpeningHoursSection theme={t} openingHours={openingHours} restaurant={restaurant} />
      <FineDiningFooterSection theme={t} restaurant={restaurant} />
      <FineDiningStickyReserveCTA theme={t} />
    </div>
  )
}
