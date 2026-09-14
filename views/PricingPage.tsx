"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { useTina } from 'tinacms/dist/react';
import { ArrowUpRight, Check } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/animations/Reveal';
import { FeasibilityCalculator } from '../sections/pricing/FeasibilityCalculator';
import { Testimonials, type ReviewItem } from '../sections/Testimonials';
import {
  PRODUCTS,
  FEE_FACTORS,
  AUTOMATED_CONTENTS,
  AUTOMATED_BOUNDARY,
} from '../data/pricingData';
import { reviews as fallbackReviews, REVIEWS_URL } from '../data/reviewsData';
import { f, type TinaQuery, EMPTY_QUERY } from '../lib/tina-fields';
import { str, num, arr, pruneEmpty } from '../lib/tina';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Built from Ed's Pricing & Feasibility Calculator Brief, August 2026, and
// revised against his final update brief later that month.
//
// The brief's UX principle drives the page order: "the website should never
// feel like contact us for a quote". So the four products come first, the
// calculator sits immediately under them, and the final brief's second rule
// governs what comes after: show the customer exactly what they pay, do not
// publish the pricing engine. The fee tables that used to spell out every
// addition are gone; what remains is the list of factors that move the fee.

// The copy below is now a fallback rather than the page's only source: the
// same strings also live in content/pricing/index.json, seeded byte-for-byte
// from here and from data/pricingData.ts. They stay in code so the page renders
// unchanged if it is mounted without a CMS query, and so the provenance notes
// stay next to the words they explain.
//
// WHAT IS NOT IN THE CMS, AND WHY: every figure that reads as the price of a
// product. PRODUCTS[].price and the two prices in the comparison cards are
// still rendered straight from code, next to the engine that decides what a
// customer is actually charged (BASE_FEE and the area ladder in
// data/pricingData.ts, which both the calculator and /api/checkout compute
// from, and which scripts/pricing-check.mjs asserts against the brief). An
// editable card price could publish a fee the site does not honour — the page
// saying £250 while Stripe takes £298 — with nothing to catch it.
//
// The same figures are also duplicated in pricingFrom in
// data/feasibilityPackageData.ts and in literal strings across the feasibility
// pages, so a price change is a four-place edit today. That is worth fixing,
// but not by making one of the four copies editable in isolation.
//
// Headings that quote a price ("£49.99 Or From £298?") ARE editable, because
// they are sentences and a page whose headings are frozen is not much of a CMS.
// The collection's field descriptions warn the editor that the number has to
// move in code at the same time.

const HERO_FALLBACK = {
  label: 'Pricing',
  heading: 'Know The Fee Before You Commit.',
  description: 'Four ways to test a building, from a £15.99 automated check to an design-led feasibility. Answer a few questions and the price is on screen, not in an email.',
};

const PRODUCTS_COPY_FALLBACK = {
  // The final brief: the design-led product is the visually preferred
  // option, labelled explicitly.
  recommendedLabel: 'Recommended',
  // The final brief's key line, stated once for the whole ladder.
  vatNote: 'All fees include VAT.',
};

const CALCULATOR_FALLBACK = {
  eyebrow: 'Architectural Feasibility',
  heading: 'Get Your Fixed Fee.',
  lede: 'Seven questions, about a minute. Straightforward projects get a price on screen. Anything larger or more involved routes to a free Expert Session, because a scope we have not seen is not one we will put a number on.',
};

const FEE_FACTORS_COPY_FALLBACK = {
  heading: 'What Affects Your Fee.',
  lede: 'Every fee is fixed before you pay. These are the things that move it, and the calculator asks about each one, so the number you see is the number you pay.',
  footnote: 'Where a project has several of these at once, we stop pricing automatically and talk to you first, through a free Expert Session.',
};

const COMPARISON_FALLBACK = {
  heading: '£49.99 Or From £298?',
  lede: 'Both start from the same data. The difference is what happens to it.',
  automatedLabel: 'Automated Site Feasibility',
  automatedBody: 'Data-led and fully automated. Planning, standards, indicative capacity, commercial context, risks and next steps, in around 30 minutes. No drawings, no design review.',
  architecturalLabel: 'Architectural Feasibility',
  architecturalBody: 'Everything in the automated appraisal, plus our design team: planning interpretation, sketch and layout testing, and a professional recommendation you can act on.',
};

const AUTOMATED_COPY_FALLBACK = {
  eyebrow: 'Automated Site Feasibility, £49.99',
  heading: 'What You Get For £49.99.',
};

const REVIEWS_COPY_FALLBACK = {
  eyebrow: 'Client Reviews',
  heading: 'Priced Up Front.',
};

// The final brief asks for a strong "avoided a bad purchase" review placed
// high on the page. Maywood is exactly that story, and it is pinned rather
// than searched for so an edit to reviewsData cannot quietly swap in a
// less relevant one. The author is a lookup key, not copy, so it stays here
// rather than becoming a field an editor could break the pin with.
const FEATURED_AUTHOR = 'Maywood Group';

/**
 * A product card: editable copy merged over the code fallback, plus the fields
 * that are not editable at all — the price, where the link goes, and the id the
 * "Recommended" treatment keys off.
 */
interface ProductCard {
  id: string;
  price: string;
  href: string;
  external: boolean;
  name: string;
  strapline: string;
  body: string;
  cta: string;
  turnaround: string | null;
  tina?: Partial<Record<'name' | 'strapline' | 'body' | 'cta' | 'turnaround', string>>;
}

/** A list item plus the field id for its own record, never for the list. */
interface ListItem {
  text: string;
  field?: string;
}

interface PricingPageProps {
  /**
   * Raw CMS queries, passed straight through from the server page so that
   * useTina can re-run them live inside the editor. Optional so the page still
   * renders if it is mounted without them.
   */
  settings?: TinaQuery;
  reviews?: TinaQuery;
  /** This page's own copy, from the `pricing` singleton. */
  page?: TinaQuery;
}

export const PricingPage: React.FC<PricingPageProps> = ({ settings, reviews, page }) => {
  // useTina returns the server data verbatim on the public site and swaps in
  // the live form values inside the editor. Passing a null-ish query is not
  // allowed, so the hooks run against a stub when the props are absent and the
  // results are discarded below.
  const { data: liveSettings } = useTina(settings ?? EMPTY_QUERY);
  const { data: liveReviews } = useTina(reviews ?? EMPTY_QUERY);
  const { data: livePage } = useTina(page ?? EMPTY_QUERY);

  const band = settings ? (liveSettings as any)?.settings?.testimonials : undefined;
  const p = page ? (livePage as any)?.pricing : undefined;

  // Spread over the fallbacks with pruneEmpty, exactly as the footer does: a
  // field the editor has cleared comes back as '' and would otherwise blank the
  // page, so an empty field simply leaves the standing copy in place.
  const hero = { ...HERO_FALLBACK, ...pruneEmpty({
    label: str(p?.hero?.label),
    heading: str(p?.hero?.heading),
    description: str(p?.hero?.description),
  }) };

  const productsCopy = { ...PRODUCTS_COPY_FALLBACK, ...pruneEmpty({
    recommendedLabel: str(p?.products?.recommendedLabel),
    vatNote: str(p?.products?.vatNote),
  }) };

  const calculator = { ...CALCULATOR_FALLBACK, ...pruneEmpty({
    eyebrow: str(p?.calculator?.eyebrow),
    heading: str(p?.calculator?.heading),
    lede: str(p?.calculator?.lede),
  }) };

  const feeFactorsCopy = { ...FEE_FACTORS_COPY_FALLBACK, ...pruneEmpty({
    heading: str(p?.feeFactors?.heading),
    lede: str(p?.feeFactors?.lede),
    footnote: str(p?.feeFactors?.footnote),
  }) };

  const comparison = { ...COMPARISON_FALLBACK, ...pruneEmpty({
    heading: str(p?.comparison?.heading),
    lede: str(p?.comparison?.lede),
    automatedLabel: str(p?.comparison?.automatedLabel),
    automatedBody: str(p?.comparison?.automatedBody),
    architecturalLabel: str(p?.comparison?.architecturalLabel),
    architecturalBody: str(p?.comparison?.architecturalBody),
  }) };

  const automatedCopy = { ...AUTOMATED_COPY_FALLBACK, ...pruneEmpty({
    eyebrow: str(p?.automated?.eyebrow),
    heading: str(p?.automated?.heading),
  }) };

  const reviewsCopy = { ...REVIEWS_COPY_FALLBACK, ...pruneEmpty({
    eyebrow: str(p?.reviews?.eyebrow),
    heading: str(p?.reviews?.heading),
  }) };

  // The products are matched by key rather than by position, and the code list
  // still drives the order and the length. The ladder is a commercial decision
  // and each card carries a route and a price that are not editable, so a
  // reordered or half-deleted CMS list must not be able to rearrange it. The
  // collection's description tells the editor as much.
  const cmsProducts = new Map<string, any>();
  for (const item of arr<any>(p?.products?.items)) {
    const key = str(item?.key);
    if (key) cmsProducts.set(key, item);
  }

  const products: ProductCard[] = PRODUCTS.map((product) => {
    const c = cmsProducts.get(product.id);
    return {
      id: product.id,
      price: product.price,
      href: product.href,
      external: product.external,
      name: product.name,
      strapline: product.strapline,
      body: product.body,
      cta: product.cta,
      turnaround: product.turnaround as string | null,
      ...pruneEmpty({
        name: str(c?.name),
        strapline: str(c?.strapline),
        body: str(c?.body),
        cta: str(c?.cta),
        turnaround: str(c?.turnaround),
      }),
      tina: {
        name: f(c, 'name'),
        strapline: f(c, 'strapline'),
        body: f(c, 'body'),
        cta: f(c, 'cta'),
        turnaround: f(c, 'turnaround'),
      },
    };
  });

  // Lists are all-or-nothing rather than merged item by item: the fallback
  // stands in only while there is no list at all, because an editor deleting a
  // factor has to be able to delete it, not have it reappear. Each item carries
  // its own field id so a click resolves to that item rather than to the list.
  const cmsFactors = arr<any>(p?.feeFactors?.items);
  const feeFactors: ListItem[] = cmsFactors.length
    ? cmsFactors.map((item) => ({ text: str(item?.label), field: f(item, 'label') }))
    : FEE_FACTORS.map((text) => ({ text }));

  const cmsInclusions = arr<any>(p?.automated?.items);
  const inclusions: ListItem[] = cmsInclusions.length
    ? cmsInclusions.map((item) => ({ text: str(item?.text), field: f(item, 'text') }))
    : AUTOMATED_CONTENTS.map((text) => ({ text }));

  const boundary = str(p?.automated?.boundary) || AUTOMATED_BOUNDARY;

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

  const featuredReview = (reviewItems ?? (fallbackReviews as ReviewItem[])).find(
    (r) => r.author === FEATURED_AUTHOR,
  );

  return (
    <>
      <PageHero
        label={hero.label}
        heading={hero.heading}
        description={hero.description}
        tina={{
          label: f(p?.hero, 'label'),
          heading: f(p?.hero, 'heading'),
          description: f(p?.hero, 'description'),
        }}
      >
        {/* Ed, 14 September 2026: the button to get an architectural fee sat
            below the fold, under the product ladder. It is in the header now
            so nobody has to scroll to find it. Same destination as the card. */}
        <Link href="#calculator" className="inline-block">
          <Button size="lg" variant="primary" icon={<ArrowUpRight size={18} />}>
            Get Your Instant Fixed Fee
          </Button>
        </Link>
      </PageHero>

      {/* The four products */}
      <section className="px-fl-margin pb-fl-section bg-thistle-white">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-fl-4 items-stretch">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={Math.min(i * 0.07, 0.28)} fullHeight>
              <div
                className={`relative h-full flex flex-col rounded-2xl border p-fl-6 ${
                  product.id === 'architectural-feasibility'
                    ? 'border-thistle-green/40 bg-thistle-green/[0.06] shadow-lg shadow-thistle-green/[0.08]'
                    : 'border-thistle-black/[0.06] bg-white'
                }`}
              >
                {/* The final brief: the design-led product is the visually
                    preferred option, labelled explicitly. */}
                {product.id === 'architectural-feasibility' && (
                  <span
                    className="absolute -top-3 left-fl-6 px-3 py-1 rounded-full bg-thistle-green text-thistle-black text-[10px] uppercase tracking-[0.16em] font-bold"
                    data-tina-field={f(p?.products, 'recommendedLabel')}
                  >
                    {productsCopy.recommendedLabel}
                  </span>
                )}
                <h2 className="text-fluid-h6 font-medium tracking-tight text-thistle-black" data-tina-field={product.tina?.name}>
                  {product.name}
                </h2>
                {/* No marker: the price is code, not content. See the note at
                    the top of this file. */}
                <p className="text-fluid-h3 font-medium tracking-tight text-thistle-black my-fl-3 leading-none">
                  {product.price}
                </p>
                <p className="text-fluid-sm font-medium text-thistle-black/80 mb-fl-2" data-tina-field={product.tina?.strapline}>
                  {product.strapline}
                </p>
                <p className="text-fluid-sm text-thistle-black/55 leading-relaxed flex-1" data-tina-field={product.tina?.body}>
                  {product.body}
                </p>
                {product.turnaround && (
                  <p
                    className="text-xs text-thistle-black/45 mt-fl-4 pt-fl-4 border-t border-thistle-black/[0.06]"
                    data-tina-field={product.tina?.turnaround}
                  >
                    {product.turnaround}
                  </p>
                )}
                <div className="mt-fl-5">
                  {product.external ? (
                    <>
                      {/* Item 78. This tier is on a separate site and brand, and
                          the button used to leave without saying so. Said before
                          the click rather than after it. */}
                      <a
                        href={product.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-thistle-black hover:text-thistle-green transition-colors"
                        data-tina-field={product.tina?.cta}
                      >
                        {product.cta} <ArrowUpRight size={15} />
                      </a>
                      <p className="mt-fl-2 text-[11px] leading-relaxed text-thistle-black/45">
                        Opens hmochecker.co.uk in a new tab. A separate tool from a
                        sister brand, not a Thistle feasibility.
                      </p>
                    </>
                  ) : (
                    <Link
                      href={product.href}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-thistle-black hover:text-thistle-green transition-colors"
                      data-tina-field={product.tina?.cta}
                    >
                      {product.cta} <ArrowUpRight size={15} />
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        {/* The final brief's key line, stated once for the whole ladder. */}
        <p
          className="max-w-[1360px] mx-auto text-xs text-thistle-black/50 mt-fl-4"
          data-tina-field={f(p?.products, 'vatNote')}
        >
          {productsCopy.vatNote}
        </p>
      </section>

      {/* The calculator, immediately under the products rather than a page away */}
      <section id="calculator" className="px-fl-margin py-fl-section bg-white scroll-mt-28">
        <div className="max-w-[880px] mx-auto">
          <div className="text-center mb-fl-8">
            <Reveal>
              <p
                className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4"
                data-tina-field={f(p?.calculator, 'eyebrow')}
              >
                {calculator.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2
                className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-4"
                data-tina-field={f(p?.calculator, 'heading')}
              >
                {calculator.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p
                className="text-fluid-base text-thistle-black/70 leading-relaxed max-w-xl mx-auto"
                data-tina-field={f(p?.calculator, 'lede')}
              >
                {calculator.lede}
              </p>
            </Reveal>
          </div>
          {/* The questionnaire and the fee it works out are deliberately not
              editable: they are the brief's engine, asserted against it in
              scripts/pricing-check.mjs. */}
          <FeasibilityCalculator />

          {/* The "avoided a bad purchase" review, directly under the calculator
              where the buying decision actually happens. */}
          {featuredReview && (
            <Reveal delay={0.1}>
              <figure className="mt-fl-7 rounded-2xl border border-thistle-black/[0.08] bg-thistle-white p-fl-6">
                <div className="flex gap-0.5 mb-fl-3" aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="text-thistle-green">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {featuredReview.title && (
                  <p className="text-fluid-base font-medium text-thistle-black mb-fl-2" data-tina-field={featuredReview.tina?.title}>
                    {featuredReview.title}
                  </p>
                )}
                <blockquote className="text-fluid-sm text-thistle-black/70 leading-relaxed" data-tina-field={featuredReview.tina?.quote}>
                  &ldquo;{featuredReview.quote}&rdquo;
                </blockquote>
                <figcaption className="text-xs text-thistle-black/45 mt-fl-3">
                  {/* Only the name carries the marker, not the Trustpilot link
                      that follows it: a marker on the whole caption would
                      swallow the click and cancel the navigation. */}
                  <span data-tina-field={featuredReview.tina?.author}>{featuredReview.author}</span>,{' '}
                  <a href={REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-thistle-black transition-colors">
                    verified review on Trustpilot
                  </a>
                </figcaption>
              </figure>
            </Reveal>
          )}
        </div>
      </section>

      {/* What affects the fee. The final brief replaced the published formula
          with the factors alone: the customer sees exactly what they will pay in
          the calculator, without the engine behind it being public. */}
      <section className="px-fl-margin py-fl-section bg-thistle-white">
        <div className="max-w-[1000px] mx-auto">
          <Reveal>
            <h2
              className="text-fluid-h3 font-medium tracking-tight text-thistle-black mb-fl-2 text-center"
              data-tina-field={f(p?.feeFactors, 'heading')}
            >
              {feeFactorsCopy.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              className="text-fluid-sm text-thistle-black/60 text-center max-w-xl mx-auto mb-fl-8"
              data-tina-field={f(p?.feeFactors, 'lede')}
            >
              {feeFactorsCopy.lede}
            </p>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-fl-3">
            {feeFactors.map((factor, i) => (
              <Reveal key={factor.text} delay={Math.min(i * 0.05, 0.3)}>
                {/* The pill is the element that renders this one factor, and
                    the tick beside it is decoration rather than a second
                    field, so the marker belongs here. */}
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-thistle-black/[0.08] bg-white px-5 py-2.5 text-fluid-sm text-thistle-black/75"
                  data-tina-field={factor.field}
                >
                  <Check size={14} className="text-thistle-green" />
                  {factor.text}
                </span>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.25}>
            <p
              className="text-xs text-thistle-black/50 leading-relaxed mt-fl-6 max-w-2xl mx-auto text-center"
              data-tina-field={f(p?.feeFactors, 'footnote')}
            >
              {feeFactorsCopy.footnote}
            </p>
          </Reveal>
        </div>
      </section>

      {/* £49.99 vs £298+, stated explicitly per the final brief. */}
      <section className="px-fl-margin py-fl-section bg-white">
        <div className="max-w-[1000px] mx-auto">
          <Reveal>
            <h2
              className="text-fluid-h3 font-medium tracking-tight text-thistle-black mb-fl-2 text-center"
              data-tina-field={f(p?.comparison, 'heading')}
            >
              {comparison.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              className="text-fluid-sm text-thistle-black/60 text-center max-w-xl mx-auto mb-fl-8"
              data-tina-field={f(p?.comparison, 'lede')}
            >
              {comparison.lede}
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-fl-5">
            <Reveal delay={0.15} fullHeight>
              <div className="h-full rounded-2xl border border-thistle-black/[0.08] bg-thistle-white p-fl-6">
                <p
                  className="text-[10px] uppercase tracking-[0.16em] font-semibold text-thistle-black/50 mb-fl-2"
                  data-tina-field={f(p?.comparison, 'automatedLabel')}
                >
                  {comparison.automatedLabel}
                </p>
                {/* No marker: price, not copy. */}
                <p className="text-fluid-h4 font-medium tracking-tight text-thistle-black mb-fl-3">£49.99</p>
                <p
                  className="text-fluid-sm text-thistle-black/65 leading-relaxed"
                  data-tina-field={f(p?.comparison, 'automatedBody')}
                >
                  {comparison.automatedBody}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2} fullHeight>
              <div className="h-full rounded-2xl border border-thistle-green/35 bg-thistle-green/[0.06] p-fl-6">
                <p
                  className="text-[10px] uppercase tracking-[0.16em] font-semibold text-thistle-green mb-fl-2"
                  data-tina-field={f(p?.comparison, 'architecturalLabel')}
                >
                  {comparison.architecturalLabel}
                </p>
                {/* No marker: this is BASE_FEE with a "From" in front of it. */}
                <p className="text-fluid-h4 font-medium tracking-tight text-thistle-black mb-fl-3">From £298</p>
                <p
                  className="text-fluid-sm text-thistle-black/65 leading-relaxed"
                  data-tina-field={f(p?.comparison, 'architecturalBody')}
                >
                  {comparison.architecturalBody}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What the £49.99 covers */}
      <section className="px-fl-margin py-fl-section bg-thistle-white">
        <div className="max-w-[1000px] mx-auto">
          <Reveal>
            <p
              className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4"
              data-tina-field={f(p?.automated, 'eyebrow')}
            >
              {automatedCopy.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="text-fluid-h3 font-medium tracking-tight text-thistle-black mb-fl-6"
              data-tina-field={f(p?.automated, 'heading')}
            >
              {automatedCopy.heading}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-fl-8 gap-y-fl-3">
            {inclusions.map((inclusion, i) => (
              <Reveal key={inclusion.text} delay={Math.min(i * 0.03, 0.24)}>
                <div className="flex gap-fl-3 items-start">
                  <Check size={15} className="text-thistle-green mt-1 shrink-0" />
                  <span className="text-fluid-sm text-thistle-black/70 leading-relaxed" data-tina-field={inclusion.field}>
                    {inclusion.text}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            {/* Ed asked for this boundary stated plainly rather than buried. */}
            <p
              className="text-fluid-sm text-thistle-black/55 leading-relaxed mt-fl-7 pt-fl-5 border-t border-thistle-black/[0.06] max-w-2xl"
              data-tina-field={f(p?.automated, 'boundary')}
            >
              {boundary}
            </p>
          </Reveal>
        </div>
      </section>

      <Testimonials
        eyebrow={reviewsCopy.eyebrow}
        heading={reviewsCopy.heading}
        featuredAuthor={FEATURED_AUTHOR}
        lede={band ? str(band.lede) || undefined : undefined}
        linkLabel={band ? str(band.linkLabel) || undefined : undefined}
        reviews={reviewItems}
        tina={{
          eyebrow: f(p?.reviews, 'eyebrow'),
          heading: f(p?.reviews, 'heading'),
          lede: f(band, 'lede'),
          linkLabel: f(band, 'linkLabel'),
        }}
      />
    </>
  );
};
