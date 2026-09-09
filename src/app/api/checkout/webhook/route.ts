import { NextResponse } from 'next/server';
import { buildCheckoutNotification } from '@/lib/checkoutNotification';
import { createHmac, timingSafeEqual } from 'node:crypto';

export const runtime = 'nodejs';

// Stripe webhook for paid feasibilities.
//
// This exists because the success redirect is not a reliable signal. It fires
// in the customer's browser, and a customer can close the tab, lose signal, or
// have the redirect blocked, all after their card has been charged. Stripe
// retries this endpoint until it gets a 2xx, so it is the only place a payment
// can be treated as final.
//
// Signature verification is done by hand rather than with the Stripe SDK, for
// the same reason the checkout route is: no dependency to install or keep
// current. The scheme is Stripe's standard one, HMAC-SHA256 over
// "<timestamp>.<raw body>" keyed by the webhook signing secret.
//
// Needs STRIPE_WEBHOOK_SECRET (whsec_...) from the Stripe dashboard endpoint.
// Without it the route rejects everything rather than trusting unsigned posts,
// because an unverified webhook is an open endpoint that lets anyone claim a
// feasibility has been paid for.

const FEASIBILITY_ENDPOINT = 'https://formspree.io/p/3042010600814149049/f/feasibility';
/** Stripe's recommended replay window. */
const TOLERANCE_SECONDS = 300;

function verify(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(',').map((kv) => {
      const [k, ...v] = kv.split('=');
      return [k.trim(), v.join('=')];
    }),
  );
  const timestamp = Number(parts.t);
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  // Reject anything outside the tolerance so a captured request cannot be
  // replayed later.
  if (Math.abs(Date.now() / 1000 - timestamp) > TOLERANCE_SECONDS) return false;

  const expected = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  // Length check first: timingSafeEqual throws on a mismatch rather than
  // returning false.
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET is not set, rejecting');
    return NextResponse.json({ ok: false, error: 'not configured' }, { status: 500 });
  }

  // Raw text, not request.json(). The signature covers the exact bytes Stripe
  // sent, so parsing and re-serialising would break it.
  const raw = await request.text();
  if (!verify(raw, request.headers.get('stripe-signature'), secret)) {
    return NextResponse.json({ ok: false, error: 'bad signature' }, { status: 400 });
  }

  let event: { type?: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  // Anything else is acknowledged and ignored, so Stripe stops retrying events
  // this endpoint has no opinion about.
  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const session = (event.data?.object ?? {}) as Record<string, any>;
  // Built in lib/checkoutNotification.ts so it can be tested without Stripe.
  const payload = buildCheckoutNotification(session);

  try {
    const res = await fetch(FEASIBILITY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      // Non-2xx tells Stripe to retry, which is what we want: the money has
      // been taken and the team does not know about it yet.
      console.error('[webhook] formspree failed', res.status, await res.text().catch(() => ''));
      return NextResponse.json({ ok: false, error: 'notification failed' }, { status: 500 });
    }
  } catch (err) {
    console.error('[webhook] formspree unreachable', err);
    return NextResponse.json({ ok: false, error: 'notification failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
