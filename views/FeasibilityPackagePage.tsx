"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { useTina } from 'tinacms/dist/react';
import { Reveal } from '../components/animations/Reveal';
import { Button } from '../components/ui/Button';
import { Testimonials, type ReviewItem } from '../sections/Testimonials';
import { DeveloperLogos } from '../sections/DeveloperLogos';
import { FeasibilityEngine, type EngineLayer } from '../sections/FeasibilityEngine';
import { PackageFAQ, type PackageFaqItem } from '../sections/feasibility-package/PackageFAQ';
import { PackageEntry } from '../sections/feasibility-package/PackageEntry';
import { DeliverableShowcase, type DeliverableCopy } from '../sections/feasibility-package/DeliverableShowcase';
import { PackageTeam, type PackagePerson } from '../sections/feasibility-package/PackageTeam';
import { HowItWorks, type HowItWorksItem } from '../sections/feasibility-package/HowItWorks';
import { StickyCTA } from '../sections/feasibility-package/StickyCTA';
import { TrustpilotBadge } from '../components/ui/TrustpilotBadge';
import { f, type TinaQuery, EMPTY_QUERY } from '../lib/tina-fields';
import { str, num, arr, pruneEmpty, normalizeImage } from '../lib/tina';

/* eslint-disable @typescript-eslint/no-explicit-any */

// This is the site's one hard-sell page and its primary conversion path
// (PRODUCT.md), so almost every word on it is editable. What is not, and why,
// is set out in tina/collections/feasibilityPackage.ts.
//
// Everything below is now a fallback rather than the page's only copy: the same
// strings also live in content/feasibility/package.json, seeded byte-for-byte
// from what was here. They stay in code so the page renders unchanged if it is
// ever mounted without a CMS query, and so the provenance notes on each block
// stay next to the words they explain.

// The three icons, paired with the trust markers BY POSITION. They stay in code:
// an editor choosing an icon is a design decision, and a fourth marker with no
// icon is better than a wrong one.
const TRUST_MARKER_ICONS = [CheckCircle2, Clock, ShieldCheck];

const TRUST_MARKERS_FALLBACK = [
  "500+ projects delivered nationwide",
  "five-day turnaround, committed",
  "Fixed fee, scoped up front",
];

// Ed's August 2026 final brief: "Replace 'from £298' as the headline starting
// price with: 'Feasibility from £49.99' and immediately below 'Design-led
// feasibility from £298'."
//
// Both price lines are editable, because they are sentences — but the figures
// in them are wording only. What a customer is actually charged comes from the
// pricing engine, and the field descriptions say so.
const HERO_FALLBACK = {
  label: 'The Feasibility Package',
  // One field with a newline in it rather than two, because both lines are the
  // same colour: there is no span to hang a second field on, and one field
  // gives the h1 a single click-to-edit target. The newline is turned back into
  // the <br /> that was written by hand, so the markup is unchanged.
  heading: 'Your Building, Answered\nIn Five Days.',
  priceHeadline: 'Feasibility from £49.99.',
  priceSub: 'Design-led feasibility from £298.',
  lede: 'Five deliverables and a clear Go or No-Go on whether your building is worth taking forward.',
  ctaLabel: 'Get Your Instant Fixed Fee',
  ctaNote: 'No obligation. Response within one working day.',
  image: '/images/projects/bereweeke/complete-front.jpg',
  imageAlt: 'Bereweeke Avenue completed, a brick house with a tiled roof',
};

const REVIEWS_COPY_FALLBACK = {
  eyebrow: 'The Clients',
};

interface FeasibilityPackagePageProps {
  /**
   * Raw CMS queries, passed straight through from the server page so that
   * useTina can re-run them live inside the editor. Optional so the page still
   * renders if it is mounted without them.
   */
  settings?: TinaQuery;
  reviews?: TinaQuery;
  /** This page's own copy, from the `package.json` document. */
  page?: TinaQuery;
}

export const FeasibilityPackagePage: React.FC<FeasibilityPackagePageProps> = ({ settings, reviews, page }) => {
  // useTina returns the server data verbatim on the public site and swaps in
  // the live form values inside the editor. Passing a null-ish query is not
  // allowed, so the hooks run against a shared stub when the props are absent
  // and the results are discarded below.
  const { data: liveSettings } = useTina(settings ?? EMPTY_QUERY);
  const { data: liveReviews } = useTina(reviews ?? EMPTY_QUERY);
  const { data: livePage } = useTina(page ?? EMPTY_QUERY);

  const band = settings ? (liveSettings as any)?.settings?.testimonials : undefined;
  const p = page ? (livePage as any)?.feasibilityPackage : undefined;

  // Spread over the fallbacks with pruneEmpty, exactly as the other pages do: a
  // field the editor has cleared comes back as '' and would otherwise blank the
  // page, so an empty field simply leaves the standing copy in place.
  const hero = { ...HERO_FALLBACK, ...pruneEmpty({
    label: str(p?.hero?.label),
    heading: str(p?.hero?.heading),
    priceHeadline: str(p?.hero?.priceHeadline),
    priceSub: str(p?.hero?.priceSub),
    lede: str(p?.hero?.lede),
    ctaLabel: str(p?.hero?.ctaLabel),
    ctaNote: str(p?.hero?.ctaNote),
    image: normalizeImage(p?.hero?.image),
    imageAlt: str(p?.hero?.imageAlt),
  }) };

  const reviewsCopy = { ...REVIEWS_COPY_FALLBACK, ...pruneEmpty({
    eyebrow: str(p?.reviews?.eyebrow),
  }) };

  // Lists are all-or-nothing rather than merged item by item: the fallback
  // stands in only while there is no list at all, because an editor deleting
  // the third trust marker has to be able to delete it, not have it reappear.
  // Each item carries its own field ids so a click resolves to that item.
  const cmsMarkers = arr<any>(p?.hero?.markers);
  const trustMarkers = cmsMarkers.length
    ? cmsMarkers.map((m) => ({ label: str(m?.label), tina: f(m, 'label') }))
    : TRUST_MARKERS_FALLBACK.map((label) => ({ label, tina: undefined }));

  const cmsIncludes = arr<any>(p?.entry?.automated?.includes);
  const entryIncludes = cmsIncludes.length
    ? cmsIncludes.map((it) => ({ label: str(it?.label), tina: f(it, 'label') }))
    : undefined;

  const cmsSteps = arr<any>(p?.howItWorks?.steps);
  const steps: HowItWorksItem[] | undefined = cmsSteps.length
    ? cmsSteps.map((s) => ({
        durationLabel: str(s?.durationLabel),
        title: str(s?.title),
        lead: str(s?.lead),
        detail: str(s?.detail),
        tina: {
          durationLabel: f(s, 'durationLabel'),
          title: f(s, 'title'),
          lead: f(s, 'lead'),
          detail: f(s, 'detail'),
        },
      }))
    : undefined;

  // Not all-or-nothing, unlike the lists above: these rows only OVERRIDE the
  // five deliverables in code, matched by `key`, because the names and the
  // one-line descriptions are shared with the /conversions pages.
  const cmsDeliverables = arr<any>(p?.deliverables?.items);
  const deliverableItems: DeliverableCopy[] | undefined = cmsDeliverables.length
    ? cmsDeliverables.map((d) => ({
        key: str(d?.key),
        why: str(d?.why),
        image: normalizeImage(d?.image),
        imageAlt: str(d?.imageAlt),
        tina: { why: f(d, 'why'), image: f(d, 'image'), imageAlt: f(d, 'imageAlt') },
      }))
    : undefined;

  const cmsLayers = arr<any>(p?.analysis?.layers);
  const layers: EngineLayer[] | undefined = cmsLayers.length
    ? cmsLayers.map((l) => ({
        eyebrow: str(l?.eyebrow),
        title: str(l?.title),
        body: str(l?.body),
        tina: { eyebrow: f(l, 'eyebrow'), title: f(l, 'title'), body: f(l, 'body') },
      }))
    : undefined;

  const cmsPeople = arr<any>(p?.team?.people);
  const people: PackagePerson[] | undefined = cmsPeople.length
    ? cmsPeople.map((m) => ({
        name: str(m?.name),
        role: str(m?.role),
        line: str(m?.line),
        // Left undefined rather than '' on purpose: an empty photograph is what
        // makes the card fall back to initials, which is how Jodi's card is
        // meant to render until there is a real photograph of her.
        image: normalizeImage(m?.image) || undefined,
        tina: { name: f(m, 'name'), role: f(m, 'role'), line: f(m, 'line'), image: f(m, 'image') },
      }))
    : undefined;

  const cmsProof = arr<any>(p?.team?.proofPoints);
  const proofPoints = cmsProof.length
    ? cmsProof.map((pt) => ({ label: str(pt?.label), tina: f(pt, 'label') }))
    : undefined;

  const cmsFaqs = arr<any>(p?.faq?.items);
  const faqs: PackageFaqItem[] | undefined = cmsFaqs.length
    ? cmsFaqs.map((q) => {
        const exclusions = arr<any>(q?.exclusions);
        return {
          question: str(q?.question),
          answer: str(q?.answer),
          list: exclusions.length
            ? exclusions.map((x) => ({ label: str(x?.label), tina: f(x, 'label') }))
            : undefined,
          tina: { question: f(q, 'question'), answer: f(q, 'answer') },
        };
      })
    : undefined;

  // Connection nodes carry their own metadata, so each review's marker points
  // at that review's document rather than at the list.
  const reviewItems: ReviewItem[] | undefined = reviews
    ? arr((liveReviews as any)?.reviewConnection?.edges)
        .map((e: any) => e?.node)
        .filter(Boolean)
        .sort((a: any, b: any) => num(a?.order) - num(b?.order))
        .map((n: any) => ({
          author: str(n.author),
          title: str(n.title) || undefined,
          quote: str(n.quote),
          date: str(n.date),
          datePublished: str(n.datePublished),
          rating: num(n.rating, 5) as 5,
          topics: arr<string>(n.topics) as ReviewItem['topics'],
          tina: {
            author: f(n, 'author'),
            title: f(n, 'title'),
            quote: f(n, 'quote'),
            date: f(n, 'date'),
          },
        }))
    : undefined;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* The marker goes on the image itself rather than the section, which
            is the wrapper for everything on top of it. */}
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          className="object-cover"
          data-tina-field={f(p?.hero, 'image')}
        />
        <div className="absolute inset-0 bg-thistle-black/65" />
        <div className="relative z-10 max-w-5xl mx-auto px-fl-margin text-center pt-28 pb-fl-section">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-5" data-tina-field={f(p?.hero, 'label')}>{hero.label}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-fluid-h1 font-medium tracking-tighter leading-[1.05] text-white mb-fl-5" data-tina-field={f(p?.hero, 'heading')}>
              {/* One field, split back into the <br /> that was written by hand,
                  so the markup is exactly what it was and the whole headline is
                  a single click-to-edit target. */}
              {hero.heading.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </h1>
          </Reveal>
          {/* Ed's August 2026 final brief: "Replace 'from £298' as the headline
              starting price with: 'Feasibility from £49.99' and immediately
              below 'Design-led feasibility from £298'." */}
          <Reveal delay={0.2}>
            <p className="text-fluid-h5 font-medium tracking-tight text-white mb-fl-2" data-tina-field={f(p?.hero, 'priceHeadline')}>
              {hero.priceHeadline}
            </p>
            <p className="text-fluid-base text-white/70 mb-fl-4" data-tina-field={f(p?.hero, 'priceSub')}>
              {hero.priceSub}
            </p>
            <p className="text-fluid-base text-white/85 leading-relaxed font-light mb-fl-6 max-w-xl mx-auto" data-tina-field={f(p?.hero, 'lede')}>
              {hero.lede}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <a href="#instant-quote">
              <Button size="lg" variant="primary" icon={<ArrowUpRight size={18} />} data-tina-field={f(p?.hero, 'ctaLabel')}>
                {hero.ctaLabel}
              </Button>
            </a>
            <p className="text-xs text-white/60 mt-fl-4" data-tina-field={f(p?.hero, 'ctaNote')}>{hero.ctaNote}</p>
            <TrustpilotBadge tone="light" className="mt-fl-5" />
          </Reveal>
          <Reveal delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-fl-4 sm:gap-fl-7 mt-fl-7">
              {/* Keyed by position, not by the label: the label is a live form
                  value in the editor, so keying on it remounts the marker on
                  every keystroke. The icon is paired by position too. */}
              {trustMarkers.map((m, i) => {
                const Icon = TRUST_MARKER_ICONS[i];
                return (
                  <div key={i} className="flex items-center gap-2 text-white/85">
                    {Icon && <Icon size={16} className="text-thistle-green" />}
                    <span className="text-sm font-medium" data-tina-field={m.tina}>{m.label}</span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Social proof strip */}
      <DeveloperLogos />

      {/* Product choice + the shared pricing calculator, near the top per the
          brief: "the website should never feel like contact us for a quote". */}
      <PackageEntry
        eyebrow={str(p?.entry?.eyebrow)}
        heading={str(p?.entry?.heading)}
        priceSub={str(p?.entry?.priceSub)}
        lede={str(p?.entry?.lede)}
        automated={{
          name: str(p?.entry?.automated?.name),
          strapline: str(p?.entry?.automated?.strapline),
          includes: entryIncludes,
        }}
        architectural={{
          badge: str(p?.entry?.architectural?.badge),
          name: str(p?.entry?.architectural?.name),
          strapline: str(p?.entry?.architectural?.strapline),
          body: str(p?.entry?.architectural?.body),
          ctaLabel: str(p?.entry?.architectural?.ctaLabel),
        }}
        partnerPrefix={str(p?.entry?.partnerPrefix)}
        partnerLinkLabel={str(p?.entry?.partnerLinkLabel)}
        partnerSuffix={str(p?.entry?.partnerSuffix)}
        tina={{
          eyebrow: f(p?.entry, 'eyebrow'),
          heading: f(p?.entry, 'heading'),
          priceSub: f(p?.entry, 'priceSub'),
          lede: f(p?.entry, 'lede'),
          automatedName: f(p?.entry?.automated, 'name'),
          automatedStrapline: f(p?.entry?.automated, 'strapline'),
          architecturalBadge: f(p?.entry?.architectural, 'badge'),
          architecturalName: f(p?.entry?.architectural, 'name'),
          architecturalStrapline: f(p?.entry?.architectural, 'strapline'),
          architecturalBody: f(p?.entry?.architectural, 'body'),
          architecturalCtaLabel: f(p?.entry?.architectural, 'ctaLabel'),
          partnerPrefix: f(p?.entry, 'partnerPrefix'),
          partnerLinkLabel: f(p?.entry, 'partnerLinkLabel'),
          partnerSuffix: f(p?.entry, 'partnerSuffix'),
        }}
      />

      {/* How it works, updated for the pay-first journey */}
      <HowItWorks
        eyebrow={str(p?.howItWorks?.eyebrow)}
        heading={str(p?.howItWorks?.heading)}
        headingAccent={str(p?.howItWorks?.headingAccent)}
        steps={steps}
        tina={{
          eyebrow: f(p?.howItWorks, 'eyebrow'),
          heading: f(p?.howItWorks, 'heading'),
          headingAccent: f(p?.howItWorks, 'headingAccent'),
        }}
      />

      {/* "What You Actually Receive": the deliverables selector, the real
          sample report, and the nine-bed HMO "see it in practice" example, all
          merged into one section per the brief. */}
      <DeliverableShowcase
        eyebrow={str(p?.deliverables?.eyebrow)}
        heading={str(p?.deliverables?.heading)}
        headingAccent={str(p?.deliverables?.headingAccent)}
        lede={str(p?.deliverables?.lede)}
        items={deliverableItems}
        sample={{
          heading: str(p?.deliverables?.sample?.heading),
          body: str(p?.deliverables?.sample?.body),
          privacyNote: str(p?.deliverables?.sample?.privacyNote),
        }}
        sampleTina={{
          heading: f(p?.deliverables?.sample, 'heading'),
          body: f(p?.deliverables?.sample, 'body'),
          privacyNote: f(p?.deliverables?.sample, 'privacyNote'),
        }}
        example={{
          eyebrow: str(p?.deliverables?.example?.eyebrow),
          linkLabel: str(p?.deliverables?.example?.linkLabel),
        }}
        tina={{
          eyebrow: f(p?.deliverables, 'eyebrow'),
          heading: f(p?.deliverables, 'heading'),
          headingAccent: f(p?.deliverables, 'headingAccent'),
          lede: f(p?.deliverables, 'lede'),
          exampleEyebrow: f(p?.deliverables?.example, 'eyebrow'),
          exampleLinkLabel: f(p?.deliverables?.example, 'linkLabel'),
        }}
      />

      {/* What's included in data analysis */}
      <FeasibilityEngine
        eyebrow={str(p?.analysis?.eyebrow)}
        heading={str(p?.analysis?.heading)}
        headingAccent={str(p?.analysis?.headingAccent)}
        lede={str(p?.analysis?.lede)}
        ctaLabel={str(p?.analysis?.ctaLabel)}
        layers={layers}
        tina={{
          eyebrow: f(p?.analysis, 'eyebrow'),
          heading: f(p?.analysis, 'heading'),
          headingAccent: f(p?.analysis, 'headingAccent'),
          lede: f(p?.analysis, 'lede'),
          ctaLabel: f(p?.analysis, 'ctaLabel'),
        }}
      />

      {/* Who you're working with */}
      <PackageTeam
        eyebrow={str(p?.team?.eyebrow)}
        heading={str(p?.team?.heading)}
        linkLabel={str(p?.team?.linkLabel)}
        people={people}
        proofPoints={proofPoints}
        tina={{
          eyebrow: f(p?.team, 'eyebrow'),
          heading: f(p?.team, 'heading'),
          linkLabel: f(p?.team, 'linkLabel'),
        }}
      />

      {/* Maywood Group leads here because their review is literally about
          booking a feasibility before committing to a purchase, and about the
          study returning an answer they did not want. That is a better argument
          for the product than any wording of ours. featuredAuthor is a lookup
          against the review author, so it stays in code — it selects a record
          rather than saying anything.

          No `heading` prop: this page has never set one, so it takes the shared
          default from the section itself. Passing one here would pin a copy of
          it to this page and quietly stop it following the others. */}
      <Testimonials
        eyebrow={reviewsCopy.eyebrow}
        featuredAuthor="Maywood Group"
        lede={band ? str(band.lede) || undefined : undefined}
        linkLabel={band ? str(band.linkLabel) || undefined : undefined}
        reviews={reviewItems}
        tina={{
          eyebrow: f(p?.reviews, 'eyebrow'),
          lede: f(band, 'lede'),
          linkLabel: f(band, 'linkLabel'),
        }}
      />

      <PackageFAQ
        eyebrow={str(p?.faq?.eyebrow)}
        heading={str(p?.faq?.heading)}
        lede={str(p?.faq?.lede)}
        ctaLabel={str(p?.faq?.ctaLabel)}
        faqs={faqs}
        tina={{
          eyebrow: f(p?.faq, 'eyebrow'),
          heading: f(p?.faq, 'heading'),
          lede: f(p?.faq, 'lede'),
          ctaLabel: f(p?.faq, 'ctaLabel'),
        }}
      />

      <StickyCTA
        label={str(p?.stickyCta?.label)}
        ctaLabel={str(p?.stickyCta?.ctaLabel)}
        tina={{
          label: f(p?.stickyCta, 'label'),
          ctaLabel: f(p?.stickyCta, 'ctaLabel'),
        }}
      />
    </>
  );
};
