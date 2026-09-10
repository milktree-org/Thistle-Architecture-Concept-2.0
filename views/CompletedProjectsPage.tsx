"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTina } from 'tinacms/dist/react';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/animations/Reveal';
import { completedProjects, type CaseStudy, type ConversionType } from '../data/caseStudiesData';
import { CaseCard } from '../sections/CaseStudies';
import { WorkTabs } from '../components/ui/WorkTabs';
import { f, type TinaQuery, EMPTY_QUERY } from '../lib/tina-fields';
import { str, arr, pruneEmpty } from '../lib/tina';

// Sub-tabs by conversion type, per Ed: all four types, and a project shows under
// every type it fits rather than being forced into one.
//
// Only types that actually have projects are offered. Two of the four have none
// yet, and an empty tab reads as a broken filter rather than an honest gap.
//
// This list stays in code even though the labels are editable. The `key` is the
// ?type= value in the URL and the value matched against a project's
// conversionTypes, the order is the order the chips appear in, and which types
// exist at all is a property of the projects. The CMS supplies label overrides
// keyed on `key`, exactly as layouts/PageShell.tsx does for the navigation, so
// a row deleted in Tina restores the label below rather than removing a filter.
const TYPES: { key: ConversionType; label: string }[] = [
  { key: 'commercial-to-residential', label: 'Commercial to Residential' },
  { key: 'hmo', label: 'HMO' },
  { key: 'co-living-large-hmo', label: 'Co-Living & Large HMO' },
  { key: 'mixed-use-commercial', label: 'Mixed-Use Commercial' },
  { key: 'high-end-residential', label: 'High-End Residential' },
];

// The standing copy, kept in code as the fallback so the page renders exactly
// as before when it is mounted without a CMS query, and so a field an editor
// has cleared leaves the page reading properly rather than blank. Same merge as
// sections/Footer.tsx.
const COPY_FALLBACK = {
  label: 'Our Work',
  heading: 'Projects.',
  description: 'Conversions and schemes delivered through to completion across the Thistle Group.',
  allLabel: 'All',
  footnote: 'Some of these were delivered by HMO Designers, our sister practice within the Thistle Group. Each one says so on its own page.',
};

interface CompletedProjectsPageProps {
  /**
   * This page's own copy, from content/listings/completed-projects.json,
   * passed straight through from the server page so useTina can re-run it live
   * inside the editor. Optional so the page still renders without it.
   */
  page?: TinaQuery;
  /**
   * Every completed project, unfiltered — the counts and the ?type= filter are
   * both worked out here. Defaults to the data module, so a page that passes
   * nothing renders exactly as before.
   *
   * THIS IS THE HOOK-IN POINT for the case studies collection. When the
   * projects are in Tina, the server page fetches the connection and passes the
   * mapped records here; each one goes straight to CaseCard, so once CaseCard
   * carries a per-record `tina` bag (the way sections/Testimonials.tsx does for
   * ReviewItem) the ids ride along on the item with no change in this file.
   * CaseCard is shared with the homepage and is not edited here. Records must
   * keep carrying `conversionTypes`, since the filter reads it.
   */
  items?: CaseStudy[];
}

export const CompletedProjectsPage: React.FC<CompletedProjectsPageProps> = ({
  page,
  items = completedProjects,
}) => {
  // useTina returns the server data verbatim on the public site and swaps in
  // the live form values inside the editor. Passing a null-ish query is not
  // allowed, and hooks cannot be called conditionally, so it runs against a
  // stub when the prop is absent and the result is discarded below.
  const { data: live } = useTina(page ?? EMPTY_QUERY);
  const cms = page ? (live as any)?.listings : undefined;

  // Spread over the fallbacks with pruneEmpty, exactly as the footer does: a
  // field the editor has cleared comes back as '' and would otherwise blank the
  // page, so an empty field simply leaves the standing copy in place.
  const copy = { ...COPY_FALLBACK, ...pruneEmpty({
    label: str(cms?.hero?.label),
    heading: str(cms?.hero?.heading),
    description: str(cms?.hero?.description),
    allLabel: str(cms?.allLabel),
    footnote: str(cms?.footnote),
  }) };

  // Chip labels from the CMS, keyed on the filter they rename, with the field
  // id alongside so a click resolves to that row rather than to the list. A key
  // that matches no chip is simply ignored, and a chip with no row keeps the
  // label in TYPES.
  const typeLabels: Record<string, { label: string; field?: string }> = {};
  for (const row of arr<any>(cms?.typeLabels)) {
    const key = str(row?.key);
    const label = str(row?.label);
    if (key && label) typeLabels[key] = { label, field: f(row, 'label') };
  }

  const countFor = (key: ConversionType) =>
    items.filter((p) => p.conversionTypes?.includes(key)).length;
  const available = TYPES.filter((t) => countFor(t.key) > 0);

  const chip = (isActive: boolean) =>
    `px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
      isActive
        ? 'bg-thistle-green text-thistle-black border-thistle-green'
        : 'bg-white text-thistle-black/60 border-thistle-black/[0.08] hover:border-thistle-black/25'
    }`;

  // The chips and the grid both depend on the ?type= filter, and reading that
  // filter is what used to cost this page its prerendered HTML: useSearchParams
  // opts a route out of static rendering, and with the whole page inside one
  // Suspense boundary what shipped was the empty fallback. Crawlers saw a page
  // with no projects on it.
  //
  // So the results are a plain render function rather than a component (a
  // component declared here would remount on every parent render), called in
  // two places below: once as the Suspense fallback with no filter applied,
  // which is what gets prerendered and is therefore what a crawler reads, and
  // once inside ResultsFromUrl, which reads the URL on the client.
  //
  // The filter still comes from the URL rather than from state seeded once,
  // which is the point of the original note above: a filtered view has to be
  // linkable and the back button has to work.
  const renderResults = (active: ConversionType | 'all') => {
    const shown =
      active === 'all'
        ? items
        : items.filter((p) => p.conversionTypes?.includes(active));

    return (
      <>
      <section className="px-fl-margin bg-thistle-white pb-fl-6">
        <div className="max-w-[1360px] mx-auto">
          {/* The two tab labels are shared with Feasibility Studies and repeat
              the Our Work menu, so they stay in code with the rest of the
              navigation rather than being editable twice. */}
          <WorkTabs active="projects" />

          <div className="flex flex-wrap gap-fl-2 mt-fl-5">
            {/* Each chip is a label plus a count of the projects behind it. The
                count is worked out from the projects as the page renders, so
                only the label carries a marker — a marker on the link would
                claim the number as well. */}
            <Link href="/case-studies/completed-projects" scroll={false} className={chip(active === 'all')}>
              <span data-tina-field={f(cms, 'allLabel')}>{copy.allLabel}</span> <span className="opacity-50">{items.length}</span>
            </Link>
            {available.map((t) => (
              <Link
                key={t.key}
                href={`/case-studies/completed-projects?type=${t.key}`}
                scroll={false}
                className={chip(active === t.key)}
              >
                <span data-tina-field={typeLabels[t.key]?.field}>{typeLabels[t.key]?.label ?? t.label}</span> <span className="opacity-50">{countFor(t.key)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-fl-section px-fl-margin bg-thistle-white">
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-fl-5">
            {shown.map((item, i) => (
              <Reveal key={item.slug} delay={Math.min(i * 0.06, 0.3)}>
                <CaseCard item={item} stage />
              </Reveal>
            ))}
          </div>
          <p className="text-xs text-thistle-black/40 mt-fl-6 max-w-md" data-tina-field={f(cms, 'footnote')}>
            {copy.footnote}
          </p>
        </div>
      </section>
      </>
    );
  };

  return (
    <>
      <PageHero
        label={copy.label}
        heading={copy.heading}
        description={copy.description}
        // Unlike the blog index, nothing is appended to this paragraph, so the
        // <p> renders exactly the field and can carry its marker.
        tina={{
          label: f(cms?.hero, 'label'),
          heading: f(cms?.hero, 'heading'),
          description: f(cms?.hero, 'description'),
        }}
      />

      <Suspense fallback={renderResults('all')}>
        <ResultsFromUrl render={renderResults} />
      </Suspense>
    </>
  );
};

/**
 * The only thing on this page that reads the URL.
 *
 * Isolated here so the de-opt it causes is contained: everything outside this
 * boundary still prerenders, and the fallback above renders the full,
 * unfiltered list into the static HTML.
 */
const ResultsFromUrl: React.FC<{
  render: (active: ConversionType | 'all') => React.ReactNode;
}> = ({ render }) => {
  const searchParams = useSearchParams();
  const raw = searchParams.get('type');
  const active: ConversionType | 'all' = TYPES.some((t) => t.key === raw)
    ? (raw as ConversionType)
    : 'all';
  return <>{render(active)}</>;
};
