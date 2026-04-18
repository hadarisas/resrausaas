export type ThemeConfig = {
  bg: string
  bgAlt: string
  text: string
  textMuted: string
  heading: string
  accent: string
  accentFg: string
  accentHover: string
  border: string
  card: string
  heroOverlay: string
  navScrolledBg: string
  inputBg: string
  inputBorder: string
  inputFocus: string
  successBg: string
  successText: string
  errorBg: string
  errorText: string
  reservationBg: string
  reservationIsDark: boolean
  footerBg: string
  footerText: string
  formButtonClass: string
}

export const themeConfigs: Record<string, ThemeConfig> = {
  'fine-dining': {
    bg: 'bg-stone-950',
    bgAlt: 'bg-stone-900',
    text: 'text-stone-100',
    textMuted: 'text-stone-400',
    heading: 'font-serif',
    accent: 'bg-amber-400',
    accentFg: 'text-stone-950',
    accentHover: 'hover:bg-amber-300',
    border: 'border-stone-800',
    card: 'bg-stone-900',
    heroOverlay: 'bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/10',
    navScrolledBg: 'bg-stone-950/95',
    inputBg: 'bg-stone-800',
    inputBorder: 'border-stone-700',
    inputFocus: 'focus:border-amber-400',
    successBg: 'bg-amber-400/10',
    successText: 'text-amber-400',
    errorBg: 'bg-red-400/10',
    errorText: 'text-red-400',
    reservationBg: 'bg-stone-900',
    reservationIsDark: true,
    footerBg: 'bg-stone-950',
    footerText: 'text-stone-600',
    formButtonClass: '!bg-amber-400 !text-stone-950 hover:!bg-amber-300',
  },
  'fast-food': {
    bg: 'bg-white',
    bgAlt: 'bg-gray-50',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    heading: 'font-sans',
    accent: 'bg-red-600',
    accentFg: 'text-white',
    accentHover: 'hover:bg-red-700',
    border: 'border-gray-200',
    card: 'bg-white',
    heroOverlay: 'bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/20',
    navScrolledBg: 'bg-white/95',
    inputBg: 'bg-gray-50',
    inputBorder: 'border-gray-200',
    inputFocus: 'focus:border-red-500',
    successBg: 'bg-green-50',
    successText: 'text-green-700',
    errorBg: 'bg-red-50',
    errorText: 'text-red-700',
    reservationBg: 'bg-gray-900',
    reservationIsDark: true,
    footerBg: 'bg-red-600',
    footerText: 'text-red-200',
    formButtonClass: '!bg-red-600 !text-white hover:!bg-red-700',
  },
  'traditional': {
    bg: 'bg-amber-50',
    bgAlt: 'bg-stone-100',
    text: 'text-stone-800',
    textMuted: 'text-stone-500',
    heading: 'font-serif',
    accent: 'bg-amber-700',
    accentFg: 'text-white',
    accentHover: 'hover:bg-amber-800',
    border: 'border-amber-200',
    card: 'bg-white',
    heroOverlay: 'bg-gradient-to-t from-stone-900 via-stone-900/60 to-stone-900/10',
    navScrolledBg: 'bg-amber-50/95',
    inputBg: 'bg-white',
    inputBorder: 'border-amber-200',
    inputFocus: 'focus:border-amber-600',
    successBg: 'bg-green-50',
    successText: 'text-green-700',
    errorBg: 'bg-red-50',
    errorText: 'text-red-700',
    reservationBg: 'bg-amber-100',
    reservationIsDark: false,
    footerBg: 'bg-amber-50',
    footerText: 'text-amber-600',
    formButtonClass: '!bg-amber-700 !text-white hover:!bg-amber-800',
  },
  'modern': {
    bg: 'bg-white',
    bgAlt: 'bg-slate-50',
    text: 'text-slate-900',
    textMuted: 'text-slate-500',
    heading: 'font-sans',
    accent: 'bg-indigo-600',
    accentFg: 'text-white',
    accentHover: 'hover:bg-indigo-700',
    border: 'border-slate-200',
    card: 'bg-white',
    heroOverlay: 'bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/10',
    navScrolledBg: 'bg-white/95',
    inputBg: 'bg-slate-50',
    inputBorder: 'border-slate-200',
    inputFocus: 'focus:border-indigo-500',
    successBg: 'bg-green-50',
    successText: 'text-green-700',
    errorBg: 'bg-red-50',
    errorText: 'text-red-700',
    reservationBg: 'bg-slate-50',
    reservationIsDark: false,
    footerBg: 'bg-white',
    footerText: 'text-slate-400',
    formButtonClass: '!bg-indigo-600 !text-white hover:!bg-indigo-700',
  },
  'minimal': {
    bg: 'bg-white',
    bgAlt: 'bg-neutral-100',
    text: 'text-neutral-900',
    textMuted: 'text-neutral-400',
    heading: 'font-mono',
    accent: 'bg-neutral-900',
    accentFg: 'text-white',
    accentHover: 'hover:bg-neutral-700',
    border: 'border-neutral-200',
    card: 'bg-neutral-50',
    heroOverlay: 'bg-gradient-to-t from-neutral-950 via-neutral-900/50 to-transparent',
    navScrolledBg: 'bg-white/95',
    inputBg: 'bg-neutral-50',
    inputBorder: 'border-neutral-200',
    inputFocus: 'focus:border-neutral-900',
    successBg: 'bg-neutral-100',
    successText: 'text-neutral-900',
    errorBg: 'bg-red-50',
    errorText: 'text-red-700',
    reservationBg: 'bg-neutral-100',
    reservationIsDark: false,
    footerBg: 'bg-white',
    footerText: 'text-neutral-300',
    formButtonClass: '!bg-neutral-900 !text-white hover:!bg-neutral-700',
  },
}
