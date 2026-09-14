/**
 * Ed's acceptance criteria for the feasibility disclaimer, section 7 of his
 * brief, run against a built site.
 *
 * The one that matters most is the last: "Submitting with the box unticked
 * fails, with the error message at 5.3 — and still fails when the request is
 * sent directly, bypassing the browser." A checkbox that is only enforced in
 * JavaScript is explicitly listed under what he does not want, so that check
 * posts straight to the API with no page involved.
 *
 * Needs a built site running:
 *   npm run build:local && npx next start -p 3111
 *   npm run test:disclaimer
 */
import { chromium } from 'playwright';

const BASE = process.env.ANALYTICS_ORIGIN || 'http://localhost:3111';
const ERROR_5_3 =
  'Please confirm you have read and accept the Feasibility Report — Basis and Limitations before continuing.';

const browser = await chromium.launch();
const fails = [];
const ok = (l, c, x = '') => { console.log(`${c ? 'PASS' : 'FAIL'}  ${l}${x ? '  ' + x : ''}`); if (!c) fails.push(l); };

// --- the disclaimer page ----------------------------------------------------
const page = await browser.newPage();
const res = await page.goto(`${BASE}/feasibility-disclaimer`, { waitUntil: 'load' });
ok('the disclaimer page loads at its own URL', res.status() === 200, String(res.status()));
const body = await page.locator('body').innerText();
ok('it shows a version number and date', /Version 1\.0 — 25 August 2026/.test(body));
ok('the full text is there, not truncated', body.includes('The limit of our financial responsibility') && body.includes('governed by the law of England and Wales'));
ok('nothing is hidden behind an accordion', (await page.locator('details').count()) === 0);
// Ed set both figures on 9 September 2026 and settled the cap wording on the
// 11th: the greater of £1,000,000 and ten times the fee, PI limit £1,000,000.
// Before that they rendered as visible gaps rather than invented numbers; now
// the check is that neither gap is left.
ok('the two money figures are the ones Ed set, with no gap left', /limited in aggregate to the greater of \(a\) £1,000,000 and \(b\) ten times the fees/.test(body) && body.includes('limit of indemnity of £1,000,000') && !body.includes('[amount to be confirmed]'));

// --- the acceptance step, on both checkouts ---------------------------------

/**
 * The architectural block only appears once a fee has been revealed, so the
 * seven-question form has to be answered first. Every answer below is chosen to
 * reach a price: a masterplan or whole-site redevelopment routes to an Expert
 * Session instead and never shows a pay button.
 */
const revealArchitecturalFee = async (p) => {
  const pick = async (field, option) => {
    const f = p.locator('div').filter({ hasText: new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).last();
    await f.getByRole('button', { name: option, exact: true }).first().click();
  };
  await p.getByPlaceholder('e.g. 240').fill('240');
  await pick('What is it now', 'Office');
  await pick('What do you want it to become', 'HMO');
  await pick('How many separate buildings', 'One');
  await pick('How many design options', 'One preferred option');
  await p.getByPlaceholder('Full name').fill('Test Client');
  await p.getByPlaceholder('Email').fill('test@example.com');
  await p.getByPlaceholder('Phone').fill('07000000000');
  await p.getByRole('button', { name: 'Get My Instant Fixed Fee' }).click();
  await p.waitForTimeout(1200);
};

for (const [label, url, boxId, payButton] of [
  ['pricing calculator', `${BASE}/pricing`, '#disclaimer-architectural', /Secure My Feasibility/i],
  ['automated £49.99', `${BASE}/feasibility-package`, '#disclaimer-automated', /Pay .* Now/i],
]) {
  const p = await browser.newPage({ viewport: { width: 1280, height: 1100 } });
  await p.goto(url, { waitUntil: 'load' });
  if (boxId === '#disclaimer-architectural') await revealArchitecturalFee(p);

  const box = p.locator(boxId);
  ok(`${label}: the tick box is on the pay screen`, (await box.count()) > 0);
  if (await box.count()) {
    await box.scrollIntoViewIfNeeded();
    ok(`${label}: unticked on a fresh load`, !(await box.isChecked()));
    ok(`${label}: the summary block is shown`, (await p.locator('text=Before you instruct us').count()) > 0);
    const link = p.locator(`a[href="/feasibility-disclaimer"]`).first();
    ok(`${label}: the full text is one click away, in a new tab`, (await link.getAttribute('target')) === '_blank');

    // Opening the full text must not lose anything already typed. R2.2.
    //
    // Scoped to the block that owns this tick box. /feasibility-package used to
    // render the shared calculator further down the page too, with a second
    // set of identically placeholdered contact fields; that went with item 71
    // (one calculator, on /pricing), but the scoping is kept so the check stays
    // honest if the page ever grows another form.
    if (boxId === '#disclaimer-automated') {
      // The nearest ancestor that also holds the contact fields.
      const block = p.locator(boxId).locator('xpath=ancestor::div[.//input[@placeholder="Full name"]][1]');
      await block.getByPlaceholder('Full name').fill('Kept On Screen');
      await link.click({ modifiers: ['Meta'] }).catch(() => {});
      await p.waitForTimeout(400);
      ok(`${label}: opening the text does not clear the form`,
        (await block.getByPlaceholder('Full name').inputValue()) === 'Kept On Screen');
      await block.getByPlaceholder('Email').fill('test@example.com');
      await block.getByPlaceholder('Phone').fill('07000000000');
    }

    // Same scoping for the pay button, for the same reason.
    const payScope = boxId === '#disclaimer-automated'
      ? p.locator(boxId).locator('xpath=ancestor::div[.//input[@placeholder="Full name"]][1]')
      : p;
    await payScope.getByRole('button', { name: payButton }).first().click();
    await p.waitForTimeout(700);
    const err = p.locator('[role="alert"]').filter({ hasText: 'Please confirm you have read' });
    ok(`${label}: paying without ticking shows the 5.3 error`, (await err.count()) > 0);
    await box.check();
    await p.waitForTimeout(300);
    ok(`${label}: the error clears once ticked`, (await err.count()) === 0);
  }
  await p.close();
}

// --- the server-side block, with no browser involved ------------------------
const post = async (payload) => {
  const r = await fetch(`${BASE}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return { status: r.status, body: await r.json().catch(() => ({})) };
};

const base = { tier: 'automated', email: 'test@example.com', name: 'Test', phone: '07000000000' };

let r = await post(base);
ok('a direct request with no tick is refused', r.status === 422, `got ${r.status}`);
ok('and answers with the wording at 5.3', r.body?.error === ERROR_5_3, JSON.stringify(r.body).slice(0, 120));

r = await post({ ...base, disclaimerAccepted: false });
ok('an explicit false is refused', r.status === 422, `got ${r.status}`);

// The three shapes a hand-rolled client is most likely to send.
for (const v of ['true', 1, 'on']) {
  r = await post({ ...base, disclaimerAccepted: v });
  ok(`a truthy ${JSON.stringify(v)} is not accepted as a tick`, r.status === 422, `got ${r.status}`);
}

// The happy path is checked locally only. Against production it would reach
// Stripe with live keys and leave a real, never-paid Checkout Session behind,
// which is litter in someone's dashboard. Everything above is a refusal, so
// none of it touches Stripe.
if (BASE.includes('localhost')) {
  r = await post({ ...base, disclaimerAccepted: true, disclaimerVersion: '1.0' });
  ok('a genuine tick gets past the gate', r.status !== 422, `got ${r.status}`);
} else {
  console.log('SKIP  a genuine tick gets past the gate  (would create a live Stripe session)');
}

await browser.close();
console.log(fails.length ? `\n${fails.length} failing check(s).` : '\nAll checks pass.');
process.exit(fails.length ? 1 : 0);
