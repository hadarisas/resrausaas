import Link from 'next/link'
import { AlertTriangle, Clock } from 'lucide-react'
import type { DashboardAccessMode } from '@/lib/access/restaurant-access'
import type { Database } from '@/types/database'

type Restaurant = Database['public']['Tables']['restaurants']['Row']

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL
const upgradeUrl = process.env.NEXT_PUBLIC_UPGRADE_URL

function TrialCountdownBanner({ trialEndsAt }: { trialEndsAt: string }) {
  const end = new Date(trialEndsAt).getTime()
  const days = Math.max(0, Math.ceil((end - Date.now()) / (24 * 60 * 60 * 1000)))

  return (
    <div className="mb-6 flex gap-3 rounded-2xl border border-violet-200/90 bg-gradient-to-r from-violet-50 to-indigo-50/80 px-4 py-4 text-sm text-violet-950 shadow-sm ring-1 ring-violet-100/80">
      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" aria-hidden />
      <div className="min-w-0">
        <p className="font-semibold tracking-tight">Free trial</p>
        <p className="mt-1.5 leading-relaxed text-violet-950/90">
          {days === 0 ? (
            <>Your trial ends today. Upgrade to keep full access to your dashboard and online bookings.</>
          ) : (
            <>
              <span className="tabular-nums font-semibold">{days}</span> {days === 1 ? 'day' : 'days'} left in your
              trial. Upgrade anytime to stay on a paid plan.
            </>
          )}
        </p>
        {(upgradeUrl || supportEmail) && (
          <p className="mt-3 flex flex-wrap gap-4 text-sm font-medium">
            {upgradeUrl && (
              <Link href={upgradeUrl} className="text-violet-800 underline-offset-4 hover:underline">
                Upgrade
              </Link>
            )}
            {supportEmail && (
              <a href={`mailto:${supportEmail}`} className="text-violet-800 underline-offset-4 hover:underline">
                Contact support
              </a>
            )}
          </p>
        )}
      </div>
    </div>
  )
}

function ReadonlyPlanBanner() {
  return (
    <div className="mb-6 flex gap-3 rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50 via-amber-50 to-amber-100/40 px-4 py-4 text-sm text-amber-950 shadow-sm ring-1 ring-amber-100/80">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
      <div className="min-w-0">
        <p className="font-semibold tracking-tight">Read-only mode</p>
        <p className="mt-1.5 leading-relaxed text-amber-950/90">
          Your plan has expired. You can still view your menu, reservations, and analytics, but changes and online
          bookings are disabled until you upgrade. Your public page stays visible so guests can browse your menu.
        </p>
        {(upgradeUrl || supportEmail) && (
          <p className="mt-3 flex flex-wrap gap-4 text-sm font-medium">
            {upgradeUrl && (
              <Link href={upgradeUrl} className="text-amber-900 underline-offset-4 hover:underline">
                Upgrade to restore access
              </Link>
            )}
            {supportEmail && (
              <a href={`mailto:${supportEmail}`} className="text-amber-900 underline-offset-4 hover:underline">
                Contact support
              </a>
            )}
          </p>
        )}
      </div>
    </div>
  )
}

export function DashboardStatusBanners({
  mode,
  restaurant,
}: {
  mode: DashboardAccessMode
  restaurant: Restaurant
}) {
  const showTrial =
    mode === 'full' && restaurant.access_status === 'trial' && Boolean(restaurant.trial_ends_at)

  return (
    <>
      {showTrial && <TrialCountdownBanner trialEndsAt={restaurant.trial_ends_at} />}
      {mode === 'readonly' && <ReadonlyPlanBanner />}
    </>
  )
}
