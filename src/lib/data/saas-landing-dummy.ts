/**
 * Demo content for the public SaaS marketing homepage only.
 * Images: Unsplash (https://unsplash.com/license) — free to use under their license.
 */

export type SaasMenuItem = {
  id: string
  name: string
  description: string
  price: string
  imageUrl: string
}

export type SaasMenuCategory = {
  id: string
  name: string
  items: SaasMenuItem[]
}

export type SaasGalleryImage = {
  src: string
  alt: string
}

export type SaasFooterSocial = {
  label: string
  href: string
}

export type ProductFeature = {
  title: string
  description: string
  icon: 'layout' | 'calendar' | 'utensils' | 'lineChart'
}

export const saasLandingContent = {
  brandName: 'TableFlow',
  hero: {
    saasEyebrow: 'Restaurant operating software',
    saasHeadline: 'Your menu, bookings, and revenue — one calm dashboard.',
    saasSubheadline:
      'Launch a branded guest experience in minutes. No enterprise bloat — built for independent restaurants who want control without the chaos.',
    demoLabel: 'Live preview',
    /** Shown as context, not the main headline */
    demoVenueName: 'Aurelia',
    demoVenueDescriptor: 'Example guest-facing page — swap in your name, photos, and dishes anytime.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80&auto=format&fit=crop',
  },
  productFeatures: [
    {
      icon: 'layout' as const,
      title: 'Themed landing pages',
      description: 'Five polished themes. Your logo, hours, and story — live when you publish.',
    },
    {
      icon: 'calendar' as const,
      title: 'Reservations',
      description: 'Accept requests 24/7. Filter, confirm, and track status from your phone.',
    },
    {
      icon: 'utensils' as const,
      title: 'Menu builder',
      description: 'Categories, photos, prices, and availability — update once, guests see it instantly.',
    },
    {
      icon: 'lineChart' as const,
      title: 'Revenue log',
      description: 'Manual daily entries and charts so you always know how the week landed.',
    },
  ] satisfies ProductFeature[],
  sections: {
    menu: {
      eyebrow: 'Guest experience',
      title: 'What your diners see',
      description:
        'Sample menu for demo venue “Aurelia”. In TableFlow, this is how dishes appear on your public page after you publish.',
    },
    about: {
      eyebrow: 'Your story',
      title: 'You own the narrative',
      body:
        'TableFlow gives you a dedicated page for your cuisine, team, and atmosphere — not a generic listing. Edit copy and imagery anytime so first-time guests know exactly what to expect before they book.',
      imageUrl:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80&auto=format&fit=crop',
      imageAlt: 'Restaurant interior with guests dining',
    },
    reservation: {
      eyebrow: 'Try the flow',
      title: 'Guest booking (demo)',
      description:
        'No data is saved here — it mimics the reservation form your guests use once you go live. Sign up to connect the real thing.',
    },
    gallery: {
      eyebrow: 'Visual story',
      title: 'Gallery on your public page',
      description:
        'Show the room, the plates, the vibe. Replace these placeholders with photography from your own restaurant.',
    },
  },
  menuCategories: [
    {
      id: 'starters',
      name: 'Starters',
      items: [
        {
          id: 's1',
          name: 'Burrata & heirloom tomato',
          description: 'Basil oil, aged balsamic, toasted sourdough',
          price: '$18',
          imageUrl:
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop',
        },
        {
          id: 's2',
          name: 'Seared scallops',
          description: 'Cauliflower purée, crispy pancetta, lemon butter',
          price: '$24',
          imageUrl:
            'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80&auto=format&fit=crop',
        },
        {
          id: 's3',
          name: 'Wild mushroom tart',
          description: 'Truffle cream, chive oil, microgreens',
          price: '$16',
          imageUrl:
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop',
        },
      ],
    },
    {
      id: 'mains',
      name: 'Mains',
      items: [
        {
          id: 'm1',
          name: 'Dry-aged ribeye',
          description: 'Charred spring onion, red wine jus, hand-cut fries',
          price: '$48',
          imageUrl:
            'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format&fit=crop',
        },
        {
          id: 'm2',
          name: 'Pan-roasted halibut',
          description: 'Saffron velouté, fennel salad, caper brown butter',
          price: '$42',
          imageUrl:
            'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&auto=format&fit=crop',
        },
        {
          id: 'm3',
          name: 'Hand-cut pappardelle',
          description: 'Slow-braised lamb ragù, pecorino, fresh oregano',
          price: '$32',
          imageUrl:
            'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80&auto=format&fit=crop',
        },
      ],
    },
    {
      id: 'desserts',
      name: 'Desserts',
      items: [
        {
          id: 'd1',
          name: 'Dark chocolate soufflé',
          description: 'Vanilla anglaise, Maldon salt',
          price: '$14',
          imageUrl:
            'https://images.unsplash.com/photo-1583208096263-c4141ffd63ca?w=800&q=80&auto=format&fit=crop',
        },
        {
          id: 'd2',
          name: 'Citrus olive oil cake',
          description: 'Whipped mascarpone, blood orange',
          price: '$12',
          imageUrl:
            'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80&auto=format&fit=crop',
        },
      ],
    },
  ] satisfies SaasMenuCategory[],
  gallery: [
    {
      src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80&auto=format&fit=crop',
      alt: 'Restaurant interior with warm lighting',
    },
    {
      src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=900&q=80&auto=format&fit=crop',
      alt: 'Chef plating a dish',
    },
    {
      src: 'https://images.unsplash.com/photo-1532117472055-4d0734b51f31?w=900&q=80&auto=format&fit=crop',
      alt: 'Wine glasses on a table',
    },
    {
      src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=900&q=80&auto=format&fit=crop',
      alt: 'Fresh ingredients on a board',
    },
    {
      src: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=80&auto=format&fit=crop',
      alt: 'Cocktail at the bar',
    },
    {
      src: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=900&q=80&auto=format&fit=crop',
      alt: 'Guests dining together',
    },
  ] satisfies SaasGalleryImage[],
  footer: {
    tagline: 'Restaurant management, reservations, and menus — beautifully simple.',
    email: 'hello@tableflow.app',
    phone: '+212 6 00 00 00 00',
    address: 'Av. Allal ben Abdallah, Rabat, Morocco',
    social: [
      { label: 'Instagram', href: 'https://instagram.com' },
      { label: 'Facebook', href: 'https://facebook.com' },
    ] satisfies SaasFooterSocial[],
  },
}
