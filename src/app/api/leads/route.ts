import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Lead captures from the email gates: the three calculators and the sample
// report download. Every one of these is someone handing over their address in
// exchange for a tool, so they are the top of the funnel.
//
// These used to go nowhere. The route forwarded to LEAD_WEBHOOK_URL when that
// was set, and console.logged when it was not, and it has never been set on the
// project, so every lead since launch was written to the Vercel log and lost.
// They now go to Formspree, the same way feasibility enquiries do, so they land
// in a mailbox someone reads.
//
// The form must exist on the Formspree project under the key below or posts
// 404. Recipients live in formspree.json at the repo root, which only takes
// effect once deployed with the Formspree CLI. LEAD_FORMSPREE_ENDPOINT
// overrides the URL if the form ever moves.
const LEAD_ENDPOINT =
  process.env.LEAD_FORMSPREE_ENDPOINT ??
  'https://formspree.io/p/3042010600814149049/f/leads';

// The Class MA checker has its own Formspree form so it can carry an
// autoresponse without that autoresponse reaching everyone else. The `leads`
// form is shared by both calculators, the sample report download and the
// contact page, and a Class MA prior-approval checklist landing in a contact
// enquiry reply would be worse than sending nothing.
//
// Any source without an entry here falls back to the shared form and simply
// gets no autoresponse, which is the current behaviour for all of them.
const FORM_BY_SOURCE: Record<string, string> = {
  'class-ma-checker': 'https://formspree.io/p/3042010600814149049/f/class-ma-checker',
  // The example feasibility. Its autoresponse carries the link to the document,
  // so the request is answered in seconds rather than by someone remembering to
  // attach a file. See lib/sampleReport.ts and formspree.json.
  'sample-report': 'https://formspree.io/p/3042010600814149049/f/sample-report',
};

// Where each gate's `source` came from, for a subject line the team can triage
// from the notification list without opening anything.
// Keys must match the `source` each gate passes. Checked against the call sites
// in sections/tools/*.tsx and SampleReportGate; an unknown source still sends,
// it just arrives labelled with the raw slug.
const SOURCE_LABELS: Record<string, string> = {
  'hmo-calculator': 'HMO profit calculator',
  'gdv-calculator': 'GDV calculator',
  'class-ma-checker': 'Class MA eligibility checker',
  'sample-report': 'Sample feasibility report',
  // The pricing calculator captures contact details before it reveals the fee,
  // so an abandoned payment still leaves a lead. The Outcome row says whether
  // they saw a price or were routed to an Expert Session.
  'pricing-calculator': 'Pricing calculator (fee revealed)',
  // Posted just before the £49.99 flat-fee Stripe redirect, so a checkout that
  // is abandoned or fails to load still leaves a lead.
  'automated-checkout': 'Automated Site Feasibility (£49.99 checkout started)',
  // Contact page: "not sure what I need" route. Stands in for a direct Jodi
  // Calendly booking until that link exists (Ed's August 2026 final brief).
  'expert-session': 'Free Expert Session request, for Jodi',
  // The contact page rides this route too, so a general enquiry lands in the
  // same inbox without needing a third form on the Formspree project.
  'contact-form': 'Contact form',
  // Asked for from a feasibility study page. The real reports are not published,
  // so this one always needs a person to send a redacted example back.
  'feasibility-documents': 'Feasibility documents requested, send redacted example',
};

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  const s = (v: unknown) => String(v ?? '').slice(0, 1000);
  const email = s(data.email);
  const source = s(data.source);
  if (!email) {
    return NextResponse.json({ ok: false, error: 'missing email' }, { status: 400 });
  }

  const label = SOURCE_LABELS[source] ?? source ?? 'Website tool';

  // Whatever the individual tool passed as `extra` (inputs, results) rides along
  // as its own rows, so the team can see what the person was actually modelling.
  const { email: _e, source: _s, ...extra } = data;
  const extraRows = Object.fromEntries(
    Object.entries(extra).map(([k, v]) => [k, s(typeof v === 'object' ? JSON.stringify(v) : v)]),
  );

  const payload = {
    _subject: `New tool lead: ${label}`,
    _replyto: email,
    // Formspree's autoresponse looks for a field named exactly `email`, in
    // lower case, to decide where to send the confirmation. Only `Email` was
    // sent, so an autoresponse would have had nowhere to go. `Email` stays
    // because it is what shows in the team's notification.
    email,
    Email: email,
    Tool: label,
    Source: source,
    ...extraRows,
  };

  const post = (url: string) =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

  try {
    const preferred = FORM_BY_SOURCE[source];
    let res = await post(preferred ?? LEAD_ENDPOINT);

    // A per-source form only exists once formspree.json has been deployed with
    // the Formspree CLI, which is a separate release from this site. Until that
    // happens the dedicated form 404s, and without this the person would be
    // told their submission failed while we simply had not set the form up.
    // Fall back to the shared form so the lead is never lost; the only thing
    // missing in that case is the autoresponse.
    if (preferred && !res.ok) {
      console.error('[leads] per-source form failed, falling back', source, res.status);
      res = await post(LEAD_ENDPOINT);
    }

    if (!res.ok) {
      console.error('[leads] formspree failed', res.status, await res.text().catch(() => ''));
    }
  } catch (err) {
    console.error('[leads] formspree unreachable', err);
  }

  // Optional CRM forward, kept from the original route. Non-blocking on purpose:
  // the person is waiting on a calculator result, so a CRM outage must not stop
  // them, and Formspree above has already retained the lead either way.
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('[leads] crm webhook unreachable (non-blocking)', err);
    }
  }

  // Always ok: the gate should open even if delivery had a wobble, because the
  // submission is retained in the Formspree inbox regardless.
  return NextResponse.json({ ok: true });
}
