import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import type React from 'react'
import { getRestaurantBySlug } from '@/lib/queries/restaurant'
import type { ThemeProps, ThemeName } from '@/themes/types'

export const revalidate = 60

const themeComponents: Record<ThemeName, React.ComponentType<ThemeProps>> = {
  modern:          dynamic(() => import('@/themes/modern')) as React.ComponentType<ThemeProps>,
  'fine-dining':   dynamic(() => import('@/themes/fine-dining')) as React.ComponentType<ThemeProps>,
  'fast-food':     dynamic(() => import('@/themes/fast-food')) as React.ComponentType<ThemeProps>,
  traditional:     dynamic(() => import('@/themes/traditional')) as React.ComponentType<ThemeProps>,
  minimal:         dynamic(() => import('@/themes/minimal')) as React.ComponentType<ThemeProps>,
  'lifestyle-cafe': dynamic(() => import('@/themes/lifestyle-cafe')) as React.ComponentType<ThemeProps>,
}

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getRestaurantBySlug(params.slug)
  if (!data) return {}

  const { restaurant } = data
  return {
    title: `${restaurant.name} — Reserve a Table`,
    description: restaurant.description ?? `Visit ${restaurant.name} and book your table online.`,
    openGraph: {
      title: restaurant.name,
      description: restaurant.description ?? '',
      images: restaurant.cover_image_url ? [restaurant.cover_image_url] : [],
      type: 'website',
    },
  }
}

export default async function RestaurantPage({ params }: Props) {
  const data = await getRestaurantBySlug(params.slug)
  if (!data) notFound()

  const { restaurant, categories, openingHours } = data
  const ThemeComponent = themeComponents[restaurant.theme as ThemeName] ?? themeComponents.modern

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    description: restaurant.description,
    address: restaurant.address
      ? { '@type': 'PostalAddress', streetAddress: restaurant.address, addressLocality: restaurant.city ?? undefined }
      : undefined,
    telephone: restaurant.phone,
    email: restaurant.email,
    url: restaurant.website_url,
    servesCuisine: restaurant.cuisine_type,
    hasMenu: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/${restaurant.slug}#menu`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ThemeComponent
        restaurant={restaurant}
        categories={categories}
        openingHours={openingHours}
        restaurantId={restaurant.id}
      />
    </>
  )
}
