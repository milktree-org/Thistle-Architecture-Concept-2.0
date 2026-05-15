# Tools Section — Design Spec

**Date:** 2026-05-15
**Status:** Approved (design), pending spec review
**Scope:** The `/tools` section: an index page plus two interactive tools (Class MA eligibility checker, GDV / viability calculator). Part of the site build sequence in `docs/superpowers/specs/2026-05-14-thistle-site-architecture-design.md` (build order step 5).

---

## 1. Context

Every reference site in the Thistle space (Resi, Searchland, Urbanist, the sister product hmochecker) leads with free tools as the primary lead-gen mechanism. Tools qualify intent and capture leads: a user who completes a Class MA checker is much warmer than a cold visitor.

The tools are not meant to give a final answer. They are meant to:
1. Be useful enough that a developer happily uses them.
2. Surface uncertainty so the natural next step is a full feasibility.
3. Funnel every outcome (positive, negative, or unclear) into "Start Feasibility".

### Tools built in this phase

- **Class MA eligibility checker** at `/tools/class-ma-checker`. A six-question decision-tree screener with a verdict card.
- **GDV / viability quick calculator** at `/tools/gdv-calculator`. A five-input numerical calculator with live-updating outputs and a verdict pill.

A third tool can be added later by dropping in another route file + tool component.

### Decisions locked during brainstorming

- **Two static routes**, one per tool, rather than a single `/tools/[slug]` dynamic route. The tools differ in shape (decision-tree vs calculator), so a data-driven template would not actually share code. Static routes are simpler, have explicit per-page SEO, and avoid the Next.js async-params surprise that bit the Conversions route.
- **Light hero variant** on the index and on both tool pages, matching Feasibility Package and Conversions.
- **Every verdict CTA opens the feasibility modal.** The tools are conversion surfaces, not standalone products. No alternative CTAs.
- **No FAQ on individual tool pages.** They are focused conversion surfaces. The index page can carry an FAQ; the per-tool pages do not, to keep the tool flow tight.
- **Tools is not added to the top nav.** The site-architecture IA already locked the four-item nav (Feasibility Package, How It Works, Case Studies, Conversions). Tools is surfaced via the footer "Product" column.
- **Pure verdict helpers.** The decision logic for each tool lives in pure functions inside its component file — easy to read, predictable to change.

---

## 2. Page structure

### `/tools` (index)

1. **Page hero** — light variant `PageHero`. Label "Free Tools", heading frames the tools as a way to test a building before bidding, description, primary "Start Feasibility" CTA + a secondary "How it works" link.
2. **Tool card grid** — two cards (one per tool). Each card carries an icon, the tool label, a one-line summary, and a "Try it" link to the tool route.
3. **Closing CTA band** — light, "Start Feasibility".

### `/tools/class-ma-checker`

1. **Page hero** — light, "Class MA Eligibility Checker" label, heading, one-line description.
2. **EligibilityChecker** — the interactive section. Six questions stepped through in sequence. State is held in the component. After the sixth answer, a verdict card replaces the question and shows the recommendation, with a "Start Feasibility" button and a "restart" link.
3. **Disclaimer line** — one short paragraph: "This screener is a quick check, not a planning determination. A full feasibility is the final word." (UK English, plain wording.)
4. **Closing CTA band** — light, "Start Feasibility".

### `/tools/gdv-calculator`

1. **Page hero** — light, "GDV & Viability Calculator" label, heading, one-line description.
2. **GDVCalculator** — the interactive section. Five inputs on one side (purchase price, floor area sqm, number of units, average sale per unit, build cost per sqm). Outputs on the other side: projected GDV, total cost, margin in pounds, margin percentage, and a verdict pill. Live-updating as the user types. Sensible UK defaults pre-fill every input.
3. **Disclaimer line** — "Indicative numbers only. A real feasibility models comparables, voids, and risk."
4. **Closing CTA band** — light, "Start Feasibility".

---

## 3. Component architecture

**New files:**

| File | Responsibility |
|---|---|
| `data/toolsData.ts` | `Tool` type, `tools` array (slug, label, summary, icon name, route path), `getToolBySlug` helper. Used by the index card grid and per-tool metadata. |
| `components/ui/ToolShell.tsx` | Shared page shell for any tool page: takes a `tool` record plus a body slot (the tool itself) and renders PageHero + body + closing CTA. |
| `views/ToolsIndexPage.tsx` | The `/tools` index view. Hero, card grid, closing CTA. |
| `views/tools/ClassMACheckerPage.tsx` | Renders `ToolShell` for the Class MA tool with `EligibilityChecker` as the body. |
| `views/tools/GDVCalculatorPage.tsx` | Renders `ToolShell` for the GDV tool with `GDVCalculator` as the body. |
| `sections/tools/EligibilityChecker.tsx` | The interactive Class MA checker: 6-question stepper, verdict card, restart link. Stateful component. Owns the pure `computeVerdict` helper. |
| `sections/tools/GDVCalculator.tsx` | The interactive calculator: 5 inputs, computed outputs, verdict pill. Stateful component. Owns the pure `computeViability` helper. |
| `src/app/tools/page.tsx` | Next.js static route for the index. Exports `metadata`. |
| `src/app/tools/class-ma-checker/page.tsx` | Next.js static route. Exports `metadata`. |
| `src/app/tools/gdv-calculator/page.tsx` | Next.js static route. Exports `metadata`. |

**Reused as-is:** `PageHero`, `Reveal`, `Button`, `InlineCTA`, `useFeasibility`.

**Not touched in this phase:** The Navbar (Tools is footer-only, the four-item top nav stays as-is).

### Data shape

```ts
interface Tool {
  slug: string;            // "class-ma-checker" | "gdv-calculator"
  label: string;           // "Class MA Eligibility Checker"
  summary: string;         // one line for the index card
  iconName: 'ListChecks' | 'Calculator';  // lucide-react icon name
  path: string;            // "/tools/class-ma-checker"
  metaTitle: string;
  metaDescription: string;
}
```

### Verdict logic shape

`EligibilityChecker` owns:

```ts
type EligibilityVerdict = 'eligible' | 'borderline' | 'not-eligible';

function computeVerdict(answers: EligibilityAnswers): EligibilityVerdict
```

A pure function. Hard fails on Q1 / Q4 / Q5 produce `not-eligible`. Any `Unknown` answer produces `borderline`. Otherwise `eligible`.

`GDVCalculator` owns:

```ts
type ViabilityBand = 'marginal' | 'viable' | 'strong';

function computeViability(inputs: ViabilityInputs): {
  gdv: number;
  totalCost: number;
  marginPounds: number;
  marginPct: number;
  band: ViabilityBand;
}
```

A pure function. Bands: under 10% margin → marginal, 10 to 25% → viable, over 25% → strong.

---

## 4. Content rules

All new copy follows `design.md`:
- UK English everywhere.
- No em or en dashes. Number ranges use "to".
- Grade 7 reading level.
- Canonical CTA: "Start Feasibility".

Specific content drafted at plan-writing time:
- The 6 Class MA questions, their answer options, and the three verdict-card body copies.
- The 5 GDV inputs (label, default value), the verdict-band copy, and the disclaimer.
- The hero headings/descriptions for the index and the two tool pages.
- Meta titles and descriptions for all three routes.

---

## 5. SEO

Each of the three routes is statically generated (no dynamic params). Each route file exports its own `metadata` constant with `title` and `description`. Title pattern: "[Tool name] | Thistle Architecture".

---

## 6. Quality bar

Per `design.md`: every page is verified pixel-perfect responsive at mobile-375, tablet-768, laptop-1280, desktop-1440, and desktop-1920 using `scripts/responsive-sweep.mjs`, with `document.body.scrollWidth === document.body.clientWidth` at every viewport. The sweep's `ROUTES` array gets the three new tool paths added.

Verification: `npx tsc --noEmit`, `npm run build` (confirm all three routes appear), responsive sweep, body-overflow probes on each route, manual interaction check on dev (step through the checker; type into the calculator and watch outputs update).

---

## 7. Out of scope

- A third tool. The structure supports adding one easily; not building it here.
- A real planning database lookup (e.g. live Article 4 status by postcode). The checker is a self-attest screener.
- Persisting tool results to a backend or capturing email for the result. The verdict is shown inline; if the user wants more, they click "Start Feasibility".
- A homepage banner linking to the new tools. Surfacing changes are a separate small follow-up.
- Any change to the Navbar, the homepage, or any other page.
