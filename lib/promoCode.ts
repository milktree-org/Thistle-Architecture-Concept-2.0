/**
 * Promo codes accepted at both feasibility checkouts.
 *
 * Ed, 29 September 2026: "To claim a place they sign up on the site, pay the
 * deposit and add a promo code ... It covers both the £49.99 report and the
 * full feasibility." Levi confirmed the next day that it is not a money-off
 * code. It only marks the person as one of the Founding 20.
 *
 * So a code changes nothing about the price. It rides into the Stripe metadata
 * and onto the paid notification, and that is how Ed and Jodi know who has
 * claimed a place. The 20-place limit is counted by hand from those emails,
 * because nothing here stores who has already used it.
 *
 * Kept in code, not the CMS: a code is checked on the server, and an editor
 * typo would turn every real code away at the point of payment.
 */

export const PROMO_CODES: Record<string, string> = {
  F20: 'Founding 20',
};

/** Trimmed and upper-cased, so "f20 " and "F20" are the same code. */
export function normalisePromoCode(raw: unknown): string {
  return typeof raw === 'string' ? raw.trim().toUpperCase() : '';
}

/** The code's name if it is one we accept, otherwise null. */
export function promoCodeLabel(raw: unknown): string | null {
  return PROMO_CODES[normalisePromoCode(raw)] ?? null;
}

export const PROMO_CODE_ERROR = 'We do not recognise that code. Check it, or clear the box to carry on.';
