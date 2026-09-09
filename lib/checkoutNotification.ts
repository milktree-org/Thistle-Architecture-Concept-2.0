/**
 * The email the team gets when a Stripe checkout completes.
 *
 * Pulled out of the webhook route so it can be run against a made-up session
 * without a Stripe signature or a Formspree post. The route itself only
 * verifies, parses and forwards.
 *
 * Address is not asked for at checkout on either tier. It arrives with the
 * detailed brief, so the row says so rather than sitting blank and looking
 * like a bug (which is exactly what it looked like on 8 September 2026).
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export const ADDRESS_LATER = 'Not asked at checkout. Comes with the detailed brief.';

export function buildCheckoutNotification(session: Record<string, any>, paidAt = new Date()): Record<string, string> {
  const meta = (session.metadata ?? {}) as Record<string, string>;
  const amount = typeof session.amount_total === 'number' ? session.amount_total / 100 : null;
  // Since Ed's August 2026 final brief, the Architectural Feasibility charges a
  // 50% holding deposit rather than the full fee, and the Automated Site
  // Feasibility charges its flat £49.99 in full. The metadata says which, so an
  // older full-fee architectural session paid late still reports correctly.
  const isDeposit = meta.payment_type === 'deposit_50';
  const isAutomated = meta.payment_type === 'automated_full';

  const scheme = [meta.existing_use, meta.proposed_use].filter(Boolean).join(' to ');

  return {
    _subject: isAutomated
      ? `PAID Automated Site Feasibility: ${meta.name || 'name not captured'} (£${amount ?? '?'})`
      : `PAID feasibility ${isDeposit ? 'deposit' : ''}: ${meta.address || meta.name || 'not captured'} (£${amount ?? '?'})`,
    Status: isAutomated
      ? 'Paid in full, awaiting detailed brief. No design review at this tier.'
      : isDeposit
        ? 'Deposit paid, awaiting detailed brief. Balance due before delivery.'
        : 'Paid, awaiting project setup',
    Amount: amount === null ? 'unknown' : `£${amount}`,
    'Fixed fee (total)': meta.fee_total ? `£${meta.fee_total}` : '',
    'Balance due': isDeposit && amount !== null && meta.fee_total ? `£${Number(meta.fee_total) - amount}` : '',
    Email: session.customer_details?.email ?? session.customer_email ?? '',
    Name: session.customer_details?.name ?? meta.name ?? '',
    // Stripe collects a phone only when asked to, which we do not; the number
    // typed into the calculator or checkout form is the one that counts.
    Phone: meta.phone || session.customer_details?.phone || '',
    Address: meta.address || ADDRESS_LATER,
    Scheme: scheme,
    'Floor area': meta.gia ? `${meta.gia} m²` : '',
    'Base fee': meta.base ? `£${meta.base}` : '',
    'Complexity uplift': meta.uplift ? `£${meta.uplift}` : '',
    'Complexity factors': meta.factors ?? '',
    'Stripe session': session.id ?? '',
    'Paid at': paidAt.toISOString(),
  };
}
