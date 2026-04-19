import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendTestEmail } from '@/lib/email/brevo-smtp'

const bodySchema = z.object({
  to: z.string().email('Valid recipient email required'),
})

/**
 * POST /api/test-email
 * Body: { "to": "you@example.com" }
 *
 * Security:
 * - Local dev: allowed without extra headers.
 * - Production: set EMAIL_TEST_SECRET and send header `x-email-test-secret: <value>`.
 */
function isAllowed(request: Request): boolean {
  if (process.env.NODE_ENV !== 'production') return true
  const secret = process.env.EMAIL_TEST_SECRET
  if (!secret) return false
  return request.headers.get('x-email-test-secret') === secret
}

export async function POST(request: Request) {
  if (!isAllowed(request)) {
    return NextResponse.json(
      {
        error:
          'Forbidden. In production, set EMAIL_TEST_SECRET and send header x-email-test-secret.',
      },
      { status: 403 }
    )
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid body' }, { status: 400 })
  }

  try {
    await sendTestEmail(parsed.data.to)
    return NextResponse.json({ ok: true, message: 'Test email sent.' })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to send email'
    console.error('[test-email]', e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
