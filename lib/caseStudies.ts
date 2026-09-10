import { cache } from 'react';
import client from '@/tina/__generated__/client';
import { caseStudies, type CaseStudy, type ConversionType } from '@/data/caseStudiesData';
import { str, num, arr, normalizeImage } from '@/lib/tina';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * The case studies, read from the CMS rather than from data/caseStudiesData.ts.
 *
 * This is what lets an editor add a case study. Creating a document already
 * produced a detail page — /case-studies/[slug] builds its params from the Tina
 * connection — but nothing linked to it, because the two listing pages and the
 * sitemap were still reading the TypeScript module, which only a developer can
 * add to. A new study appeared at its URL and was reachable from nowhere.
 *
 * Ordering is explicit and not incidental. The listings used to take their
 * order from array position in the module; a connection returns documents in
 * filename order, so switching source without an `order` field would have
 * quietly reshuffled both pages. Every existing study was seeded with its
 * current position, so the order on the page is unchanged.
 *
 * Server-only: it uses the generated client, which client components cannot
 * call. Cached per request so a page rendering both the listing and the sitemap
 * does not fetch twice.
 */
/**
 * The three figures on a card.
 *
 * A feasibility study that has moved to Ed's template carries a key
 * information table on its page. The card used to keep a separate set of
 * three figures, and the two drifted: "5 or 6" beds on the card against 6 on
 * the page, "Householder only" against a two-stage route (item 81 of his
 * September 2026 list). So for those studies the card is now cut from the
 * page's own table, and the separate set is ignored. The route, the date and
 * the risk are left out because they are not the numbers a reader scans a
 * card for, and a project, or a study not yet on the template, still uses the
 * figures typed for it.
 */
// Bedrooms and communal space are off the cards at Ed's request (30 August
// 2026): a bedroom count and a room size on a card, with the street in the
// address, is enough to identify a live purchase.
const CARD_SKIP = new Set(['planning route', 'date', 'key risk', 'bedrooms', 'communal space', 'communal amenity']);
const cardStats = (n: any): { label: string; value: string }[] => {
  const keyInfo = arr<any>(n.feasibility?.keyInfo)
    .map((k) => ({ label: str(k?.label), value: str(k?.value) }))
    .filter((k) => k.label && k.value && !CARD_SKIP.has(k.label.toLowerCase()));
  if (str(n.kind) !== 'project' && keyInfo.length) return keyInfo.slice(0, 3);
  return arr<any>(n.facts?.stats).map((s) => ({ label: str(s?.label), value: str(s?.value) }));
};

/**
 * "March 2026" as a sortable number, or null when the field is empty or not a
 * month and year. The feasibility listing runs newest first (item 82), and a
 * study with no date cannot be placed, so it goes after every dated one.
 */
const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'];
const monthYear = (s?: string): number | null => {
  const m = /^\s*([A-Za-z]+)\s+(\d{4})\s*$/.exec(s ?? '');
  if (!m) return null;
  const i = MONTHS.indexOf(m[1].toLowerCase());
  return i < 0 ? null : Number(m[2]) * 12 + i;
};

export const getCaseStudies = cache(async (): Promise<CaseStudy[]> => {
  const nodes: any[] = [];
  let after: string | undefined;

  // Tina returns 50 documents at a time. There are 35 today, so this goes round
  // once — but it loops, because being silently truncated here would drop case
  // studies off the listings and out of the sitemap with nothing to notice.
  for (;;) {
    const { data } = await client.queries.caseStudyConnection({ after });
    const connection = data.caseStudyConnection;
    for (const edge of connection?.edges ?? []) {
      if (edge?.node) nodes.push(edge.node);
    }
    if (!connection?.pageInfo?.hasNextPage) break;
    after = connection.pageInfo.endCursor ?? undefined;
  }

  return nodes
    .map((n): CaseStudy => {
      // The filename is the slug; there is no separate field that could disagree
      // with the URL the page is served at.
      const slug = str(n._sys?.filename);

      // Same fallback the detail page uses: a study whose image field is empty
      // shows the picture from code rather than an empty frame. It only bites a
      // document seeded without one, but an image is the whole of a card.
      const fallback = caseStudies.find((c) => c.slug === slug);

      return {
        slug,
        kind: (str(n.kind) === 'project' ? 'project' : 'feasibility') as CaseStudy['kind'],
        title: str(n.title),
        location: str(n.location),
        image: normalizeImage(n.image, fallback?.image ?? ''),
        // Carried, not dropped. The homepage band fits the picture with
        // isDrawing(), which falls back to testing for the '/images/projects/'
        // prefix, and an image an editor uploads lands in '/images/uploads/',
        // fails that test and starts cropping a drawing. The explicit kind is
        // what stops that; see components/case-study/imageFit.ts.
        imageKind: str(n.image?.kind) || undefined,
        tag: str(n.tag),
        desc: str(n.desc),
        buildingType: str(n.buildingType),
        // The grouped paths below are the Create-form regrouping: these fifteen
        // fields moved into listing/facts/writeup/seo so the form opens on the
        // seven things every study needs rather than twenty-five flat ones.
        stats: cardStats(n),
        // normalizeImage unwraps the { src, kind } object itself, so this
        // takes either shape.
        galleryImages: arr<any>(n.galleryImages).map((g) => normalizeImage(g)),
        conversionTypes: arr<string>(n.listing?.conversionTypes) as ConversionType[],
        recommendation: (str(n.listing?.recommendation) || undefined) as CaseStudy['recommendation'],
        status: (str(n.listing?.status) || undefined) as CaseStudy['status'],
        alsoProject: n.listing?.alsoProject === true,
        challenge: str(n.writeup?.challenge) || undefined,
        approach: str(n.writeup?.approach) || undefined,
        outcome: str(n.writeup?.outcome) || undefined,
        floorArea: str(n.floorArea) || undefined,
        planningRoute: str(n.facts?.planningRoute) || undefined,
        completionDate: str(n.facts?.completionDate) || undefined,
        // Carried so the sort below can use it; not part of the rendered card.
        order: num(n.listing?.order, Number.MAX_SAFE_INTEGER),
      } as CaseStudy & { order: number };
    })
    .sort((a, b) => (a as any).order - (b as any).order);
});

/**
 * The Projects list, in the order the listing shows them: every completed
 * project, plus any study flagged to appear here because its scheme has moved
 * on (Axis House, in planning since March 2026).
 */
export const getCompletedProjects = cache(async () =>
  (await getCaseStudies()).filter((c) => c.kind === 'project' || c.alsoProject)
);

/**
 * Feasibility studies, newest first.
 *
 * Item 82: the listing ran on the hand-set `order`, which had a March 2026
 * study first and the four July 2026 studies at eight to eleven. Date decides
 * now; `order` only breaks ties and arranges the studies that have no date,
 * which sit at the end until Ed supplies one.
 */
export const getFeasibilityStudies = cache(async () =>
  (await getCaseStudies())
    .filter((c) => c.kind === 'feasibility')
    .sort((a, b) => {
      const da = monthYear(a.completionDate);
      const db = monthYear(b.completionDate);
      if (da !== null && db !== null && da !== db) return db - da;
      if (da !== null && db === null) return -1;
      if (da === null && db !== null) return 1;
      return (a as any).order - (b as any).order;
    })
);

/**
 * Turn a Tina reference into the slug of the case study it points at.
 *
 * A reference has two shapes depending on where it is read, and both turn up:
 *
 *  - Through the generated client it is a RESOLVED DOCUMENT. Tina inlines the
 *    whole referenced record, including `_sys`, so the slug is `_sys.filename`.
 *    This is the shape every server page sees, and assuming the other one is
 *    why the first version of this silently fell back to the code defaults on
 *    every page — the value was right in the CMS and never reached the page.
 *  - On disk, and in a raw JSON read, it is the PATH string
 *    'content/case-studies/axis-house.json'.
 *
 * The filename is the slug, so both reduce to the same thing.
 */
export const slugFromRef = (ref: unknown): string => {
  if (typeof ref === 'string') return ref.split('/').pop()?.replace(/\.json$/, '') ?? '';
  const sys = (ref as any)?._sys;
  if (sys?.filename) return String(sys.filename);
  // Some shapes carry the path but not _sys.
  const path = (ref as any)?._sys?.relativePath ?? (ref as any)?.id;
  return typeof path === 'string' ? path.split('/').pop()?.replace(/\.json$/, '') ?? '' : '';
};

/** Resolve one reference to its case study. */
export const getCaseStudyByRef = async (ref: unknown): Promise<CaseStudy | undefined> => {
  const slug = slugFromRef(ref);
  if (!slug) return undefined;
  return (await getCaseStudies()).find((c) => c.slug === slug);
};

/** Resolve a list of references, dropping any that no longer point anywhere. */
export const getCaseStudiesByRefs = async (refs: readonly unknown[]): Promise<CaseStudy[]> => {
  const all = await getCaseStudies();
  return refs
    .map((r) => all.find((c) => c.slug === slugFromRef(r)))
    .filter((c): c is CaseStudy => !!c);
};
