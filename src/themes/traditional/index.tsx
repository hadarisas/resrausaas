import type { ThemeProps } from '@/themes/types'
import { themeConfigs } from '@/themes/shared/theme-config'
import NavBar from '@/themes/shared/NavBar'
import HeroSection from '@/themes/shared/HeroSection'
import MenuSection from '@/themes/shared/MenuSection'
import AboutSection from '@/themes/shared/AboutSection'
import GallerySection from '@/themes/shared/GallerySection'
import ReservationSection from '@/themes/shared/ReservationSection'
import OpeningHoursSection from '@/themes/shared/OpeningHoursSection'
import FooterSection from '@/themes/shared/FooterSection'
import StickyReserveCTA from '@/themes/shared/StickyReserveCTA'

export default function TraditionalTheme({ restaurant, categories, openingHours, restaurantId }: ThemeProps) {
  const t = themeConfigs['traditional']
  return (
    <div className={`min-h-screen ${t.bg} ${t.text} ${t.heading}`}>
      <NavBar theme={t} restaurantName={restaurant.name} logoUrl={restaurant.logo_url} />
      <HeroSection theme={t} restaurant={restaurant} />
      <MenuSection theme={t} categories={categories} />
      <AboutSection theme={t} restaurant={restaurant} />
      <GallerySection theme={t} categories={categories} coverImageUrl={restaurant.cover_image_url} />
      <ReservationSection theme={t} restaurantId={restaurantId} maxPartySize={restaurant.max_party_size} />
      <OpeningHoursSection theme={t} openingHours={openingHours} restaurant={restaurant} />
      <FooterSection theme={t} restaurant={restaurant} />
      <StickyReserveCTA theme={t} />
    </div>
  )
}
