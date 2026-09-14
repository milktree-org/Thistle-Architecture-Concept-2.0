"use client";

import React, { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { Reveal } from '../../components/animations/Reveal';
import { Button } from '../../components/ui/Button';
import Link from 'next/link';
import { pruneEmpty } from '../../lib/tina';
import { EVENTS, track } from '../../lib/analytics';
import { DisclaimerAcceptance } from '../../components/checkout/DisclaimerAcceptance';
import { PrivacyNote } from '../../components/ui/PrivacyNote';
import { DISCLAIMER_VERSION } from '../../lib/disclaimer';

// Ed's August 2026 final brief, section 03: "Bring the product choice and
// short pricing calculator near the top. Use the same calculator component and
// pricing logic as the Pricing page." and "Replace 'from £298' as the headline
// starting price with: 'Feasibility from £49.99' and immediately below
// 'Design-led feasibility from £298'."
//
// £49.99 is a flat fee with no questionnaire behind it (there is nothing to
// price), so it gets its own small checkout form here. £298+ varies by scope
// and is priced by the calculator, which since item 71 of Ed's September 2026
// list lives in one place only, /pricing#calculator. The same seven questions
// on two pages was two calculators to keep in step and two answers to "where
// does Get Your Fixed Fee go", so the card here links across instead.

// THE TWO CARD PRICES STAY IN CODE. They are the price OF a product, and an
// editable one could publish a fee the site does not honour — the card saying
// £250 while Stripe takes £298 — with nothing to catch it. Both sit here, next
// to the checkout call that actually charges. The headings above them quote the
// same figures and ARE editable, because they are sentences; their field
// descriptions warn that the number has to move in code at the same time. Same
// line tina/collections/pricing.ts draws, for the same reason.
const AUTOMATED_PRICE = '£49.99';
const ARCHITECTURAL_PRICE = 'From £298';

// Now a fallback rather than this section's only copy: the same strings live in
// content/feasibility/package.json, seeded byte-for-byte from here.
const FALLBACK = {
  eyebrow: 'Choose Your Route',
  heading: 'Feasibility From £49.99.',
  priceSub: 'Design-led feasibility from £298.',
  lede: 'Both start from the same data. Pick the automated appraisal to screen a site fast, or go straight to the design-led feasibility if you already know you want the full picture.',
  automatedName: 'Automated Site Feasibility',
  automatedStrapline: 'Data-led. No design review. About 30 minutes.',
  architecturalBadge: 'Recommended',
  architecturalName: 'Architectural Feasibility',
  architecturalStrapline: 'Data, plus our design team: planning interpretation, sketch and layout testing, and a professional recommendation.',
  architecturalBody: 'Everything in the automated appraisal, plus the sketch scheme and full report described below. Answer seven questions on the pricing page and your fixed fee is on screen.',
  architecturalCtaLabel: 'Get Your Instant Fixed Fee',
  partnerPrefix: 'Only need a quick HMO screen?',
  partnerLinkLabel: 'HMO Checker Property Report, £15.99',
  partnerSuffix: 'Opens hmochecker.co.uk in a new tab. A separate tool from a sister brand, not a Thistle feasibility.',
};

const AUTOMATED_INCLUDES = [
  'Planning and standards check',
  'Indicative development capacity',
  'Commercial context and risks',
  'Recommended next steps',
];

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// The checkout form is deliberately outside the CMS: its placeholders, its
// button states and its error line are the mechanic, not copy, and a reworded
// button state is a broken button.
const AutomatedCheckout: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'working' | 'error'>('idle');
  // Unticked on every mount, nothing persists it. R2.3.
  const [accepted, setAccepted] = useState(false);
  const [disclaimerError, setDisclaimerError] = useState(false);

  // The tick is deliberately NOT folded into `ready`. Leaving the button live
  // and refusing on click means the client is told what is missing, where a
  // silently disabled button leaves them guessing which field is wrong.
  const ready = !!name.trim() && emailOk(email) && phone.trim().length >= 7;

  const submit = async () => {
    if (!ready) return;
    if (!accepted) {
      setDisclaimerError(true);
      return;
    }
    setDisclaimerError(false);
    setStatus('working');

    // Before the request, because the success branch leaves the page for
    // Stripe and anything queued after that may never be sent. The fee is flat
    // for this tier, so the value is a constant rather than a calculation.
    track(EVENTS.paymentStarted, {
      source: 'automated-checkout',
      tier: 'automated',
      value: 49.99,
      currency: 'GBP',
    });

    // Fire and forget: a lead that never reaches Stripe (no key set, or the
    // request fails) must not be lost, same principle as the pricing
    // calculator revealing a fee before payment.
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'automated-checkout', Name: name, Phone: phone }),
    }).catch(() => {});

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: 'automated',
          email,
          name,
          phone,
          disclaimerAccepted: true,
          disclaimerVersion: DISCLAIMER_VERSION,
        }),
      });
      const data = await res.json();
      if (data.route === 'payment' && data.url) {
        window.location.href = data.url;
        return;
      }
      // The server refused the tick. Unreachable via the button, but if the
      // two halves ever disagree the client sees the agreed wording.
      if (res.status === 422) {
        setDisclaimerError(true);
        setStatus('idle');
        return;
      }

      // Card payment not switched on yet. The lead is already captured above,
      // so send them somewhere a human will pick it up rather than a dead end.
      window.location.href = '/contact';
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="mt-auto pt-fl-5 border-t border-thistle-black/[0.06]">
      <div className="grid grid-cols-1 gap-fl-2 mb-fl-3">
        <input
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="border border-thistle-black/10 rounded-full px-4 py-2.5 text-sm bg-thistle-white/50 focus:border-thistle-green focus:ring-1 focus:ring-thistle-green/20 outline-none transition-colors placeholder:text-thistle-black/25"
        />
        <div className="grid grid-cols-2 gap-fl-2">
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-thistle-black/10 rounded-full px-4 py-2.5 text-sm bg-thistle-white/50 focus:border-thistle-green focus:ring-1 focus:ring-thistle-green/20 outline-none transition-colors placeholder:text-thistle-black/25"
          />
          <input
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="border border-thistle-black/10 rounded-full px-4 py-2.5 text-sm bg-thistle-white/50 focus:border-thistle-green focus:ring-1 focus:ring-thistle-green/20 outline-none transition-colors placeholder:text-thistle-black/25"
          />
        </div>
      </div>
      {/* Item 77: what the details are for, beside the fields. */}
      <PrivacyNote
        className="mb-fl-3"
        purpose="We use these details to deliver your report and to follow up about your project."
      />
      {/* R2.1: same screen as the pay button, and above it. */}
      <DisclaimerAcceptance
        checked={accepted}
        onChange={(v) => { setAccepted(v); if (v) setDisclaimerError(false); }}
        showError={disclaimerError}
        id="disclaimer-automated"
      />

      <Button
        variant="outline"
        size="md"
        icon={<ArrowUpRight size={16} />}
        onClick={submit}
        disabled={!ready || status === 'working'}
        className="w-full justify-center mt-fl-4"
      >
        {status === 'working' ? 'One moment…' : `Pay ${AUTOMATED_PRICE} Now`}
      </Button>
      {status === 'error' && (
        <p className="text-xs text-red-700 mt-fl-2" role="alert">
          Something went wrong. Please try again, or email hello@thistlearchitecture.co.uk.
        </p>
      )}
    </div>
  );
};

interface PackageEntryProps {
  eyebrow?: string;
  heading?: string;
  priceSub?: string;
  lede?: string;
  automated?: {
    name?: string;
    strapline?: string;
    /** The ticked list. All-or-nothing: a deleted line has to stay deleted. */
    includes?: { label: string; tina?: string }[];
  };
  architectural?: {
    badge?: string;
    name?: string;
    strapline?: string;
    body?: string;
    ctaLabel?: string;
  };
  partnerPrefix?: string;
  partnerLinkLabel?: string;
  partnerSuffix?: string;
  /** CMS field ids for this section's own copy. */
  tina?: Partial<
    Record<
      | 'eyebrow'
      | 'heading'
      | 'priceSub'
      | 'lede'
      | 'automatedName'
      | 'automatedStrapline'
      | 'architecturalBadge'
      | 'architecturalName'
      | 'architecturalStrapline'
      | 'architecturalBody'
      | 'architecturalCtaLabel'
      | 'partnerPrefix'
      | 'partnerLinkLabel'
      | 'partnerSuffix',
      string
    >
  >;
}

export const PackageEntry: React.FC<PackageEntryProps> = ({
  eyebrow,
  heading,
  priceSub,
  lede,
  automated,
  architectural,
  partnerPrefix,
  partnerLinkLabel,
  partnerSuffix,
  tina,
}) => {
  // pruneEmpty: a field the editor has cleared arrives as '' and would blank the
  // card, so an empty field leaves the standing copy in place.
  const copy = {
    ...FALLBACK,
    ...pruneEmpty({
      eyebrow,
      heading,
      priceSub,
      lede,
      automatedName: automated?.name,
      automatedStrapline: automated?.strapline,
      architecturalBadge: architectural?.badge,
      architecturalName: architectural?.name,
      architecturalStrapline: architectural?.strapline,
      architecturalBody: architectural?.body,
      architecturalCtaLabel: architectural?.ctaLabel,
      partnerPrefix,
      partnerLinkLabel,
      partnerSuffix,
    }),
  };

  // Annotated rather than inferred: the fallback branch has no `tina` key, so
  // without this the union narrows to { label: string } and the field id is
  // dropped from the type at the render site.
  const includes: { label: string; tina?: string }[] = automated?.includes?.length
    ? automated.includes
    : AUTOMATED_INCLUDES.map((label) => ({ label }));

  return (
    <section id="instant-quote" className="bg-thistle-white py-fl-section px-fl-margin scroll-mt-24">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-fl-8 max-w-2xl mx-auto">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4" data-tina-field={tina?.eyebrow}>{copy.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black" data-tina-field={tina?.heading}>
              {copy.heading}
            </h2>
            <p className="text-fluid-h5 font-medium tracking-tight text-thistle-black/50 mt-fl-1" data-tina-field={tina?.priceSub}>
              {copy.priceSub}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-fluid-base text-thistle-black/70 leading-relaxed mt-fl-4" data-tina-field={tina?.lede}>
              {copy.lede}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-fl-5 items-stretch mb-fl-8">
          {/* £49.99, flat fee */}
          <Reveal delay={0.1} fullHeight>
            <div className="h-full flex flex-col rounded-2xl border border-thistle-black/[0.08] bg-white p-fl-6">
              <h3 className="text-fluid-h6 font-medium tracking-tight text-thistle-black" data-tina-field={tina?.automatedName}>{copy.automatedName}</h3>
              {/* No marker: the price is not editable, so a marker here would
                  open a form that cannot change it. */}
              <p className="text-fluid-h3 font-medium tracking-tight text-thistle-black my-fl-3 leading-none">{AUTOMATED_PRICE}</p>
              <p className="text-fluid-sm font-medium text-thistle-black/80 mb-fl-4" data-tina-field={tina?.automatedStrapline}>{copy.automatedStrapline}</p>
              <ul className="space-y-fl-2 mb-fl-2">
                {/* Keyed by position, not by the line itself: the text is a live
                    form value in the editor, so keying on it remounts the row on
                    every keystroke. The marker goes on the span that renders the
                    line, not the <li> around it, so the tick is not part of the
                    click target. */}
                {includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check size={14} className="text-thistle-green mt-0.5 shrink-0" />
                    <span className="text-fluid-sm text-thistle-black/65" data-tina-field={item.tina}>{item.label}</span>
                  </li>
                ))}
              </ul>
              <AutomatedCheckout />
            </div>
          </Reveal>

          {/* From £298, recommended */}
          <Reveal delay={0.15} fullHeight>
            <div className="relative h-full flex flex-col rounded-2xl border border-thistle-green/40 bg-thistle-green/[0.06] shadow-lg shadow-thistle-green/[0.08] p-fl-6">
              <span className="absolute -top-3 left-fl-6 px-3 py-1 rounded-full bg-thistle-green text-thistle-black text-[10px] uppercase tracking-[0.16em] font-bold" data-tina-field={tina?.architecturalBadge}>
                {copy.architecturalBadge}
              </span>
              <h3 className="text-fluid-h6 font-medium tracking-tight text-thistle-black" data-tina-field={tina?.architecturalName}>{copy.architecturalName}</h3>
              {/* No marker, for the same reason as the price opposite. */}
              <p className="text-fluid-h3 font-medium tracking-tight text-thistle-black my-fl-3 leading-none">{ARCHITECTURAL_PRICE}</p>
              <p className="text-fluid-sm font-medium text-thistle-black/80 mb-fl-4" data-tina-field={tina?.architecturalStrapline}>
                {copy.architecturalStrapline}
              </p>
              <p className="text-fluid-sm text-thistle-black/65 leading-relaxed flex-1" data-tina-field={tina?.architecturalBody}>
                {copy.architecturalBody}
              </p>
              <div className="mt-fl-5">
                <Link href="/pricing#calculator" className="inline-block">
                  <Button variant="primary" size="md" icon={<ArrowUpRight size={16} />} data-tina-field={tina?.architecturalCtaLabel}>
                    {copy.architecturalCtaLabel}
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Ed's brief: do not use £15.99 as the main feasibility headline, and
            make clear it is a partner offer, so it sits here, faint.

            Three fields, three spans, because a link sits in the middle of the
            sentence. A single marker on the <p> would be a wrapper: closest()
            would find it from the link too, opening a form instead of following
            the link. The spans carry no styling and change nothing on screen. */}
        <Reveal delay={0.2}>
          <p className="text-center text-xs text-thistle-black/40 mt-fl-7">
            <span data-tina-field={tina?.partnerPrefix}>{copy.partnerPrefix}</span>{' '}
            <a
              href="https://hmochecker.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-thistle-black/60 transition-colors"
              data-tina-field={tina?.partnerLinkLabel}
            >
              {copy.partnerLinkLabel}
            </a>{' '}
            <span data-tina-field={tina?.partnerSuffix}>{copy.partnerSuffix}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
};
