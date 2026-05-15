# Feasibility Package Page — Design Spec

**Date:** 2026-05-15
**Status:** Approved (design), pending spec review
**Scope:** Rebuild of the Feasibility Package page (`/feasibility-package`). Part of the site build sequence in `docs/superpowers/specs/2026-05-14-thistle-site-architecture-design.md` (build order step 3). The site-architecture spec calls this the "money page."

---

## 1. Context

The Feasibility Package page is the spec sheet that closes. Where the homepage convinces a visitor that the product exists and is credible, this page answers the very specific questions someone already interested needs answered before they hit "Start Feasibility": *what exactly do I get, what does it look like, how long does it take, how much does it cost, what happens after, and what is NOT in scope.*

A `views/FeasibilityPackagePage.tsx` already exists but is built on a stale model with a different deliverables list and a tabbed conversion-types structure. It is being rebuilt to this spec.

### Decisions locked during brainstorming

- **Hero variant:** light (homepage hero and How It Works hero are both dark; light here for variety, and the brief explicitly says to avoid heavy dark backgrounds).
- **Pricing:** a "from £X" anchor, with `£1,800` as the placeholder value (industry-norm midpoint for productised feasibility services in this segment). The pricing component is structured so it can graduate to a full tier table later when Edward confirms numbers. The value is flagged in code for confirmation.
- **Deliverables source:** the same six canonical deliverables that the How It Works page uses, sourced from `data/howItWorksData.ts`. Distinct presentation (alternating expanded rows with sample visuals here, compact dark grid on How It Works), same canonical content, so the site's promise cannot drift.
- **Layout:** alternating full-width narrative rows for the six deliverables, matching the visual language of the homepage Feasibility Engine and the How It Works StepRow.

---

## 2. Page structure

Top to bottom:

1. **Page hero** — light variant `PageHero`. Label "Feasibility Package", a heading that frames the page as a fixed-fee productised package, a one-line description, a "Start Feasibility" button, and a secondary "How it works" link.
2. **Pricing anchor band** — a "From £1,800" anchor with the supporting line: "Fixed-fee, scoped before you start, no scope creep." Light band, prominent type.
3. **The six deliverables, expanded** — six alternating full-width rows. Each row carries: a number eyebrow, the deliverable title, the description (carried from `data/howItWorksData.ts`), a "why it matters" line (new), and a small custom sample visual.
4. **Sample report walkthrough** — a small horizontal gallery of three sample report pages (cover, sample plan page, sample financial summary). Each is a styled card that hints at the real artefact and reinforces "this is a document, not a brochure."
5. **Five-day timeline, broken down** — a horizontal band with five entries (Day 1 through Day 5), each showing what happens that day. Expands the homepage hero's compact timeline.
6. **Scope clarity — what is not included** — a short, honest list of items that are not part of the fixed fee (for example: planning submission and drawings, fees beyond the feasibility itself, structural surveys). Critical for a fixed-fee positioning.
7. **Package FAQ** — a package-specific FAQ section. Distinct from the homepage `FAQ` (which is general). Topics: revisions, what happens on a No-Go, VAT, payment terms, turnaround on instructions.
8. **Closing CTA band** — light, with "Start Feasibility".

---

## 3. Component architecture

**Rebuilt:** `views/FeasibilityPackagePage.tsx`. The route file `src/app/feasibility-package/page.tsx` already exists and does not change.

**Reused as-is:** `PageHero`, `Reveal`, `Button`, `InlineCTA`, and the `useFeasibility` context.

**New files in `sections/feasibility-package/`:**

| File | Responsibility |
|---|---|
| `PricingAnchor.tsx` | The "From £X" band. Takes a `priceFrom` prop and an optional `caption`. Structured so a future tier table can replace the simple anchor without touching the page. |
| `DeliverableRow.tsx` | One alternating expanded deliverable row. Props: `deliverable` (`{ title, desc }`), `detail` (`{ why }`), `reversed`, `graphicSlot`, optional `delay`. Mirrors the proven `StepRow` pattern. |
| `deliverableGraphics.tsx` | Six small custom SVG/CSS sample-visuals (one per deliverable), and a key-to-component map `deliverableGraphicMap`. |
| `SampleReport.tsx` | The horizontal three-page gallery. Each page is a styled card. |
| `TimelineBand.tsx` | The horizontal five-day timeline. |
| `ScopeClarity.tsx` | The "not included" list. |
| `PackageFAQ.tsx` | The package-specific accordion FAQ. Same accordion UX as the existing `sections/FAQ.tsx`, different data. |

**New data file:** `data/feasibilityPackageData.ts`

Exports:
- `pricingFrom: string` — the "from" anchor value, flagged for client confirmation.
- `pricingCaption: string` — the supporting line under the price.
- `DeliverableGraphicKey` union type — keys for the six deliverable graphics.
- `deliverableDetail: { why: string; graphic: DeliverableGraphicKey }[]` — six entries, indexed to match `deliverables` in `data/howItWorksData.ts`.
- `sampleReportPages: { label: string; title: string }[]` — three entries.
- `timelineDays: { day: string; label: string; detail: string }[]` — five entries.
- `notIncluded: string[]` — four to five items.
- `packageFaqs: { question: string; answer: string }[]` — six to eight entries.

### Shared data already in place

The page imports `deliverables` from `data/howItWorksData.ts` (the six canonical title-and-description pairs) and zips them by index with `deliverableDetail` from `data/feasibilityPackageData.ts` (the new "why" line plus graphic key). This keeps title and description as the single source of truth in one file while letting the Feasibility Package page add its own presentation copy and graphic without duplicating the canonical content.

---

## 4. Content rules

All new copy follows `design.md`:
- UK English everywhere.
- No em dashes or en dashes; hyphen-minus only; number ranges use "to".
- Grade 7 reading level, short paragraphs, plain words.
- Canonical primary CTA: "Start Feasibility".

Specific content drafted at plan-writing time:
- The six "why it matters" lines (one per deliverable).
- The five timeline-day detail lines.
- The four to five not-included items.
- The six to eight package FAQ Q-and-A pairs.

The pricing placeholder `£1,800` is flagged in `data/feasibilityPackageData.ts` for Edward's confirmation, in the same pattern used elsewhere for unconfirmed values.

---

## 5. Quality bar

Per the site-architecture spec and `design.md`: the page is verified pixel-perfect responsive at mobile-375, tablet-768, laptop-1280, desktop-1440, and desktop-1920 using `scripts/responsive-sweep.mjs`, with `document.body.scrollWidth === document.body.clientWidth` at every viewport.

Verification model matches the rest of the site (no unit-test harness): `npx tsc --noEmit`, `npm run build`, the responsive sweep, and an overflow probe on `/feasibility-package`.

---

## 6. Out of scope

- A full pricing tier table (the spec graduates the simple "from" anchor to a tier table only when Edward confirms numbers).
- Real photography of report pages (the sample report gallery uses styled CSS cards as placeholders; real artefact imagery is a later task).
- Conversion-type tabs (the existing page had these; they belong in the `/conversions/[type]` template, not on this product page).
- Any change to the homepage or the How It Works page beyond importing the shared `deliverables` array.
