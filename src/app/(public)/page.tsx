import type { Metadata } from 'next'
import { saasLandingContent } from '@/lib/data/saas-landing-dummy'
import { SaasNav } from '@/components/saas-landing/SaasNav'
import { HeroSection } from '@/components/saas-landing/HeroSection'
import { ProductFeaturesSection } from '@/components/saas-landing/ProductFeaturesSection'
import { MenuSection } from '@/components/saas-landing/MenuSection'
import { AboutSection } from '@/components/saas-landing/AboutSection'
import { ReservationForm } from '@/components/saas-landing/ReservationForm'
import { GallerySection } from '@/components/saas-landing/GallerySection'
import { Footer } from '@/components/saas-landing/Footer'
import { StickyReserveCta } from '@/components/saas-landing/StickyReserveCta'

export const metadata: Metadata = {
  title: 'TableFlow — Restaurant Management Made Simple',
  description:
    'Launch your restaurant online in minutes. Beautiful landing pages, reservation management, menu builder, and revenue tracking — all in one platform.',
}

export default function HomePage() {
  const c = saasLandingContent
  const s = c.sections

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <SaasNav brandName={c.brandName} />
      <main>
        <HeroSection content={c.hero} />
        <ProductFeaturesSection features={c.productFeatures} />
        <MenuSection
          categories={c.menuCategories}
          eyebrow={s.menu.eyebrow}
          title={s.menu.title}
          description={s.menu.description}
        />
        <AboutSection
          eyebrow={s.about.eyebrow}
          title={s.about.title}
          body={s.about.body}
          imageUrl={s.about.imageUrl}
          imageAlt={s.about.imageAlt}
        />
        <ReservationForm copy={s.reservation} />
        <GallerySection
          images={c.gallery}
          eyebrow={s.gallery.eyebrow}
          title={s.gallery.title}
          description={s.gallery.description}
        />
      </main>
      <Footer
        brandName={c.brandName}
        tagline={c.footer.tagline}
        email={c.footer.email}
        phone={c.footer.phone}
        address={c.footer.address}
        social={c.footer.social}
      />
      <StickyReserveCta />
    </div>
  )
}
