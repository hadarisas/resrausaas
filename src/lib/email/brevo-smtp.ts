import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

/** True when Brevo env vars are set (transactional email can be sent). */
export function isBrevoConfigured(): boolean {
  return Boolean(
    process.env.BREVO_SMTP_USER?.trim() &&
      process.env.BREVO_SMTP_KEY?.trim() &&
      process.env.BREVO_EMAIL_FROM?.trim()
  )
}

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v?.trim()) throw new Error(`Missing required env: ${name}`)
  return v.trim()
}

/** Brevo SMTP (smtp-relay.brevo.com). Uses BREVO_SMTP_USER + BREVO_SMTP_KEY. */
export function getBrevoTransporter(): Transporter {
  const host = process.env.BREVO_SMTP_HOST ?? 'smtp-relay.brevo.com'
  const port = Number(process.env.BREVO_SMTP_PORT ?? 587)

  const user = requireEnv('BREVO_SMTP_USER')
  const pass = requireEnv('BREVO_SMTP_KEY')

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

/** Verified sender in Brevo (Settings → Senders). */
export function getDefaultFromAddress(): string {
  return requireEnv('BREVO_EMAIL_FROM')
}

export async function sendTestEmail(to: string): Promise<void> {
  const transporter = getBrevoTransporter()
  const from = getDefaultFromAddress()

  await transporter.sendMail({
    from: `TableFlow <${from}>`,
    to,
    subject: 'Test email — TableFlow / Brevo',
    text:
      'If you receive this message, Brevo SMTP is configured correctly for TableFlow.\n\nYou can remove the test route or protect it before going to production.',
    html: `<p>If you receive this message, <strong>Brevo SMTP</strong> is configured correctly for TableFlow.</p>
      <p style="color:#666;font-size:13px;">You can disable or protect the <code>/api/test-email</code> route before production.</p>`,
  })
}
