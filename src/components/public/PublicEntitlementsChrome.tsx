import type { PublicPageAccess } from '@/lib/access/restaurant-access'
import { cn } from '@/lib/utils'

const saasName = process.env.NEXT_PUBLIC_SAAS_BRAND_NAME ?? 'RestaurantSaaS'

/** Top-of-page notices: trial countdown, read-only / brochure reservation notice. */
export function PublicEntitlementsChrome({
  publicAccess,
  className,
}: {
  publicAccess: PublicPageAccess
  className?: string
}) {
  const showTrialStrip =
    publicAccess.showTrialBranding && publicAccess.trialDaysRemaining !== null

  if (!showTrialStrip && !publicAccess.storefrontLimited) return null

  return (
    <div className={cn('w-full space-y-0', className)} role="region" aria-label="Site notices">
      {showTrialStrip && (
        <div className="border-b border-amber-200/80 bg-amber-50/95 px-4 py-2 text-center text-xs font-medium text-amber-950 sm:text-sm">
          Free trial · {publicAccess.trialDaysRemaining}{' '}
          {publicAccess.trialDaysRemaining === 1 ? 'day' : 'days'} left · {saasName}
        </div>
      )}
      {publicAccess.storefrontLimited && (
        <div className="border-b border-amber-200/70 bg-amber-50/90 px-4 py-2.5 text-center text-sm text-amber-950">
          Online reservations are temporarily unavailable for this restaurant.
        </div>
      )}
    </div>
  )
}

/** Subtle footer line during trial; hidden for paying tenants unless env forces it. */
export function PublicPoweredByFooter({ visible }: { visible: boolean }) {
  if (!visible) return null
  const label = process.env.NEXT_PUBLIC_SAAS_BRAND_NAME ?? 'RestaurantSaaS'
  return (
    <div className="border-t border-black/[0.06] bg-black/[0.02] py-3 text-center text-[11px] text-muted-foreground">
      Powered by <span className="font-medium text-foreground/80">{label}</span>
    </div>
  )
}
