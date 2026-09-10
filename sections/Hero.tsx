"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../components/animations/Reveal';
import { TrustpilotBadge } from '../components/ui/TrustpilotBadge';
import { pruneEmpty, normalizeImage } from '../lib/tina';
import { vimeoEmbed } from '../lib/vimeo';

/** A metric card, plus the CMS field ids for its own three fields. */
export interface HeroMetric {
  value: string;
  label: string;
  detail: string;
  tina?: { value?: string; label?: string; detail?: string };
}

interface HeroCopy {
  badge: string;
  heading: string;
  lede: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  reassurance: string;
  /** Not rendered as text. Describes the poster still for screen readers. */
  posterAlt: string;
  posterImage: string;
  videoId: string;
}

interface HeroProps {
  /** CMS copy. Falls back per field to the standing copy below. */
  copy?: Partial<HeroCopy>;
  /** CMS metrics. Falls back whole to METRICS_FALLBACK when empty or absent. */
  metrics?: HeroMetric[];
  tina?: Partial<Record<keyof HeroCopy, string>>;
}

const HERO_FALLBACK: HeroCopy = {
  badge: 'Feasibility-first architecture',
  // Ed's August 2026 final brief: the headline is "Feasibility-First
  // Architecture", with "Nationwide" in the supporting copy rather than forced
  // into the headline.
  heading: 'Feasibility-First\nArchitecture.',
  lede: 'Thistle is a nationwide, developer-led architecture practice specialising in feasibility studies and the retrofit and reuse of existing buildings. We test what a building can become, give you a clear Go or No-Go in five days, then design and deliver the conversion.',
  primaryCtaLabel: 'Get Your Fixed Fee',
  secondaryCtaLabel: 'See How Feasibility Works',
  reassurance: 'No obligation. Response within one working day.',
  posterAlt: 'Thistle conversion and retrofit projects across the UK',
  posterImage: '/images/site/hero-showreel-v5-poster.jpg',
  videoId: '1217009975',
};

// The two entry prices. Not CMS fields, for the reason given at the point of
// use below; they match AUTOMATED_PRICE and ARCHITECTURAL_PRICE in
// sections/feasibility-package/PackageEntry.tsx and the ladder in
// data/pricingData.ts, and scripts/pricing-check.mjs asserts the ladder.
const HOME_PRICE_LINE = 'Feasibility from £49.99. Design-led feasibility from £298.';

const METRICS_FALLBACK: HeroMetric[] = [
  { value: "500+", label: "Projects delivered", detail: "Across the Thistle Group" },
  { value: "5 days", label: "Turnaround, committed", detail: "Submission to recommendation" },
  { value: "86%", label: "Faster than traditional routes", detail: "5 days vs 2 to 6 weeks" },
];


export const Hero: React.FC<HeroProps> = ({ copy, metrics, tina }) => {
  const router = useRouter();
  const c: HeroCopy = { ...HERO_FALLBACK, ...pruneEmpty(copy) };

  // videoId is deliberately outside the pruneEmpty merge. Everywhere else an
  // empty field means "the editor cleared it, keep the standing copy" — a blank
  // heading is a mistake, not an instruction. Here it is an instruction: "no
  // film, just the still", which is a real choice and has no other way of being
  // expressed. So absent falls back, and empty means empty.
  const videoId = copy?.videoId === undefined ? HERO_FALLBACK.videoId : copy.videoId;
  const embed = vimeoEmbed(videoId);
  // Whole-list fallback rather than per-item: an empty list in the CMS means
  // the section has not been filled in, not that the editor wants three blank
  // cards in the hero.
  const m: HeroMetric[] = metrics && metrics.length ? metrics : METRICS_FALLBACK;

  return (
    <section className="relative min-h-[100svh] flex flex-col overflow-hidden">
      {/* Media: the poster paints immediately and stays as the backdrop, with
          the v5 background film from Vimeo layered over it on larger screens
          when motion is allowed. Vimeo hosts and encodes it, so there is no
          video file in the repo and no encoding to redo when the cut changes:
          swap the id below.
          background=1 is Vimeo's background mode, which autoplays muted on loop
          with no controls or chrome. dnt=1 turns off their tracking, so the
          embed sets no cookies and stays clear of the cookie policy.
          The iframe is fixed to 16:9, so it is sized to the larger of the two
          axes and centred, which is how you get object-cover behaviour out of
          an element that has no object-fit. That cover maths holds on portrait
          phones too, where the height is the binding axis.
          It plays at every width. It used to be gated behind sm:, which meant
          phones saw only the poster while the iframe still loaded and streamed
          the film behind display:none, so the data was spent either way.
          Vimeo's background mode is muted and inline, which is what iOS
          requires to autoplay; if a device still refuses, the poster below is
          already painted and stays put.
          Which film plays and which still sits behind it are both editable.
          The embed's PARAMETERS are not — see lib/vimeo.ts for why. The
          poster's marker sits on the image itself; the readability overlays
          below are pointer-transparent so they do not swallow the click. The
          film carries no marker: the iframe is aria-hidden and click-through,
          so a click there lands on the poster, and the film is chosen in the
          sidebar instead. */}
      <Image
        src={normalizeImage(c.posterImage, HERO_FALLBACK.posterImage)}
        alt={c.posterAlt}
        fill
        priority
        className="object-cover"
        data-tina-field={tina?.posterImage}
      />
      {/* No film when the field is empty or unparseable: the poster above is
          already painted and carries the hero on its own, which is exactly what
          phones and reduced-motion visitors see. Better a still hero than a
          broken embed. */}
      {embed && <div
        className="absolute inset-0 overflow-hidden hidden motion-safe:block pointer-events-none"
        aria-hidden="true"
      >
        <iframe
          src={embed}
          title=""
          tabIndex={-1}
          allow="autoplay; fullscreen"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full border-0"
        />
      </div>}

      {/* Readability overlays: heavier on the left where the copy sits, plus a bottom wash for the stat band */}
      <div className="absolute inset-0 bg-gradient-to-r from-thistle-black/85 via-thistle-black/55 to-thistle-black/25 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-thistle-black/75 to-transparent" />

      {/* Copy block */}
      <div className="relative z-10 flex-1 flex items-center w-full">
        <div className="max-w-[1360px] mx-auto w-full px-fl-margin pt-36 sm:pt-32 pb-fl-7">
          <div className="max-w-4xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-fl-4 py-2 rounded-full bg-white/10 border border-white/25 backdrop-blur-sm mb-fl-6">
                <span className="inline-flex rounded-full h-2 w-2 bg-thistle-green" />
                {/* The marker goes on the text span, not the pill: the pill also
                    contains the green dot, and a marker on it would swallow a
                    click anywhere inside. */}
                <span className="text-sm font-medium text-white tracking-tight" data-tina-field={tina?.badge}>
                  {c.badge}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              {/* whitespace-pre-line so the two-line treatment survives editing:
                  a newline typed in the CMS breaks the line, where the markup
                  used to hardcode a <br />. */}
              <h1
                className="text-[clamp(2.6rem,5.2vw,4.6rem)] font-medium tracking-tighter leading-[1.05] text-white mb-fl-5 whitespace-pre-line"
                data-tina-field={tina?.heading}
              >
                {c.heading}
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p
                className="text-fluid-base text-white/90 leading-relaxed font-light mb-fl-7 max-w-xl"
                data-tina-field={tina?.lede}
              >
                {c.lede}
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-fl-4">
                <Button
                  size="lg"
                  variant="primary"
                  icon={<ArrowUpRight size={18} />}
                  onClick={() => router.push('/pricing#calculator')}
                  className="!bg-thistle-green !text-thistle-black !border-thistle-green hover:!bg-thistle-green/85 hover:!border-thistle-green/85"
                  data-tina-field={tina?.primaryCtaLabel}
                >
                  {c.primaryCtaLabel}
                </Button>
                <a
                  href="/feasibility-package"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/40 text-white text-sm font-medium hover:bg-white/10 hover:border-white/60 transition-colors"
                  data-tina-field={tina?.secondaryCtaLabel}
                >
                  {c.secondaryCtaLabel}
                </a>
              </div>
              <p className="text-sm text-white/90 mt-fl-4" data-tina-field={tina?.reassurance}>
                {c.reassurance}
              </p>
              {/* Item 70 of Ed's September 2026 list: the homepage carried no
                  price and no route to /pricing except the nav. The two entry
                  prices stay in code, like every other price on the site, so
                  an edit here cannot publish a figure Stripe does not charge.
                  The line is one sentence and one link, on purpose. */}
              <p className="text-sm text-white/90 mt-fl-2">
                {HOME_PRICE_LINE}{' '}
                <Link href="/pricing" className="underline underline-offset-2 decoration-white/50 hover:decoration-white transition-colors">
                  See all prices
                </Link>
                .
              </p>
              <TrustpilotBadge tone="light" className="mt-fl-5" />
            </Reveal>
          </div>
        </div>
      </div>

      {/* Impact numbers, part of the hero */}
      <div className="relative z-10 w-full px-fl-margin pb-fl-6">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-fl-3">
          {m.map((metric, i) => (
            <Reveal key={i} delay={0.35 + i * 0.08}>
              {/* Each of the three values is marked on the element that renders
                  it, not on the card, so clicking the number opens the number
                  and clicking the qualifier opens the qualifier. */}
              <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 px-fl-5 py-fl-4">
                <span
                  className="block text-fluid-h4 font-semibold tracking-tight text-white leading-none mb-1.5"
                  data-tina-field={metric.tina?.value}
                >
                  {metric.value}
                </span>
                <span className="block text-sm font-medium text-white/95 leading-tight" data-tina-field={metric.tina?.label}>
                  {metric.label}
                </span>
                <span className="block text-xs text-white/70 mt-0.5" data-tina-field={metric.tina?.detail}>
                  {metric.detail}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
