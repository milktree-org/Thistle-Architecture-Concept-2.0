import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { caseStudies } from '@/data/caseStudiesData';
import { getCaseStudies } from '@/lib/caseStudies';
import { CaseStudyDetailPage } from '@/views/CaseStudyDetailPage';
import client from '@/tina/__generated__/client';
import { str } from '@/lib/tina';

// generateMetadata and the page component are separate entry points and Next
// hands them nothing in common, so both need the document. cache() dedupes the
// two calls within a request without holding anything between requests, which
// a module-level variable would — and that would serve a stale document for as
// long as the server stayed up after an edit.
//
// Returns null rather than throwing for a slug with no document, so the caller
// can decide between rendering from the record in code and a real 404.
const load = cache(async (slug: string) => {
  try {
    return await client.queries.caseStudy({ relativePath: `${slug}.json` });
  } catch {
    return null;
  }
});

// The pages to build come from the CMS, not from data/caseStudiesData.ts: a
// case study added to content/case-studies has to get a page, and a document
// removed there must stop getting one.
export async function generateStaticParams() {
  const slugs: string[] = [];
  let after: string | undefined;

  // Tina returns 50 documents at a time and there are 35, so this goes round
  // once today. It still loops, because being silently truncated here would
  // simply stop building some case study pages, with nothing to notice — and
  // the filename IS the slug, so no separate field can disagree with it.
  for (;;) {
    const { data } = await client.queries.caseStudyConnection({ after });
    const connection = data.caseStudyConnection;
    for (const edge of connection?.edges ?? []) {
      const filename = edge?.node?._sys.filename;
      if (filename) slugs.push(filename);
    }
    if (!connection?.pageInfo?.hasNextPage || !connection.pageInfo.endCursor) break;
    after = connection.pageInfo.endCursor;
  }

  return slugs.map((slug) => ({ slug }));
}

/**
 * "Nine-Bed HMO Conversion, Aylesbury" rather than "Nine-Bed HMO Conversion".
 *
 * Item 83 of Ed's September 2026 list: every case study title read "conversion
 * type | Thistle Architecture", so nothing could rank for a place. The place
 * is the first part of the location field, the town where there is one and
 * otherwise the area or national park, per item 84. A location that is only
 * a country adds nothing and is left off. An SEO title typed in the CMS wins
 * outright, so an editor can still write the whole thing by hand.
 */
const withPlace = (title: string, location?: string): string => {
  const place = (location ?? '').split(',')[0].trim();
  if (!place || place === 'England' || place === 'UK') return title;
  if (title.toLowerCase().includes(place.toLowerCase())) return title;
  return `${title}, ${place}`;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = await load(slug);
  const cms = doc?.data.caseStudy;
  const fallback = caseStudies.find((c) => c.slug === slug);

  return {
    // The search-result fields are optional overrides. Left empty — which is
    // how all 35 are seeded — the listing falls back to the case study's own
    // title and summary, exactly as it did before they existed, and then to
    // the record in code so an empty CMS never publishes an untitled page.
    title: str(cms?.seo?.metaTitle) || withPlace(str(cms?.title) || fallback?.title || 'Case Study', str(cms?.location) || fallback?.location),
    description:
      str(cms?.seo?.metaDescription) || str(cms?.desc) || fallback?.desc || 'Thistle Architecture case study.',
    // Routing, not content. The canonical has to match the URL this file
    // serves, so it stays in code.
    alternates: { canonical: `/case-studies/${slug}` },
  };
}

// An unknown slug used to render "Case study not found" with a 200, which is a
// soft 404: search engines index the URL as a real page. It matters now that
// bishopstoke and forest-home have been removed. Fail properly instead, the way
// /conversions/[type] already does.
//
// A slug that exists in one place but not the other still renders: a document
// with no record in code is a case study added through the CMS, and a record
// with no document is a seeding gap that should show the copy in code rather
// than take a live page down. Only a slug in neither is a 404.
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await load(slug);
  if (!doc && !caseStudies.some((c) => c.slug === slug)) notFound();

  // The raw query, variables and data are all handed down, not just the data:
  // useTina needs the query to re-run it against the editor's live values.
  // The Next link at the foot of the page, worked out here from the live
  // records. It used to come from the code copy, which still carried the old
  // street-name titles, so a page read "Next Project: Derby Road" long after
  // the project was retitled in the CMS. Same list and order as the listing.
  const all = await getCaseStudies();
  const self = all.find((c) => c.slug === slug);
  const siblings = all.filter((c) => c.kind === (self?.kind ?? 'project'));
  const at = siblings.findIndex((c) => c.slug === slug);
  const nx = siblings.length ? siblings[(at + 1) % siblings.length] : undefined;

  return (
    <CaseStudyDetailPage
      page={doc ? { query: doc.query, variables: doc.variables, data: doc.data } : undefined}
      next={nx && nx.slug !== slug ? { slug: nx.slug, title: nx.title } : undefined}
    />
  );
}
