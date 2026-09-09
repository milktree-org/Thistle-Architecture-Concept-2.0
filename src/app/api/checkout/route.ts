import { NextResponse } from 'next/server';
import { getFeasibilityRoute, type ProjectInput } from '@/data/pricingData';
import {
  DISCLAIMER_ERROR,
  disclaimerAccepted,
  type DisclaimerAcceptance,
} from '@/lib/disclaimer';

export const runtime = 'nodejs';

// Checkout for the two paid feasibility products, per Ed's pricing brief and
// his August 2026 final update brief's Feasibility Journey & Pricing Structure.
//
// Architectural Feasibility (tier: 'architectural', the default, and the only
// tier the pricing calculator posts): questionnaire, calculated fixed fee, a
// 50% holding deposit taken now, the balance later.
//
// THE PRICE IS RECALCULATED HERE AND THE CLIENT'S NUMBER IS IGNORED.
//
// That is the whole reason this route takes the answers rather than an amount.
// The calculator shows a price in the browser, so a posted amount is a number
// the customer controls: anyone could send £1 and the session would charge £1.
// The engine is pure and cheap, so it runs again on the server and that result
// is what gets charged. If the two ever disagree, the server wins.
//
// Automated Site Feasibility (tier: 'automated'): a flat £49.99, taken in full
// per the brief ("take the full £49.99 upfront"), because there is no
// questionnaire to price against. No recalculation is possible or needed: the
// fee never varies.
//
// Stripe is not switched on yet. Until STRIPE_SECRET_KEY is set, this returns
// the priced enquiry so the caller can fall back to lead capture rather than
// dropping someone who has already reached a price.

const STRIPE_API = 'https://api.stripe.com/v1/checkout/sessions';
const SITE = 'https://www.thistlearchitecture.co.uk';
const AUTOMATED_FEE_PENCE = 4999;

interface CheckoutBody extends DisclaimerAcceptance {
  tier?: 'architectural' | 'automated';
  project?: ProjectInput;
  email?: string;
  name?: string;
  phone?: string;
  address?: string;
  /** The calculator's two use answers, as typed on screen. For the paid notification only. */
  existingUse?: string;
  proposedUse?: string;
}

async function createSession(form: URLSearchParams, key: string) {
  const res = await fetch(STRIPE_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form,
  });
  const session = (await res.json()) as { url?: string; error?: { message?: string } };
  if (!res.ok || !session.url) {
    console.error('[checkout] stripe rejected the session', session.error?.message);
    return null;
  }
  return session.url;
}

export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  // THE DISCLAIMER GATE, BEFORE ANYTHING ELSE HAPPENS.
  //
  // Ed's brief R2.5: the block is enforced server-side as well as in the
  // browser, because "client-side validation on its own is not enough", and his
  // acceptance criteria test it by sending the request directly and bypassing
  // the page. So this sits above the Stripe key check and above both product
  // branches: there is no route through this handler that reaches a payment
  // without a tick, including the fallback that captures a lead when Stripe is
  // switched off.
  //
  // 422 rather than 400: the request is well formed, it is the state it
  // describes that is not acceptable. The message is section 5.3 verbatim, so a
  // caller that surfaces it shows the client the agreed wording.
  if (!disclaimerAccepted(body)) {
    return NextResponse.json(
      { ok: false, error: DISCLAIMER_ERROR, field: 'disclaimerAccepted' },
      { status: 422 },
    );
  }

  const key = process.env.STRIPE_SECRET_KEY;

  // --- Automated Site Feasibility: flat £49.99, paid in full -----------------
  if (body.tier === 'automated') {
    if (!key) {
      return NextResponse.json({
        ok: true,
        route: 'payment_unavailable',
        price: 49.99,
        message: 'Card payment is not switched on yet.',
      });
    }

    const form = new URLSearchParams({
      mode: 'payment',
      'line_items[0][quantity]': '1',
      'line_items[0][price_data][currency]': 'gbp',
      'line_items[0][price_data][unit_amount]': String(AUTOMATED_FEE_PENCE),
      'line_items[0][price_data][product_data][name]': 'Automated Site Feasibility',
      'line_items[0][price_data][product_data][description]':
        'Fully automated, data-led site appraisal, VAT inclusive. Delivered by email, no design review.',
      success_url: `${SITE}/feasibility-confirmed?session_id={CHECKOUT_SESSION_ID}&tier=automated`,
      cancel_url: `${SITE}/feasibility-package?cancelled=1`,
      'metadata[payment_type]': 'automated_full',
      'metadata[name]': (body.name ?? '').slice(0, 200),
      'metadata[phone]': (body.phone ?? '').slice(0, 60),
    });
    if (body.email) form.set('customer_email', body.email);

    try {
      const url = await createSession(form, key);
      if (!url) return NextResponse.json({ ok: false, error: 'checkout unavailable' }, { status: 502 });
      return NextResponse.json({ ok: true, route: 'payment', url, price: 49.99 });
    } catch (err) {
      console.error('[checkout] stripe unreachable', err);
      return NextResponse.json({ ok: false, error: 'checkout unavailable' }, { status: 502 });
    }
  }

  // --- Architectural Feasibility: computed fee, 50% deposit -------------------
  if (!body?.project) {
    return NextResponse.json({ ok: false, error: 'missing project' }, { status: 400 });
  }

  const route = getFeasibilityRoute(body.project);

  // A project that routes to an Expert Session must never reach payment, even
  // if something in the client asked it to. The brief is explicit: no price is
  // displayed and no payment is requested.
  if (route.route !== 'instant_payment') {
    return NextResponse.json({ ok: true, route: 'expert_session', reason: route.reason });
  }

  if (!key) {
    // Prepared, not live. The caller treats this as "take the lead instead".
    return NextResponse.json({
      ok: true,
      route: 'payment_unavailable',
      price: route.price,
      message: 'Card payment is not switched on yet.',
    });
  }

  // Ed's August 2026 final brief: the customer secures the feasibility with a
  // 50% holding deposit, then completes the detailed brief; the balance
  // follows. Fees are VAT-inclusive. Uplifts of £75 make odd totals possible,
  // so the deposit is computed in pence and can carry 50p exactly.
  const depositPence = Math.round(route.price * 100) / 2;
  const depositLabel = `£${(depositPence / 100).toFixed(2).replace(/\.00$/, '')}`;

  // Stripe's REST API directly, so the project carries no SDK dependency until
  // someone decides it needs one. Amount is in pence.
  const form = new URLSearchParams({
    mode: 'payment',
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'gbp',
    'line_items[0][price_data][unit_amount]': String(depositPence),
    'line_items[0][price_data][product_data][name]': 'Architectural Feasibility: 50% holding deposit',
    'line_items[0][price_data][product_data][description]':
      `50% holding deposit (${depositLabel} of a £${route.price} fixed fee, VAT inclusive). ` +
      'Secures your architectural feasibility, delivered in five working days once your brief is complete.',
    success_url: `${SITE}/feasibility-confirmed?session_id={CHECKOUT_SESSION_ID}&tier=architectural`,
    cancel_url: `${SITE}/pricing?cancelled=1`,
    // The scope that was priced, so a dispute can be settled against what was
    // actually answered rather than what anyone remembers.
    'metadata[gia]': String(body.project.gia ?? ''),
    'metadata[base]': String(route.base),
    'metadata[uplift]': String(route.uplift),
    'metadata[factors]': String(route.factors),
    'metadata[fee_total]': String(route.price),
    'metadata[payment_type]': 'deposit_50',
    'metadata[address]': (body.address ?? '').slice(0, 490),
    'metadata[name]': (body.name ?? '').slice(0, 200),
    // Was missing here while the automated tier above had it, so every
    // deposit notification arrived with no phone number.
    'metadata[phone]': (body.phone ?? '').slice(0, 60),
    'metadata[existing_use]': (body.existingUse ?? '').slice(0, 200),
    'metadata[proposed_use]': (body.proposedUse ?? '').slice(0, 200),
  });
  if (body.email) form.set('customer_email', body.email);

  try {
    const url = await createSession(form, key);
    if (!url) return NextResponse.json({ ok: false, error: 'checkout unavailable' }, { status: 502 });
    return NextResponse.json({ ok: true, route: 'payment', url, price: route.price });
  } catch (err) {
    console.error('[checkout] stripe unreachable', err);
    return NextResponse.json({ ok: false, error: 'checkout unavailable' }, { status: 502 });
  }
}
