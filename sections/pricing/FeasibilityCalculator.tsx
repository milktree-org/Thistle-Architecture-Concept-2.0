"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, ArrowLeft, RotateCcw, Check, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '../../components/animations/Reveal';
import { Button } from '../../components/ui/Button';
import { EVENTS, track, trackOnce } from '../../lib/analytics';
import { DisclaimerAcceptance } from '../../components/checkout/DisclaimerAcceptance';
import { PrivacyNote } from '../../components/ui/PrivacyNote';
import { DISCLAIMER_ERROR, DISCLAIMER_VERSION } from '../../lib/disclaimer';
import {
  getFeasibilityRoute,
  type ProjectInput,
  type HeritageGrade,
  type ProjectType,
} from '../../data/pricingData';
import { CALCULATOR_CARRY_KEY } from '../../components/feasibility/feasibility';

// The questionnaire from section 4 of Ed's pricing brief.
//
// The order matters and is his: address first, then the things that can stop
// pricing entirely, then the things that only adjust it. A hard stop is never
// shown as a price and then withdrawn, because the whole point of the routing
// is that Thistle never quotes a number for a scope it has not seen.

interface Answers {
  // Contact first, per the final brief: "capture name, email and phone so a
  // lead exists even if payment is abandoned".
  name: string;
  email: string;
  phone: string;
  gia: string;
  giaUnknown: boolean;
  existingUse: string;
  proposedUse: string;
  buildings: string;
  newBuild: string;
  options: string;
  heritage: HeritageGrade;
  extension: boolean;
  specialConstraint: boolean;
  masterplan: boolean;
  info: string;
}

const EMPTY: Answers = {
  name: '',
  email: '',
  phone: '',
  gia: '',
  giaUnknown: false,
  existingUse: '',
  proposedUse: '',
  buildings: '',
  newBuild: '',
  options: '',
  heritage: 'none',
  extension: false,
  specialConstraint: false,
  masterplan: false,
  info: '',
};

const EXISTING_USES = [
  { value: 'residential', label: 'Residential' },
  { value: 'hmo', label: 'HMO' },
  { value: 'office', label: 'Office' },
  { value: 'retail', label: 'Retail' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'care', label: 'Care' },
  { value: 'mixed_use', label: 'Mixed use' },
  { value: 'other', label: 'Other' },
  { value: 'land', label: 'Land' },
];

const PROPOSED_USES = [
  { value: 'hmo', label: 'HMO' },
  { value: 'apartments', label: 'Apartments' },
  { value: 'residential_conversion', label: 'Residential conversion' },
  { value: 'mixed_use', label: 'Mixed use' },
  { value: 'extension', label: 'Extension' },
  { value: 'commercial_conversion', label: 'Commercial conversion' },
  { value: 'new_build', label: 'New build' },
  { value: 'not_sure', label: 'Not sure' },
];

/** Maps the questionnaire to the engine's input, per the brief's routing notes. */
function toProject(a: Answers): ProjectInput {
  const proposedIsStop = ['new_build', 'not_sure'].includes(a.proposedUse);
  let projectType: ProjectType = 'conversion';
  if (a.existingUse === 'land') projectType = 'vacant_land';
  else if (a.proposedUse === 'new_build' || a.newBuild === 'significant') projectType = 'new_build_development';
  else if (a.proposedUse === 'mixed_use') projectType = 'mixed_use';
  else if (a.proposedUse === 'extension') projectType = 'extension';

  return {
    gia: a.giaUnknown || !a.gia ? null : Number(a.gia),
    projectType,
    numberOfBuildings: a.buildings === '3plus' ? 3 : a.buildings === '2' ? 2 : 1,
    isMasterplan: a.masterplan,
    heritageGrade: a.heritage,
    // "1 preferred" is 1, "+1 alternative" is 2, "several" is 3+.
    numberOfDevelopmentStrategies: a.options === 'several' ? 3 : a.options === 'alternative' ? 2 : 1,
    sufficientExistingInformation: a.info === 'yes',
    proposedUseKnown: !!a.proposedUse && !proposedIsStop,
    mixedUse: a.proposedUse === 'mixed_use' || a.existingUse === 'mixed_use',
    significantExtension: a.extension,
    additionalDesignOption: a.options === 'alternative',
    specialPlanningConstraint: a.specialConstraint,
  };
}

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <div className="mb-fl-5">
    <p className="text-fluid-sm font-medium text-thistle-black mb-fl-1">{label}</p>
    {hint && <p className="text-xs text-thistle-black/45 mb-fl-3">{hint}</p>}
    {children}
  </div>
);

const Choice: React.FC<{
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}> = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-fl-2">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(o.value)}
        aria-pressed={value === o.value}
        // These pills are how the whole fee calculator is driven, so they get
        // the full 44px touch height rather than the 34px they had.
        className={`inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-full text-xs font-medium border transition-colors ${
          value === o.value
            ? 'bg-thistle-black text-white border-thistle-black'
            : 'bg-white text-thistle-black/60 border-thistle-black/[0.08] hover:border-thistle-black/25'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({
  label,
  checked,
  onChange,
}) => (
  <label className="flex items-start gap-fl-3 cursor-pointer py-fl-2">
    <span
      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
        checked ? 'bg-thistle-green border-thistle-green' : 'bg-white border-thistle-black/15'
      }`}
    >
      {checked && <Check size={13} className="text-white" strokeWidth={3} />}
    </span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only"
    />
    <span className="text-fluid-sm text-thistle-black/70 leading-snug">{label}</span>
  </label>
);

export const FeasibilityCalculator: React.FC = () => {
  const [a, setA] = useState<Answers>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // The result card is much shorter than the form it replaces, so submitting
  // used to collapse the page under the reader and leave them looking at a
  // section further down, wondering what had happened to their answer.
  useEffect(() => {
    if (submitted) box.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [submitted]);
  const [checkout, setCheckout] = useState<'idle' | 'working' | 'error'>('idle');

  // Unticked on every mount, with nothing persisting it. R2.3 of the brief, and
  // the acceptance criteria check it survives a browser back.
  const [accepted, setAccepted] = useState(false);
  const [disclaimerError, setDisclaimerError] = useState(false);

  const handleCheckout = async () => {
    // The browser half of the block. The server refuses too, which is the half
    // that counts, but stopping here means the client sees section 5.3 rather
    // than a failed request.
    if (!accepted) {
      setDisclaimerError(true);
      return;
    }
    setDisclaimerError(false);
    setCheckout('working');
    // Sent before the request, not after. The successful branch ends in a
    // window.location assignment to Stripe, and an event queued after that has
    // no reliable chance to leave the page.
    track(EVENTS.paymentStarted, {
      source: 'feasibility-calculator',
      tier: 'architectural',
      value: result?.route === 'instant_payment' ? result.price : undefined,
      currency: 'GBP',
    });
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: toProject(a),
          email: a.email,
          name: a.name,
          // The phone number and the two use answers were collected here and
          // then dropped on the floor: the paid notification arrived with
          // Phone blank and nothing saying what the scheme was (8 September
          // 2026, first live deposit). They ride into the Stripe metadata now.
          phone: a.phone,
          existingUse: a.existingUse,
          proposedUse: a.proposedUse,
          // Sent so the request records which wording was on screen, rather
          // than which wording happens to be deployed when it arrives.
          disclaimerAccepted: true,
          disclaimerVersion: DISCLAIMER_VERSION,
        }),
      });
      const data = await res.json();
      if (data.route === 'payment' && data.url) {
        window.location.href = data.url;
        return;
      }
      // The server refused the tick. Should be unreachable, since the button
      // is blocked above, but if the two ever disagree the client must see the
      // agreed wording rather than be sent to the contact page.
      if (res.status === 422) {
        setDisclaimerError(true);
        setCheckout('idle');
        return;
      }

      // Either payment is not switched on yet, or the server disagreed and
      // routed this to an Expert Session. Both go to the contact page rather
      // than leaving the person on a dead button; their lead is already
      // captured, so the team can pick it up either way.
      window.location.href = '/contact';
    } catch {
      setCheckout('error');
    }
  };
  // The questionnaire opens empty, so the first answer of any kind is the start
  // of the funnel. Guarded, or all twelve fields would report a start each.
  const started = useRef(false);
  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => {
    trackOnce(started, EVENTS.calculatorStarted, { source: 'feasibility-calculator' });
    setA((s) => ({ ...s, [k]: v }));
  };

  const contactReady = !!a.name.trim() && /.+@.+\..+/.test(a.email) && a.phone.trim().length >= 7;
  const ready =
    contactReady &&
    (a.giaUnknown || !!a.gia) && !!a.existingUse && !!a.proposedUse && !!a.buildings && !!a.options && !!a.info;

  const result = useMemo(() => (submitted ? getFeasibilityRoute(toProject(a)) : null), [submitted, a]);

  // Revealing the price is the moment the lead exists, per the final brief:
  // a person who sees their fee and walks away is still a lead. Fire and
  // forget; the price must never wait on the lead post. The same answers are
  // written to localStorage so the post-payment brief can carry them forward.
  const handleReveal = () => {
    const route = getFeasibilityRoute(toProject(a));
    try {
      localStorage.setItem(
        CALCULATOR_CARRY_KEY,
        JSON.stringify({ name: a.name, email: a.email, phone: a.phone, gia: a.giaUnknown ? '' : a.gia }),
      );
    } catch {
      // Storage can be full or blocked; carrying answers forward is a nicety.
    }
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: a.email,
        source: 'pricing-calculator',
        Name: a.name,
        Phone: a.phone,
        'Floor area': a.giaUnknown ? 'not known' : `${a.gia} m²`,
        'Existing use': a.existingUse,
        'Proposed use': a.proposedUse,
        Heritage: a.heritage,
        Outcome: route.route === 'instant_payment' ? `Priced £${route.price}` : `Expert Session: ${route.reason}`,
      }),
    }).catch(() => {});
    // Completion is the reveal, which is also the moment the lead exists. The
    // route rides along because "priced instantly" and "routed to an expert
    // session" are two different outcomes and averaging them hides which one
    // the calculator is actually producing.
    track(EVENTS.calculatorCompleted, {
      source: 'feasibility-calculator',
      outcome: route.route,
      value: route.route === 'instant_payment' ? route.price : undefined,
      currency: 'GBP',
    });
    setSubmitted(true);
  };

  // Deposits are half of fees that can end in £75 uplifts, so they can carry
  // 50p. Whole pounds render clean, anything else keeps its pence.
  const money = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

  if (result) {
    const instant = result.route === 'instant_payment';
    return (
      <Reveal>
        <div ref={box} className="scroll-mt-28">
        <div
          className={`rounded-2xl border p-fl-7 ${
            instant ? 'border-thistle-green/30 bg-thistle-green/[0.06]' : 'border-thistle-black/[0.08] bg-white'
          }`}
        >
          {instant ? (
            <>
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-thistle-green mb-fl-4">
                Your feasibility fee
              </p>
              <p className="text-fluid-display font-medium tracking-tight text-thistle-black leading-none mb-fl-4">
                £{result.price}
              </p>
              <p className="text-fluid-base text-thistle-black/80 leading-relaxed mb-fl-2 max-w-xl">
                A fixed fee including VAT, covering everything in the Architectural Feasibility. Delivered in five
                working days.
              </p>
              {/* The 50% holding deposit from the final brief's Architectural
                  Feasibility flow. The balance follows once the study is
                  underway; the deposit is what secures the slot. */}
              <p className="text-fluid-sm text-thistle-black/70 leading-relaxed mb-fl-6 max-w-xl">
                Secure it today with a 50% holding deposit of{' '}
                <span className="font-semibold text-thistle-black">£{money(result.price / 2)}</span>. You then
                complete your project brief, and the balance is due before your feasibility is delivered.
              </p>
              {/* R2.1: on the same screen as the pay button and ABOVE it. */}
              <DisclaimerAcceptance
                checked={accepted}
                onChange={(v) => { setAccepted(v); if (v) setDisclaimerError(false); }}
                showError={disclaimerError}
                id="disclaimer-architectural"
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-fl-4 mt-fl-5">
                {/* Posts the answers, not the price. The server recalculates
                    and charges its own number, because the one on screen is a
                    value the customer controls. Until Stripe keys are set the
                    route answers "payment_unavailable" and this falls back to
                    the enquiry form rather than dropping someone who has
                    already reached a price. */}
                <Button
                  variant="primary"
                  icon={<ArrowUpRight size={16} />}
                  onClick={handleCheckout}
                  disabled={checkout === 'working'}
                >
                  {checkout === 'working' ? 'One moment…' : 'Secure My Feasibility'}
                </Button>
                <button
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center gap-2 text-sm text-thistle-black/60 hover:text-thistle-black transition-colors font-medium"
                >
                  <ArrowLeft size={14} /> Change my answers
                </button>
              </div>
              {checkout === 'error' && (
                <p className="text-xs text-red-700 mt-fl-3" role="alert">
                  Something went wrong. Please try again, or book an Expert Session and we will pick it up.
                </p>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-fl-3 mb-fl-4 text-thistle-black/60">
                <MessageSquare size={22} />
                <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">Worth a conversation</span>
              </div>
              <h3 className="text-fluid-h3 font-medium tracking-tight leading-tight text-thistle-black mb-fl-4">
                This project needs a closer look.
              </h3>
              <p className="text-fluid-base text-thistle-black/80 leading-relaxed mb-fl-2 max-w-xl">
                {result.reason} Based on what you have told us, a short conversation before we define the
                feasibility scope will give you a better answer than an automatic price would.
              </p>
              <p className="text-xs text-thistle-black/50 mb-fl-6">
                Your answers are kept, so you will not be asked for them again.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-fl-4">
                {/* Button is a <button>, not a link, so navigation goes through
                    Link rather than an unsupported href prop. */}
                <Link href="/contact">
                  <Button variant="primary" icon={<ArrowUpRight size={16} />}>
                    Book a free Expert Session
                  </Button>
                </Link>
                <button
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center gap-2 text-sm text-thistle-black/60 hover:text-thistle-black transition-colors font-medium"
                >
                  <ArrowLeft size={14} /> Change my answers
                </button>
              </div>
            </>
          )}
          <button
            onClick={() => { setA(EMPTY); setSubmitted(false); }}
            className="mt-fl-6 inline-flex items-center gap-2 text-xs text-thistle-black/40 hover:text-thistle-black transition-colors"
          >
            <RotateCcw size={12} /> Start over
          </button>
        </div>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal>
      <div className="rounded-2xl border border-thistle-black/[0.08] bg-white p-fl-7">
        <Field label="Roughly how big is the existing building?" hint="Gross internal area across all floors, in m².">
          <div className="flex flex-wrap items-center gap-fl-3">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={a.gia}
              disabled={a.giaUnknown}
              onChange={(e) => set('gia', e.target.value)}
              placeholder="e.g. 240"
              className="w-40 border border-thistle-black/10 rounded-full px-4 py-2.5 text-sm bg-thistle-white/50 focus:border-thistle-green focus:ring-1 focus:ring-thistle-green/20 outline-none transition-colors disabled:opacity-40 placeholder:text-thistle-black/25"
            />
            <Toggle label="I do not know" checked={a.giaUnknown} onChange={(v) => set('giaUnknown', v)} />
          </div>
        </Field>

        <Field label="What is it now?">
          <Choice options={EXISTING_USES} value={a.existingUse} onChange={(v) => set('existingUse', v)} />
        </Field>

        <Field label="What do you want it to become?">
          <Choice options={PROPOSED_USES} value={a.proposedUse} onChange={(v) => set('proposedUse', v)} />
        </Field>

        <Field label="How many separate buildings?">
          <Choice
            options={[
              { value: '1', label: 'One' },
              { value: '2', label: 'Two' },
              { value: '3plus', label: 'Three or more' },
            ]}
            value={a.buildings}
            onChange={(v) => set('buildings', v)}
          />
        </Field>

        <Field label="How many design options would you like tested?">
          <Choice
            options={[
              { value: 'one', label: 'One preferred option' },
              { value: 'alternative', label: 'Plus one alternative' },
              { value: 'several', label: 'Several' },
            ]}
            value={a.options}
            onChange={(v) => set('options', v)}
          />
        </Field>

        <Field label="Heritage status">
          <Choice
            options={[
              { value: 'none', label: 'None' },
              { value: 'conservation_area', label: 'Conservation Area' },
              { value: 'Grade II', label: 'Grade II listed' },
              { value: 'Grade II*', label: 'Grade II* listed' },
              { value: 'Grade I', label: 'Grade I listed' },
            ]}
            value={a.heritage}
            onChange={(v) => set('heritage', v as HeritageGrade)}
          />
        </Field>

        <Field
          label="Do you have enough on the existing building?"
          hint="Plans, surveys, brochures, photos or planning history that show what is there now."
        >
          <Choice
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'Not really' },
            ]}
            value={a.info}
            onChange={(v) => set('info', v)}
          />
        </Field>

        <Field
          label="Anything else that applies?"
          hint="Leave these unticked if none apply. Each one changes the fee, and a masterplan or whole-site redevelopment is always scoped in a conversation rather than priced automatically."
        >
          <div className="space-y-fl-1">
            <Toggle
              label="The scheme includes a significant extension"
              checked={a.extension}
              onChange={(v) => set('extension', v)}
            />
            <Toggle
              label="There is a significant planning constraint, such as flood risk or an Article 4 direction"
              checked={a.specialConstraint}
              onChange={(v) => set('specialConstraint', v)}
            />
            <Toggle
              label="This is a masterplan or a whole-site redevelopment"
              checked={a.masterplan}
              onChange={(v) => set('masterplan', v)}
            />
          </div>
        </Field>

        <div className="pt-fl-5 border-t border-thistle-black/[0.06]">
          <Field
            label="Where do we send your fixed fee?"
            hint="Your fee appears on screen instantly; these let us hold it for you and pick the conversation up if you want to talk it through."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-fl-3">
              <input
                type="text"
                autoComplete="name"
                value={a.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Full name"
                className="border border-thistle-black/10 rounded-full px-4 py-2.5 text-sm bg-thistle-white/50 focus:border-thistle-green focus:ring-1 focus:ring-thistle-green/20 outline-none transition-colors placeholder:text-thistle-black/25"
              />
              <input
                type="email"
                autoComplete="email"
                value={a.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="Email"
                className="border border-thistle-black/10 rounded-full px-4 py-2.5 text-sm bg-thistle-white/50 focus:border-thistle-green focus:ring-1 focus:ring-thistle-green/20 outline-none transition-colors placeholder:text-thistle-black/25"
              />
              <input
                type="tel"
                autoComplete="tel"
                value={a.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="Phone"
                className="border border-thistle-black/10 rounded-full px-4 py-2.5 text-sm bg-thistle-white/50 focus:border-thistle-green focus:ring-1 focus:ring-thistle-green/20 outline-none transition-colors placeholder:text-thistle-black/25"
              />
            </div>
            {/* Item 77: what the details are for, beside the fields, not only
                on the privacy page. */}
            <PrivacyNote
              className="mt-fl-3"
              purpose="We use these details to send you the fee and to follow up about your project."
            />
          </Field>

          <div className="flex flex-col sm:flex-row sm:items-center gap-fl-4">
            <Button
              variant="primary"
              icon={<ArrowUpRight size={16} />}
              onClick={handleReveal}
              disabled={!ready}
            >
              Get My Instant Fixed Fee
            </Button>
            <p className="text-xs text-thistle-black/45 max-w-sm">
              No payment yet. All fees include VAT. Larger or more involved projects route to a free Expert
              Session rather than an automatic price.
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
};
