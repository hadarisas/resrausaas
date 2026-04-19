import { STATUS_LABELS, type ReservationStatus } from '@/types/reservation'
import { getBrevoTransporter, getDefaultFromAddress, isBrevoConfigured } from '@/lib/email/brevo-smtp'

export type ReservationEmailRow = {
  guest_name: string
  guest_email: string
  reservation_date: string
  reservation_time: string
  party_size: number
  restaurants: { name: string; slug: string } | null
}

function formatWhen(dateStr: string, timeStr: string): string {
  try {
    const d = new Date(`${dateStr}T${timeStr.length === 5 ? timeStr + ':00' : timeStr}`)
    if (Number.isNaN(d.getTime())) return `${dateStr} at ${timeStr}`
    return d.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return `${dateStr} at ${timeStr}`
  }
}

/**
 * Notifies the guest that the restaurant updated their reservation status.
 * Failures are logged only — DB update already succeeded.
 */
export async function sendReservationStatusUpdateEmail(
  row: ReservationEmailRow,
  previousStatus: ReservationStatus,
  newStatus: ReservationStatus
): Promise<void> {
  if (!isBrevoConfigured()) {
    console.warn('[email] Brevo not configured; skipping reservation status email.')
    return
  }

  if (previousStatus === newStatus) return

  const restaurantName = row.restaurants?.name ?? 'the restaurant'
  const labelPrev = STATUS_LABELS[previousStatus]
  const labelNew = STATUS_LABELS[newStatus]
  const when = formatWhen(row.reservation_date, row.reservation_time)

  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? ''
  const slug = row.restaurants?.slug
  const publicLink = site && slug ? `${site}/${slug}` : undefined

  const subject = `Reservation ${labelNew} — ${restaurantName}`

  const text = [
    `Hi ${row.guest_name},`,
    '',
    `${restaurantName} has updated your reservation status from "${labelPrev}" to "${labelNew}".`,
    '',
    `When: ${when}`,
    `Party size: ${row.party_size}`,
    '',
    publicLink ? `Restaurant page: ${publicLink}` : '',
    '',
    'If you have questions, reply to this email or contact the restaurant directly.',
    '',
    '— TableFlow',
  ]
    .filter(Boolean)
    .join('\n')

  const html = `
    <p>Hi ${escapeHtml(row.guest_name)},</p>
    <p><strong>${escapeHtml(restaurantName)}</strong> has updated your reservation status from
    <strong>${escapeHtml(labelPrev)}</strong> to <strong>${escapeHtml(labelNew)}</strong>.</p>
    <p><strong>When:</strong> ${escapeHtml(when)}<br/>
    <strong>Party size:</strong> ${row.party_size}</p>
    ${
      publicLink
        ? `<p><a href="${escapeHtml(publicLink)}">View restaurant page</a></p>`
        : ''
    }
    <p style="color:#666;font-size:14px;">If you have questions, contact the restaurant directly.</p>
    <p style="color:#999;font-size:12px;">Sent via TableFlow</p>
  `

  try {
    const transporter = getBrevoTransporter()
    const from = getDefaultFromAddress()
    await transporter.sendMail({
      from: `${restaurantName} (via TableFlow) <${from}>`,
      replyTo: from,
      to: row.guest_email,
      subject,
      text,
      html,
    })
  } catch (e) {
    console.error('[email] Failed to send reservation status email:', e)
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
