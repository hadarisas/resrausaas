import Link from 'next/link'
import { UtensilsCrossed } from 'lucide-react'
import type { SaasFooterSocial } from '@/lib/data/saas-landing-dummy'

type Props = {
  brandName: string
  tagline: string
  email: string
  phone: string
  address: string
  social: SaasFooterSocial[]
}

export function Footer({ brandName, tagline, email, phone, address, social }: Props) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-stone-800 bg-stone-950 text-stone-400">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-stone-100">
              <UtensilsCrossed className="h-5 w-5 text-amber-400" aria-hidden />
              <span className="font-sans font-semibold">{brandName}</span>
            </div>
            <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed">{tagline}</p>
          </div>
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-stone-500">Contact</h3>
            <ul className="mt-4 space-y-2 font-sans text-sm">
              <li>
                <a href={`mailto:${email}`} className="text-stone-300 transition hover:text-white">
                  {email}
                </a>
              </li>
              <li>
                <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-stone-300 transition hover:text-white">
                  {phone}
                </a>
              </li>
              <li className="text-stone-500">{address}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-stone-500">Social</h3>
            <ul className="mt-4 flex flex-wrap gap-4">
              {social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-stone-300 transition hover:text-white"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4 font-sans text-sm">
              <Link href="/login" className="text-stone-400 hover:text-white">
                Sign in
              </Link>
              <Link href="/signup" className="text-amber-400/90 hover:text-amber-300">
                Get started
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-stone-800/80 pt-8 font-sans text-xs text-stone-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {brandName}. All rights reserved.</p>
          <p className="text-stone-600">
            Photos via{' '}
            <a href="https://unsplash.com" className="underline-offset-2 hover:text-stone-400 hover:underline" target="_blank" rel="noreferrer">
              Unsplash
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
