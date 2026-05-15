# Conversions Template And Pages — Design Spec

**Date:** 2026-05-15
**Status:** Approved (design), pending spec review
**Scope:** Build the `/conversions/[type]` template and the three initial conversion-type pages. Part of the site build sequence in `docs/superpowers/specs/2026-05-14-thistle-site-architecture-design.md` (build order step 4). These pages carry the SEO load and target the brief's named buyer segments by conversion type.

---

## 1. Context

The Conversions section is the site's SEO and audience-segmentation layer. A search like "office to residential feasibility" should land on a focused page that names the visitor's situation, the specific risks of that conversion type, and how Thistle's feasibility addresses them. One shared template, three data records, three statically pre-rendered pages.

### Pages built in this phase

- `/conversions/commercial-to-residential`
- `/conversions/office-to-resi-class-ma`
- `/conversions/hmo`

Adding a fourth type later is a one-record change — the route generates automatically from `generateStaticParams`.

### Decisions locked during brainstorming

- **One shared template, data-driven.** Zero per-page code duplication. Every conversion page is pixel-identical except for content.
- **Statically pre-rendered.** `generateStaticParams` returns the three slugs at build time. `generateMetadata` derives title and description from the type record so each page has its own SEO metadata.
- **Light page hero**, matching the Feasibility Package page. Dark heroes are used only on How It Works at present.
- **Deliverables source is shared.** The six canonical deliverables live in `data/howItWorksData.ts`. Each conversion record selects a subset (3-4) and provides a short "for this type" line per highlighted deliverable.
- **Case studies are linked by slug.** Each conversion record names one related case study from `data/caseStudiesData.ts`. The component handles the case where the slug does not match.
- **Navbar is updated** to expose the three conversion paths as a dropdown (per the site-architecture IA), replacing the current single link.

---

## 2. Page structure

Top to bottom, identical for all three conversion pages, content differs per type:

1. **Page hero** — light variant `PageHero`. Type-specific label, heading, description. Primary "Start Feasibility" CTA plus a secondary "How it works" link.
2. **The opportunity** — short framing copy plus three stat cards (typical unit yield range, planning route, typical GDV uplift). Sourced from the type record.
3. **What is hard about this conversion** — three to four type-specific challenges as a vertical list with a small severity-style indicator.
4. **How Thistle solves it** — the type-specific subset of the six deliverables. Each highlight card shows the deliverable title and description (from `howItWorksData`) plus a per-type "for this type" line (from the conversion record).
5. **Related case study** — one matching case from `data/caseStudiesData.ts`, looked up by slug. A single feature card with image, tag, title, stats, and a link to the full case.
6. **Closing CTA band** — light, "Start Feasibility".
7. **Shared FAQ** — the existing site `FAQ` section reused. General feasibility questions apply across all conversion types.

---

## 3. Component architecture

**New files:**

| File | Responsibility |
|---|---|
| `data/conversionsData.ts` | The `Conversion` type, three records, and a `getConversion(slug)` lookup. |
| `views/ConversionPage.tsx` | The shared page view. Takes a `Conversion` record, composes the section flow. |
| `src/app/conversions/[type]/page.tsx` | The Next.js dynamic route. Exports `generateStaticParams` (returns the three slugs) and `generateMetadata` (per-type SEO). Renders `ConversionPage`. Calls `notFound()` for unknown slugs. |
| `sections/conversions/Opportunity.tsx` | The opportunity section: short copy plus three stat cards. Pure presentation, takes the copy and stats as props. |
| `sections/conversions/Challenges.tsx` | The three to four type-specific challenges as a vertical list. Takes challenges as a prop. |
| `sections/conversions/HowThistleSolves.tsx` | The "deliverable highlights" section. Reads `deliverables` from `data/howItWorksData.ts`, zips with the per-type highlight subset. |
| `sections/conversions/RelatedCaseStudy.tsx` | A single case-study feature card. Looks up the case by slug in `data/caseStudiesData.ts`. Returns `null` if the slug does not match any case, so the page degrades gracefully. |

**Modified file:**

| File | Change |
|---|---|
| `components/ui/Navbar.tsx` | Add a Conversions dropdown surfacing the three conversion paths. Mirrors the existing hover-link patterns. |

**Reused as-is:** `PageHero`, `Reveal`, `Button`, `InlineCTA`, the shared `FAQ` section, the `useFeasibility` context, the `Footer` (rendered by layout).

### Data shape (locked)

```ts
interface ConversionStat {
  label: string;   // e.g. "Typical unit yield"
  value: string;   // e.g. "8 to 14"
}

interface ConversionChallenge {
  title: string;   // e.g. "Daylight to lower floors"
  detail: string;  // one sentence
}

interface DeliverableHighlight {
  deliverableIndex: number;   // 0..5, index into deliverables in howItWorksData.ts
  forThisType: string;        // one-line type-specific framing
}

interface Conversion {
  slug: string;                // "commercial-to-residential" | "office-to-resi-class-ma" | "hmo"
  label: string;               // "Commercial to Residential"
  heroHeading: string;
  heroDescription: string;
  opportunityCopy: string;
  opportunityStats: ConversionStat[];      // exactly 3
  challenges: ConversionChallenge[];       // 3 or 4
  deliverableHighlights: DeliverableHighlight[];  // 3 or 4
  relatedCaseStudySlug: string;            // matches a slug in caseStudiesData
  metaTitle: string;
  metaDescription: string;
}
```

`getConversion(slug)` returns the matching record or `undefined`. The dynamic route uses this to drive `notFound()` for unknown slugs.

---

## 4. Content rules

All new copy follows `design.md`:
- UK English everywhere.
- No em or en dashes. Number ranges use "to".
- Grade 7 reading level, short paragraphs, plain words.
- Canonical primary CTA: "Start Feasibility".

Specific content drafted at plan-writing time for each of the three conversion records:
- Hero heading and description.
- Opportunity copy plus the three stats.
- Three to four challenges.
- Three to four deliverable highlights (with the matching deliverable index and the per-type framing line).
- Related case-study slug.
- Meta title and description.

Three initial case-study slugs to verify against `data/caseStudiesData.ts` at plan-writing time. If a clean match does not exist for one of the conversion types, the `RelatedCaseStudy` component returns `null` for that type and the page still renders.

---

## 5. SEO

- `generateStaticParams` returns `[{ type: "commercial-to-residential" }, { type: "office-to-resi-class-ma" }, { type: "hmo" }]`, so all three pages are pre-rendered at build time.
- `generateMetadata({ params })` looks up the conversion by slug and returns `{ title, description }` from `metaTitle` and `metaDescription`. Title pattern: "[Type] Feasibility | Thistle Architecture".
- Unknown slugs trigger `notFound()`, returning a 404.

---

## 6. Quality bar

Per `design.md`: every page verified pixel-perfect responsive at mobile-375, tablet-768, laptop-1280, desktop-1440, and desktop-1920 using `scripts/responsive-sweep.mjs`. `document.body.scrollWidth === document.body.clientWidth` at every viewport for all three pages.

Verification: `npx tsc --noEmit`, `npm run build` (confirm all three conversion routes appear), responsive sweep (the sweep tooling's `ROUTES` array gets the three new paths added), and a visual check on screenshots.

---

## 7. Out of scope

- Additional conversion types beyond the initial three (the template supports them by data record only).
- Per-type FAQs (the shared homepage `FAQ` is reused; type-specific FAQs are deferred).
- Programmatic-SEO location pages (a later phase, will reuse this same template pattern).
- Any change to the homepage, Feasibility Package, How It Works, About, or Case Studies pages beyond importing `deliverables`/`caseStudies` data.
