# Feasibility Package Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Feasibility Package page (`/feasibility-package`) as the spec sheet that closes — pricing anchor, expanded deliverables, sample report walkthrough, five-day timeline, scope clarity, and a package-specific FAQ.

**Architecture:** A new `views/FeasibilityPackagePage.tsx` composes a set of focused presentation sections under `sections/feasibility-package/`. The six canonical deliverables are imported from `data/howItWorksData.ts` (single source of truth) and enriched with a "why it matters" line plus a sample-visual graphic per deliverable, sourced from `data/feasibilityPackageData.ts`. All other content (price, sample report pages, timeline, not-included items, package FAQs) lives in the same data file.

**Tech Stack:** Next.js 16 App Router, React 18, TypeScript, Tailwind CSS v3.4, framer-motion v11, lucide-react.

**Verification model:** No unit-test harness. Per task: `npx tsc --noEmit`. For the final task: also `npm run build`, the responsive sweep, and an overflow probe on `/feasibility-package`.

---

## File Structure

| File | Responsibility |
|---|---|
| `data/feasibilityPackageData.ts` (create) | Types + content for the page: pricing, deliverable detail, sample-report pages, timeline, not-included items, package FAQs. |
| `sections/feasibility-package/PricingAnchor.tsx` (create) | The "From £X" anchor band. |
| `sections/feasibility-package/DeliverableRow.tsx` (create) | One alternating expanded deliverable row, reused six times. |
| `sections/feasibility-package/deliverableGraphics.tsx` (create) | Six small custom sample-visuals + key-to-component map. |
| `sections/feasibility-package/SampleReport.tsx` (create) | Horizontal three-page gallery of sample report pages. |
| `sections/feasibility-package/TimelineBand.tsx` (create) | Horizontal five-day timeline band. |
| `sections/feasibility-package/ScopeClarity.tsx` (create) | "What's not included" list section. |
| `sections/feasibility-package/PackageFAQ.tsx` (create) | Package-specific accordion FAQ. |
| `views/FeasibilityPackagePage.tsx` (modify, full rewrite) | The page. Composes everything. |

---

## Task 1: Content data file

**Files:**
- Create: `data/feasibilityPackageData.ts`

- [ ] **Step 1: Create `data/feasibilityPackageData.ts`**

Create the file with EXACTLY this content:

```ts
export type DeliverableGraphicKey =
  | 'ga-plans'
  | 'schedule'
  | 'constraints'
  | 'risk-register'
  | 'go-nogo'
  | 'efficiency';

export interface DeliverableDetail {
  why: string;
  graphic: DeliverableGraphicKey;
}

export interface SampleReportPage {
  label: string;
  title: string;
}

export interface TimelineDay {
  day: string;
  label: string;
  detail: string;
}

export interface PackageFaq {
  question: string;
  answer: string;
}

// "From £X" anchor. Flagged for confirmation with the client.
export const pricingFrom = "£1,800";
export const pricingCaption = "Fixed fee, scoped before you start. No hourly rates, no scope creep.";

// Indexed to match the deliverables array in data/howItWorksData.ts.
export const deliverableDetail: DeliverableDetail[] = [
  {
    why: "So you can show a buyer, a lender, or a JV partner what the building actually becomes. Real layouts, not napkin sketches.",
    graphic: "ga-plans",
  },
  {
    why: "The single document a QS, a valuer, or a planning officer asks for first. You will not be chasing it from a separate consultant.",
    graphic: "schedule",
  },
  {
    why: "We surface the planning risks that quietly kill schemes before you have spent money on a pre-app or a survey.",
    graphic: "constraints",
  },
  {
    why: "Every risk is named, sized, and assigned a cost. You go into the deal with eyes open, not optimism.",
    graphic: "risk-register",
  },
  {
    why: "A clear answer. We will tell you to walk away if the numbers do not stack up, even if you wanted a Go.",
    graphic: "go-nogo",
  },
  {
    why: "How tight the layout is, how the GDV compares to local sales, and whether the margin is real or marginal.",
    graphic: "efficiency",
  },
];

export const sampleReportPages: SampleReportPage[] = [
  { label: "Page 01", title: "Executive summary and recommendation" },
  { label: "Page 02", title: "Layout options and accommodation schedule" },
  { label: "Page 03", title: "Financial appraisal and risk register" },
];

export const timelineDays: TimelineDay[] = [
  { day: "Day 1", label: "Submit your details", detail: "Upload the address and basic building information. The desk study starts running the moment you submit." },
  { day: "Day 2", label: "Automated desk study", detail: "Our data engine cross-references planning history, constraints, density data, and comparable schemes." },
  { day: "Day 3", label: "Call with Jodi", detail: "A focused call with our property expert. We confirm what the data engine found and capture anything specific to your plans." },
  { day: "Day 4", label: "Architect-led sketch scheme", detail: "An architect tests the building physically, sketches the optimal unit layout, and pressure-tests the numbers." },
  { day: "Day 5", label: "Feasibility review", detail: "We meet on video, walk through the full report, and you leave with a clear Go or No-Go." },
];

export const notIncluded: string[] = [
  "Planning application submission and full planning drawings.",
  "Structural engineering surveys, party wall, or measured surveys.",
  "Pre-application meetings with the local authority.",
  "Detailed design or construction-stage architectural services.",
  "Specialist reports such as daylight, transport, or ecology.",
];

export const packageFaqs: PackageFaq[] = [
  {
    question: "Is the fee really fixed?",
    answer: "Yes. The price you see is the price you pay, regardless of how the analysis unfolds. We absorb the cost if a deliverable takes longer than expected.",
  },
  {
    question: "What if the recommendation is No-Go?",
    answer: "You still receive the full report, the risk register, and the reasoning. You will know exactly why the scheme does not stack up and what would need to change. The fee is the same either way.",
  },
  {
    question: "Do you charge VAT?",
    answer: "Yes. The headline price is exclusive of VAT, charged at the prevailing rate where applicable. UK-registered businesses can normally reclaim it.",
  },
  {
    question: "How quickly can you start?",
    answer: "We aim to start the day you instruct us. The five-day clock begins on the first working day after submission.",
  },
  {
    question: "Are revisions included?",
    answer: "One round of layout revisions is included if the architect-led stage surfaces options worth comparing. Beyond that we agree a fixed fee for further iteration.",
  },
  {
    question: "What if my building is more complex than the package assumes?",
    answer: "If the desk study flags genuine complexity, we will pause and agree a revised scope and fee with you before continuing. No surprises mid-feasibility.",
  },
  {
    question: "Can the report be used to apply for funding?",
    answer: "Yes. Reports include GDV projections, accommodation schedules, and a risk register, all structured to support lender, investor, and JV partner conversations.",
  },
  {
    question: "What happens after a Go recommendation?",
    answer: "You receive a fee proposal for the full project and a clear programme showing exactly what happens next. There is no obligation to proceed with us.",
  },
];
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (passes).

- [ ] **Step 3: Commit**

```bash
git add data/feasibilityPackageData.ts
git commit -m "feat: add Feasibility Package page content data"
```

---

## Task 2: PricingAnchor component

**Files:**
- Create: `sections/feasibility-package/PricingAnchor.tsx` (also creates the `sections/feasibility-package/` directory)

- [ ] **Step 1: Create the directory and `sections/feasibility-package/PricingAnchor.tsx`**

Create the file with EXACTLY this content:

```tsx
"use client";

import React from 'react';
import { Reveal } from '../../components/animations/Reveal';

interface PricingAnchorProps {
  priceFrom: string;
  caption: string;
}

// "From £X" anchor band. Structured so a future tier table can replace the
// simple anchor by swapping this component out, with no change to the page.
export const PricingAnchor: React.FC<PricingAnchorProps> = ({ priceFrom, caption }) => (
  <section className="bg-thistle-white py-fl-section-sm px-fl-margin border-y border-thistle-black/[0.06]">
    <div className="max-w-[1360px] mx-auto text-center">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-3">From</p>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-fluid-display font-medium tracking-tighter text-thistle-black leading-none mb-fl-4">
          {priceFrom}
        </p>
      </Reveal>
      <Reveal delay={0.15}>
        <p className="text-fluid-base text-thistle-black/70 max-w-md mx-auto leading-relaxed">
          {caption}
        </p>
      </Reveal>
    </div>
  </section>
);
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (passes).

- [ ] **Step 3: Commit**

```bash
git add sections/feasibility-package/PricingAnchor.tsx
git commit -m "feat: add Feasibility Package PricingAnchor"
```

---

## Task 3: DeliverableRow component

**Files:**
- Create: `sections/feasibility-package/DeliverableRow.tsx`

- [ ] **Step 1: Create `sections/feasibility-package/DeliverableRow.tsx`**

Create the file with EXACTLY this content:

```tsx
"use client";

import React from 'react';
import { Reveal } from '../../components/animations/Reveal';
import type { Deliverable } from '../../data/howItWorksData';
import type { DeliverableDetail } from '../../data/feasibilityPackageData';

interface DeliverableRowProps {
  num: string;
  deliverable: Deliverable;
  detail: DeliverableDetail;
  reversed: boolean;
  graphicSlot: React.ReactNode;
  delay?: number;
}

// One alternating expanded deliverable row. Mirrors the homepage Feasibility
// Engine and How It Works StepRow patterns: content on one side, sample
// visual on the other, sides swapping at the lg breakpoint when reversed.
export const DeliverableRow: React.FC<DeliverableRowProps> = ({ num, deliverable, detail, reversed, graphicSlot, delay = 0 }) => (
  <Reveal delay={delay}>
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-fl-8 items-center ${reversed ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <div className={reversed ? 'lg:pl-fl-5' : ''}>
        <span className="text-[11px] uppercase tracking-[0.2em] text-thistle-green font-semibold">
          Deliverable {num}
        </span>
        <h3 className="text-fluid-h3 font-medium tracking-tight leading-tight text-thistle-black mt-fl-3 mb-fl-4">
          {deliverable.title}
        </h3>
        <p className="text-fluid-base text-thistle-black/80 leading-relaxed max-w-md mb-fl-4">
          {deliverable.desc}
        </p>
        <p className="text-fluid-sm text-thistle-black/55 leading-relaxed max-w-md">
          {detail.why}
        </p>
      </div>
      <div className={`w-full ${reversed ? '' : 'lg:order-2'}`}>
        {graphicSlot}
      </div>
    </div>
  </Reveal>
);
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (passes).

- [ ] **Step 3: Commit**

```bash
git add sections/feasibility-package/DeliverableRow.tsx
git commit -m "feat: add Feasibility Package DeliverableRow"
```

---

## Task 4: Deliverable sample-visual graphics

**Files:**
- Create: `sections/feasibility-package/deliverableGraphics.tsx`

- [ ] **Step 1: Create `sections/feasibility-package/deliverableGraphics.tsx`**

Create the file with EXACTLY this content:

```tsx
"use client";

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { DeliverableGraphicKey } from '../../data/feasibilityPackageData';

// ─── Wrapper card for consistent sizing ──────────
const Card: React.FC<{ label: string; meta?: string; children: React.ReactNode }> = ({ label, meta, children }) => (
  <div className="aspect-square w-full bg-white rounded-2xl border border-thistle-black/[0.06] shadow-sm shadow-thistle-black/[0.03] p-fl-6 flex flex-col">
    <div className="flex items-center justify-between mb-fl-4">
      <span className="text-[10px] uppercase tracking-wider text-thistle-black/40 font-semibold">{label}</span>
      {meta && <span className="text-[10px] text-thistle-green font-medium">{meta}</span>}
    </div>
    <div className="flex-1 flex flex-col justify-center">{children}</div>
  </div>
);

// ─── GA Floor Plans: mini floor plan with 4 unit rectangles ──────────
const gaUnits = [
  { x: 14, w: 88, type: "1B" },
  { x: 106, w: 88, type: "2B" },
  { x: 198, w: 88, type: "1B" },
];

export const GAPlansGraphic: React.FC = () => (
  <Card label="GA floor plan" meta="Level 1">
    <svg viewBox="0 0 300 180" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <rect x="8" y="8" width="284" height="164" fill="white" stroke="#2F3B36" strokeWidth="1.5" rx="3" />
      <rect x="14" y="82" width="272" height="16" fill="#F5F4EF" stroke="#2F3B36" strokeOpacity="0.25" strokeWidth="0.4" />
      <text x="150" y="93" textAnchor="middle" fontSize="7" fill="#71776E" fontFamily="sans-serif" letterSpacing="0.5">CORRIDOR</text>
      {gaUnits.map((u, i) => (
        <g key={`t${i}`}>
          <rect x={u.x} y="14" width={u.w} height="66" fill="#8F9952" fillOpacity="0.18" stroke="#8F9952" strokeWidth="0.8" />
          <text x={u.x + u.w / 2} y="50" textAnchor="middle" fontSize="10" fill="#2F3B36" fontFamily="sans-serif">{u.type}</text>
        </g>
      ))}
      {gaUnits.map((u, i) => (
        <g key={`b${i}`}>
          <rect x={u.x} y="102" width={u.w} height="66" fill="#8F9952" fillOpacity="0.18" stroke="#8F9952" strokeWidth="0.8" />
          <text x={u.x + u.w / 2} y="138" textAnchor="middle" fontSize="10" fill="#2F3B36" fontFamily="sans-serif">{u.type}</text>
        </g>
      ))}
    </svg>
  </Card>
);

// ─── Schedule of Accommodation: small table ──────────
const scheduleRows = [
  { unit: "1.01", type: "1B", gia: "48 sqm" },
  { unit: "1.02", type: "2B", gia: "70 sqm" },
  { unit: "1.03", type: "1B", gia: "50 sqm" },
  { unit: "1.04", type: "2B", gia: "72 sqm" },
];

export const ScheduleGraphic: React.FC = () => (
  <Card label="Accommodation schedule" meta="NDSS compliant">
    <div className="rounded-lg overflow-hidden border border-thistle-black/[0.06]">
      <div className="grid grid-cols-3 px-3 py-2 bg-thistle-white/60 border-b border-thistle-black/[0.06]">
        <span className="text-[9px] uppercase tracking-wider text-thistle-black/40 font-semibold">Unit</span>
        <span className="text-[9px] uppercase tracking-wider text-thistle-black/40 font-semibold">Type</span>
        <span className="text-[9px] uppercase tracking-wider text-thistle-black/40 font-semibold text-right">GIA</span>
      </div>
      {scheduleRows.map((row, i) => (
        <div key={i} className={`grid grid-cols-3 px-3 py-2 text-xs ${i < scheduleRows.length - 1 ? 'border-b border-thistle-black/[0.04]' : ''}`}>
          <span className="text-thistle-black/70 font-mono">{row.unit}</span>
          <span className="text-thistle-black/70">{row.type}</span>
          <span className="text-thistle-black/70 text-right">{row.gia}</span>
        </div>
      ))}
    </div>
  </Card>
);

// ─── Constraints Analysis: mini constraints map ──────────
export const ConstraintsGraphic: React.FC = () => (
  <Card label="Constraints map" meta="3 flagged">
    <svg viewBox="0 0 300 180" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <path d="M 20 40 L 80 20 L 180 28 L 260 50 L 280 110 L 240 160 L 140 168 L 50 152 L 20 100 Z" fill="#F5F4EF" stroke="#2F3B36" strokeWidth="1" strokeOpacity="0.3" />
      <path d="M 60 60 L 130 50 L 150 100 L 100 130 L 60 110 Z" fill="#DAAEBB" fillOpacity="0.35" stroke="#DAAEBB" strokeWidth="1.2" strokeDasharray="4 3" />
      <path d="M 170 70 L 240 80 L 250 140 L 190 150 L 170 110 Z" fill="#8F9952" fillOpacity="0.25" stroke="#8F9952" strokeWidth="1.2" strokeDasharray="4 3" />
      <circle cx="140" cy="100" r="7" fill="#2F3B36" />
      <circle cx="140" cy="100" r="2.5" fill="white" />
      <text x="80" y="90" fontSize="9" fill="#2F3B36" fontFamily="sans-serif" opacity="0.65">Article 4</text>
      <text x="195" y="115" fontSize="9" fill="#2F3B36" fontFamily="sans-serif" opacity="0.65">Conservation</text>
    </svg>
  </Card>
);

// ─── Risk Register: list of 3 rows with severity indicators ──────────
const riskRows = [
  { name: "Daylight to lower units", severity: "med", cost: "£8k" },
  { name: "Class MA prior approval", severity: "low", cost: "£0" },
  { name: "Structural intervention floor 1", severity: "high", cost: "£42k" },
];
const severityColour = (s: string) => s === 'high' ? 'bg-red-400' : s === 'med' ? 'bg-amber-400' : 'bg-thistle-green';

export const RiskRegisterGraphic: React.FC = () => (
  <Card label="Risk register" meta="3 of 11">
    <div className="space-y-fl-3">
      {riskRows.map((row, i) => (
        <div key={i} className="flex items-center justify-between gap-fl-3 py-fl-2 border-b border-thistle-black/[0.06] last:border-b-0">
          <span className={`w-2 h-2 rounded-full ${severityColour(row.severity)} flex-shrink-0`} />
          <span className="flex-1 text-xs text-thistle-black/70 leading-snug">{row.name}</span>
          <span className="text-xs font-semibold text-thistle-black tabular-nums">{row.cost}</span>
        </div>
      ))}
    </div>
  </Card>
);

// ─── Go/No-Go Recommendation: a green "GO" stamp ──────────
export const GoNoGoGraphic: React.FC = () => (
  <Card label="Recommendation">
    <div className="flex-1 flex items-center justify-center">
      <div className="relative">
        <div className="w-36 h-36 rounded-full border-[6px] border-thistle-green flex flex-col items-center justify-center bg-thistle-green/[0.05] rotate-[-8deg]">
          <span className="text-3xl font-bold tracking-tight text-thistle-green leading-none">GO</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-thistle-green font-semibold mt-1">Approved</span>
        </div>
        <div className="absolute -bottom-2 right-2 flex items-center gap-1.5 bg-white rounded-full px-2 py-1 border border-thistle-black/[0.06] shadow-sm">
          <CheckCircle2 size={12} className="text-thistle-green" />
          <span className="text-[9px] uppercase tracking-wider text-thistle-black/60 font-semibold">Architect signed</span>
        </div>
      </div>
    </div>
  </Card>
);

// ─── Efficiency Metrics: net-to-gross + a small bar ──────────
export const EfficiencyGraphic: React.FC = () => (
  <Card label="Efficiency" meta="+24% margin">
    <div className="space-y-fl-4">
      <div>
        <div className="flex items-end justify-between mb-fl-2">
          <span className="text-[10px] uppercase tracking-wider text-thistle-black/40 font-semibold">Net-to-gross</span>
          <span className="text-fluid-h4 font-medium tracking-tight text-thistle-black leading-none">84%</span>
        </div>
        <div className="h-2 bg-thistle-black/[0.05] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-thistle-green" style={{ width: '84%' }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-fl-3 pt-fl-3 border-t border-thistle-black/[0.06]">
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-thistle-black/40 font-semibold">Projected GDV</span>
          <span className="text-sm font-semibold text-thistle-black">£3.2M</span>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-thistle-black/40 font-semibold">Margin</span>
          <span className="text-sm font-semibold text-thistle-green">+24%</span>
        </div>
      </div>
    </div>
  </Card>
);

// ─── Key-to-component map used by the page ──────────
export const deliverableGraphicMap: Record<DeliverableGraphicKey, React.FC> = {
  'ga-plans': GAPlansGraphic,
  schedule: ScheduleGraphic,
  constraints: ConstraintsGraphic,
  'risk-register': RiskRegisterGraphic,
  'go-nogo': GoNoGoGraphic,
  efficiency: EfficiencyGraphic,
};
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (passes).

- [ ] **Step 3: Commit**

```bash
git add sections/feasibility-package/deliverableGraphics.tsx
git commit -m "feat: add Feasibility Package deliverable graphics"
```

---

## Task 5: SampleReport, TimelineBand, ScopeClarity

**Files:**
- Create: `sections/feasibility-package/SampleReport.tsx`
- Create: `sections/feasibility-package/TimelineBand.tsx`
- Create: `sections/feasibility-package/ScopeClarity.tsx`

- [ ] **Step 1: Create `sections/feasibility-package/SampleReport.tsx`**

Create the file with EXACTLY this content:

```tsx
"use client";

import React from 'react';
import { Reveal } from '../../components/animations/Reveal';
import { sampleReportPages } from '../../data/feasibilityPackageData';

// A horizontal three-page gallery suggesting the real report artefact.
// Each "page" is a styled card with a faint content-line mock inside.
export const SampleReport: React.FC = () => (
  <section className="bg-thistle-white py-fl-section px-fl-margin">
    <div className="max-w-[1360px] mx-auto">
      <div className="text-center mb-fl-8 max-w-2xl mx-auto">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">What The Report Looks Like</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
            A Real Document.<br /><span className="text-thistle-green">Not A Brochure.</span>
          </h2>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-fl-5">
        {sampleReportPages.map((page, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="aspect-[3/4] bg-white rounded-2xl border border-thistle-black/[0.06] p-fl-5 flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-thistle-green font-semibold">{page.label}</span>
              <h3 className="text-fluid-h6 font-medium tracking-tight text-thistle-black mt-fl-2 mb-fl-5">{page.title}</h3>
              <div className="flex-1 bg-thistle-white/50 rounded-lg p-fl-4 flex flex-col">
                <div className="h-2 w-1/3 bg-thistle-black/20 rounded mb-fl-3" />
                <div className="space-y-2 mb-fl-4">
                  <div className="h-1.5 bg-thistle-black/[0.12] rounded" />
                  <div className="h-1.5 bg-thistle-black/[0.12] rounded w-5/6" />
                  <div className="h-1.5 bg-thistle-black/[0.12] rounded w-4/6" />
                </div>
                <div className="h-2 w-1/4 bg-thistle-black/20 rounded mb-fl-3" />
                <div className="space-y-2">
                  <div className="h-1.5 bg-thistle-black/[0.12] rounded w-5/6" />
                  <div className="h-1.5 bg-thistle-black/[0.12] rounded w-3/6" />
                </div>
                <div className="mt-auto flex items-center justify-between pt-fl-3 border-t border-thistle-black/[0.08]">
                  <span className="text-[9px] uppercase tracking-wider text-thistle-black/30 font-semibold">Thistle Architecture</span>
                  <span className="text-[9px] text-thistle-black/30">{page.label.replace('Page ', 'p.')}</span>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
```

- [ ] **Step 2: Create `sections/feasibility-package/TimelineBand.tsx`**

Create the file with EXACTLY this content:

```tsx
"use client";

import React from 'react';
import { Reveal } from '../../components/animations/Reveal';
import { timelineDays } from '../../data/feasibilityPackageData';

// Horizontal five-day timeline. On mobile each day stacks vertically; at md+
// they sit in a five-column row with a faint connector line behind the dots.
export const TimelineBand: React.FC = () => (
  <section className="bg-white py-fl-section px-fl-margin">
    <div className="max-w-[1360px] mx-auto">
      <div className="text-center mb-fl-8 max-w-2xl mx-auto">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">The Five Days</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
            Submit Monday.<br /><span className="text-thistle-green">Decide Friday.</span>
          </h2>
        </Reveal>
      </div>

      <div className="relative">
        <div className="hidden md:block absolute top-5 left-[10%] right-[10%] h-px bg-thistle-black/[0.1]" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-fl-5 relative">
          {timelineDays.map((day, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="flex flex-col items-center text-center px-fl-3">
                <div className="w-10 h-10 rounded-full bg-thistle-green text-white flex items-center justify-center text-sm font-semibold mb-fl-4 relative z-10">
                  {i + 1}
                </div>
                <span className="block text-[10px] uppercase tracking-widest text-thistle-green font-semibold mb-fl-2">{day.day}</span>
                <h4 className="text-fluid-h6 font-medium tracking-tight text-thistle-black mb-fl-2">{day.label}</h4>
                <p className="text-fluid-sm text-thistle-black/60 leading-relaxed">{day.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);
```

- [ ] **Step 3: Create `sections/feasibility-package/ScopeClarity.tsx`**

Create the file with EXACTLY this content:

```tsx
"use client";

import React from 'react';
import { X } from 'lucide-react';
import { Reveal } from '../../components/animations/Reveal';
import { notIncluded } from '../../data/feasibilityPackageData';

// The "what is not included" list. Sets honest expectations on a fixed-fee
// productised package: items outside the scope are named plainly.
export const ScopeClarity: React.FC = () => (
  <section className="bg-thistle-white py-fl-section px-fl-margin">
    <div className="max-w-[1000px] mx-auto">
      <div className="text-center mb-fl-8 max-w-2xl mx-auto">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">Scope</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-4">
            What&apos;s Not Included.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-fluid-base text-thistle-black/70 leading-relaxed">
            Honest scope from the start. These items sit outside the fixed feasibility fee. We can quote separately if any are needed.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <ul className="rounded-2xl border border-thistle-black/[0.06] bg-white overflow-hidden">
          {notIncluded.map((item, i) => (
            <li key={i} className={`flex items-start gap-fl-4 px-fl-5 py-fl-4 ${i < notIncluded.length - 1 ? 'border-b border-thistle-black/[0.06]' : ''}`}>
              <div className="w-6 h-6 rounded-full bg-thistle-black/[0.05] flex items-center justify-center flex-shrink-0 mt-0.5">
                <X size={12} className="text-thistle-black/40" />
              </div>
              <span className="text-fluid-base text-thistle-black/80 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  </section>
);
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (passes).

- [ ] **Step 5: Commit**

```bash
git add sections/feasibility-package/SampleReport.tsx sections/feasibility-package/TimelineBand.tsx sections/feasibility-package/ScopeClarity.tsx
git commit -m "feat: add Feasibility Package presentation sections"
```

---

## Task 6: PackageFAQ component

**Files:**
- Create: `sections/feasibility-package/PackageFAQ.tsx`

- [ ] **Step 1: Create `sections/feasibility-package/PackageFAQ.tsx`**

Create the file with EXACTLY this content. This mirrors the accordion behaviour of `sections/FAQ.tsx` but uses package-specific data and a slightly different header copy.

```tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../../components/animations/Reveal';
import { Button } from '../../components/ui/Button';
import { useFeasibility } from '../../components/feasibility/FeasibilityContext';
import { packageFaqs } from '../../data/feasibilityPackageData';

// Package-specific accordion FAQ. Same UX as the general site FAQ, different
// content focused on the package itself (fee, revisions, VAT, scope changes).
export const PackageFAQ: React.FC = () => {
  const { openModal } = useFeasibility();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-fl-section px-fl-margin bg-thistle-white">
      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-fl-8">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-thistle-black/40 font-semibold mb-fl-5">Package FAQs</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-5">
                The Practical Questions.
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-fluid-base text-thistle-black/80 leading-relaxed mb-fl-6 max-w-sm">
                Fee, scope, VAT, what happens on a No-Go. The things that matter once you are ready to instruct.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Button variant="primary" icon={<ArrowUpRight size={16} />} onClick={openModal}>
                Start Feasibility
              </Button>
            </Reveal>
          </div>

          <div className="flex flex-col gap-fl-3">
            {packageFaqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div
                  className={`rounded-xl border transition-colors duration-300 ${
                    openIndex === i
                      ? 'border-thistle-black/[0.1] bg-white'
                      : 'border-thistle-black/[0.06] bg-transparent hover:border-thistle-black/[0.1]'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                    className="w-full flex items-center justify-between gap-fl-4 px-fl-5 py-fl-4 text-left group"
                  >
                    <span className={`text-fluid-sm font-medium tracking-tight transition-colors duration-300 ${
                      openIndex === i ? 'text-thistle-black' : 'text-thistle-black/70 group-hover:text-thistle-black'
                    }`}>
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === i ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                        openIndex === i
                          ? 'bg-thistle-black text-white'
                          : 'bg-thistle-black/[0.05] text-thistle-black/40'
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-fluid-base text-thistle-black/80 leading-relaxed px-fl-5 pb-fl-4">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (passes).

- [ ] **Step 3: Commit**

```bash
git add sections/feasibility-package/PackageFAQ.tsx
git commit -m "feat: add Feasibility Package PackageFAQ"
```

---

## Task 7: Rebuild the Feasibility Package page

**Files:**
- Modify: `views/FeasibilityPackagePage.tsx` (full rewrite)

- [ ] **Step 1: Replace the entire contents of `views/FeasibilityPackagePage.tsx`**

Replace the entire file with EXACTLY this content:

```tsx
"use client";

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/animations/Reveal';
import { Button } from '../components/ui/Button';
import { useFeasibility } from '../components/feasibility/FeasibilityContext';
import { deliverables } from '../data/howItWorksData';
import {
  pricingFrom,
  pricingCaption,
  deliverableDetail,
} from '../data/feasibilityPackageData';
import { PricingAnchor } from '../sections/feasibility-package/PricingAnchor';
import { DeliverableRow } from '../sections/feasibility-package/DeliverableRow';
import { deliverableGraphicMap } from '../sections/feasibility-package/deliverableGraphics';
import { SampleReport } from '../sections/feasibility-package/SampleReport';
import { TimelineBand } from '../sections/feasibility-package/TimelineBand';
import { ScopeClarity } from '../sections/feasibility-package/ScopeClarity';
import { PackageFAQ } from '../sections/feasibility-package/PackageFAQ';

export const FeasibilityPackagePage: React.FC = () => {
  const { openModal } = useFeasibility();

  return (
    <>
      <PageHero
        label="Feasibility Package"
        heading="Everything In Five Days, For A Fixed Fee."
        description="One package. One price. One clear Go or No-Go on whether your building is worth taking forward."
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-fl-4">
          <Button variant="primary" icon={<ArrowUpRight size={16} />} onClick={openModal}>
            Start Feasibility
          </Button>
          <Link href="/how-it-works" className="text-sm text-thistle-black/70 hover:text-thistle-black transition-colors font-medium tracking-tight">
            How it works &rarr;
          </Link>
        </div>
      </PageHero>

      <PricingAnchor priceFrom={pricingFrom} caption={pricingCaption} />

      {/* The six deliverables, expanded */}
      <section className="bg-white py-fl-section px-fl-margin">
        <div className="max-w-[1360px] mx-auto">
          <div className="text-center mb-fl-section-sm max-w-2xl mx-auto">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">What You Get</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
                Six Deliverables.<br /><span className="text-thistle-green">One Decision.</span>
              </h2>
            </Reveal>
          </div>

          <div className="space-y-fl-section-sm">
            {deliverables.map((deliverable, i) => {
              const detail = deliverableDetail[i];
              const Graphic = deliverableGraphicMap[detail.graphic];
              const num = String(i + 1).padStart(2, '0');
              return (
                <DeliverableRow
                  key={num}
                  num={num}
                  deliverable={deliverable}
                  detail={detail}
                  reversed={i % 2 !== 0}
                  graphicSlot={<Graphic />}
                />
              );
            })}
          </div>
        </div>
      </section>

      <SampleReport />

      <TimelineBand />

      <ScopeClarity />

      {/* Closing CTA */}
      <section className="py-fl-section px-fl-margin bg-white">
        <div className="max-w-[1360px] mx-auto text-center">
          <Reveal>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-5">
              Ready When You Are.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-fluid-base text-thistle-black/80 leading-relaxed max-w-md mx-auto mb-fl-6">
              Submit your building, get a clear answer in five days, for a fixed fee.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Button variant="primary" size="lg" icon={<ArrowUpRight size={18} />} onClick={openModal}>
              Start Feasibility
            </Button>
          </Reveal>
        </div>
      </section>

      <PackageFAQ />
    </>
  );
};
```

- [ ] **Step 2: Type-check and build**

Run: `npx tsc --noEmit`
Expected: no output (passes).

Run: `npm run build`
Expected: build completes successfully, route list includes `/feasibility-package`.

- [ ] **Step 3: Responsive verification**

Start the dev server in the background: `npm run dev` and wait until it reports ready on `http://localhost:3000`.

Run: `npm run sweep`
Expected: the sweep logs `OK <viewport> feasibility-package` for all five viewports, and `screenshots/<viewport>/feasibility-package-top.png`, `-mid.png`, `-deep.png` exist for each.

Run: `RESPONSIVE_ORIGIN=http://localhost:3000 ROUTE=/feasibility-package npm run probe`
Expected: each viewport line shows `bodyScrollW` equal to `bodyClientW` (no real horizontal overflow). The decorative `absolute pointer-events-none` blur circles flagged by `find-overflow` are the known false-positive pattern documented in the foundation phase, only acceptable as long as the body-scroll equality holds.

Open `screenshots/mobile-375/feasibility-package-top.png`, `screenshots/mobile-375/feasibility-package-mid.png`, and `screenshots/desktop-1440/feasibility-package-mid.png` and confirm: the hero renders, the price anchor is prominent, the deliverable rows alternate at desktop and stack at mobile, the sample-report cards render in three columns at desktop, the five-day timeline reads cleanly, the scope list looks honest, and the package FAQ accordion opens to the first question.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add views/FeasibilityPackagePage.tsx
git commit -m "feat: rebuild Feasibility Package page as fixed-fee spec sheet"
```

---

## Self-Review

**Spec coverage:** Checked against `docs/superpowers/specs/2026-05-15-feasibility-package-page-design.md`.
- §2 page structure (hero, pricing anchor, six expanded deliverables, sample report, five-day timeline, scope clarity, package FAQ, closing CTA) — Task 7 composes all of these.
- §3 component architecture (every file named) — Tasks 1-6 build each named file with exact paths.
- §3 shared-data zip (deliverables from howItWorksData zipped with deliverableDetail by index) — Task 7 Step 1, the `.map` over `deliverables` with `deliverableDetail[i]` lookup.
- §4 content rules (UK English, no em/en dashes, Grade 7) — all new copy in Task 1 has been audited: no dashes, ranges use "to" or commas, contractions are minimal, no SaaS hype.
- §5 quality bar (responsive sweep + overflow probe) — Task 7 Step 3.
- §6 out of scope respected (no tier table, no real photography, no conversion-type tabs, no homepage/How-It-Works changes).

**Placeholder scan:** No "TBD"/"TODO". The `pricingFrom = "£1,800"` with its "flagged for confirmation" comment is intentional spec content, not a plan placeholder. All file contents are complete.

**Type consistency:** `DeliverableGraphicKey` defined in Task 1 with six values (`ga-plans`, `schedule`, `constraints`, `risk-register`, `go-nogo`, `efficiency`) — Task 4's `deliverableGraphicMap` is typed `Record<DeliverableGraphicKey, React.FC>` with exactly those six keys, and Task 1's `deliverableDetail` array uses only those values. The `Deliverable` type imported from `../../data/howItWorksData` matches its definition in the existing data file (`{ title: string; desc: string }`). `DeliverableDetail`, `SampleReportPage`, `TimelineDay`, `PackageFaq` are all defined in Task 1 and consumed only by their respective sections.
