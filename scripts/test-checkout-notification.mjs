/**
 * The paid-notification builder, run against made-up Stripe sessions.
 *
 *   npm run test:notification
 *
 * Exists because of 8 September 2026: the first live deposit notification
 * arrived with Phone and Address blank. Phone was collected and dropped in
 * two places; Address is never asked at checkout and now says so.
 */
import assert from 'node:assert/strict';
import { buildCheckoutNotification, ADDRESS_LATER } from '../lib/checkoutNotification.ts';

let n = 0;
const ok = (label, cond) => { n++; if (!cond) { console.error(`✕ ${label}`); process.exit(1); } console.log(`✔ ${label}`); };

// Architectural deposit, as the calculator now sends it.
const deposit = buildCheckoutNotification({
  id: 'cs_test_1',
  amount_total: 14900,
  customer_details: { email: 'jane@example.com', name: 'Jane Example', phone: null },
  metadata: {
    payment_type: 'deposit_50', fee_total: '298', base: '298', uplift: '0', factors: '0', gia: '101',
    name: 'Jane Example', phone: '07700 900123', existing_use: 'House', proposed_use: 'HMO', address: '',
  },
}, new Date('2026-09-08T15:52:28Z'));
ok('deposit: phone comes through', deposit.Phone === '07700 900123');
ok('deposit: address says it comes with the brief', deposit.Address === ADDRESS_LATER);
ok('deposit: scheme reads House to HMO', deposit.Scheme === 'House to HMO');
ok('deposit: balance is the other half', deposit['Balance due'] === '£149');
ok('deposit: subject falls back to the name', deposit._subject === 'PAID feasibility deposit: Jane Example (£149)');

// Automated tier, unchanged shape.
const auto = buildCheckoutNotification({
  id: 'cs_test_2', amount_total: 4999, customer_email: 'a@example.com',
  metadata: { payment_type: 'automated_full', name: 'A Person', phone: '07700 900456' },
});
ok('automated: phone comes through', auto.Phone === '07700 900456');
ok('automated: subject names the tier', auto._subject.startsWith('PAID Automated Site Feasibility: A Person'));
ok('automated: no scheme row content', auto.Scheme === '');

// An old session with no phone anywhere: falls back to Stripe, then empty.
const old = buildCheckoutNotification({ id: 'cs_test_3', amount_total: 29800, metadata: { payment_type: 'deposit_50', fee_total: '298' }, customer_details: { phone: '+441234567890' } });
ok('legacy: Stripe phone used when metadata has none', old.Phone === '+441234567890');
assert.equal(Object.keys(deposit).length, 16);
console.log(`${n} checks passed`);
