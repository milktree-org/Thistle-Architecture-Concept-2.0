# How It Works Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the How It Works page (`/how-it-works`) as a 5-step narrative timeline matching the homepage's process, with the 6 Feasibility Engine data layers nested inside Step 2.

**Architecture:** A new `views/HowItWorksPage.tsx` composes a reusable `StepRow` component over a `howItWorksData` content array, with custom SVG/CSS graphics and AI-image placeholder treatments in `stepGraphics.tsx`. The 6 layer names are extracted into a shared `data/feasibilityLayers.ts` consumed by both this page and the homepage Feasibility Engine so they cannot drift.

**Tech Stack:** Next.js 16 App Router, React 18, TypeScript, Tailwind CSS v3.4, framer-motion v11, lucide-react.

**Verification model:** This codebase has no unit-test harness (no test runner in `package.json`, no test files). Adding one for a marketing page is out of scope (YAGNI). Verification per task is: TypeScript type-check (`npx tsc --noEmit`), production build (`npm run build`), and for the final page, the Playwright responsive sweep built in the foundation phase.

---

## File Structure

| File | Responsibility |
|---|---|
| `data/feasibilityLayers.ts` (create) | The 6 Feasibility Engine layer identities (eyebrow + title). Shared by the homepage and this page so layer names cannot drift. |
| `sections/FeasibilityEngine.tsx` (modify) | Homepage section. Refactored so its `rows` array sources eyebrow + title from `feasibilityLayers.ts`; body and graphics untouched. |
| `data/howItWorksData.ts` (create) | The 5-step content array, the 6 deliverables array, the 6 compact-layer blurbs, and the shared types. |
| `sections/how-it-works/stepGraphics.tsx` (create) | Custom SVG/CSS graphics for Steps 1, 2, 4; placeholder treatments for the Step 3 and Step 5 AI-image slots; the compact layer mini-graphics; the key-to-component map. |
| `sections/how-it-works/StepRow.tsx` (create) | One alternating full-width narrative row. Reused five times. |
| `views/HowItWorksPage.tsx` (modify) | Full rebuild. Composes the hero, the 5 step rows, the nested layer grid under Step 2, the deliverables section, the closing CTA, and the reused FAQ. |

---

## Task 1: Shared feasibility layers data

**Files:**
- Create: `data/feasibilityLayers.ts`
- Modify: `sections/FeasibilityEngine.tsx`

- [ ] **Step 1: Read the current Feasibility Engine rows**

Run: `sed -n '210,260p' sections/FeasibilityEngine.tsx`
Expected: you see the `rows` array, six objects each shaped `{ eyebrow, title, body, Graphic }`. Note the exact `eyebrow` and `title` string values for all six rows. As of writing they are:
1. `"Layer 01"` / `"Planning history & policy analysis"`
2. `"Layer 02"` / `"Local Policy Analysis"`
3. `"Layer 03"` / `"Targeted Policy Analysis"`
4. `"Layer 04"` / `"Comparable schemes"`
5. `"Layer 05"` / `"GDV and viability"`
6. `"Layer 06"` / `"Spatial layout optimisation"`

If the actual file differs from this list, use the file's actual values in Step 2 — the file is the source of truth.

- [ ] **Step 2: Create `data/feasibilityLayers.ts`**

Create `data/feasibilityLayers.ts` with this content (using the actual values confirmed in Step 1):

```ts
export interface FeasibilityLayer {
  eyebrow: string;
  title: string;
}

// The six data layers of the Feasibility Engine. Shared between the homepage
// FeasibilityEngine section and the How It Works page so layer names cannot drift.
export const feasibilityLayers: FeasibilityLayer[] = [
  { eyebrow: "Layer 01", title: "Planning history & policy analysis" },
  { eyebrow: "Layer 02", title: "Local Policy Analysis" },
  { eyebrow: "Layer 03", title: "Targeted Policy Analysis" },
  { eyebrow: "Layer 04", title: "Comparable schemes" },
  { eyebrow: "Layer 05", title: "GDV and viability" },
  { eyebrow: "Layer 06", title: "Spatial layout optimisation" },
];
```

- [ ] **Step 3: Refactor `sections/FeasibilityEngine.tsx` to use the shared data**

Add this import near the other imports at the top of `sections/FeasibilityEngine.tsx` (it already imports `Reveal` from `'../components/animations/Reveal'`, so the `../data/` path is correct):

```ts
import { feasibilityLayers } from '../data/feasibilityLayers';
```

Then in the `rows` array, for each of the six row objects, replace the `eyebrow:` string literal with `feasibilityLayers[N].eyebrow` and the `title:` string literal with `feasibilityLayers[N].title`, where `N` is the row's zero-based index (0 for the first row, 5 for the last). Leave the `body:` and `Graphic:` properties on every row exactly as they are. Example for the first row:

```ts
  {
    eyebrow: feasibilityLayers[0].eyebrow,
    title: feasibilityLayers[0].title,
    body: "...leave the existing body string exactly as it is...",
    Graphic: GraphicPlanning,
  },
```

- [ ] **Step 4: Type-check and build**

Run: `npx tsc --noEmit`
Expected: no output (passes).

Run: `npm run build`
Expected: the build completes successfully with no errors.

- [ ] **Step 5: Verify the homepage section is unchanged**

Run: `git diff sections/FeasibilityEngine.tsx`
Expected: the only changes are the one added import line and the `eyebrow:`/`title:` lines on the six rows. No `body:` string, no `Graphic:` reference, and no JSX has changed. The rendered eyebrows and titles on the homepage Feasibility Engine are identical to before because `feasibilityLayers.ts` carries the same values.

- [ ] **Step 6: Commit**

```bash
git add data/feasibilityLayers.ts sections/FeasibilityEngine.tsx
git commit -m "refactor: extract shared feasibility layer data"
```

---

## Task 2: How It Works content data

**Files:**
- Create: `data/howItWorksData.ts`

- [ ] **Step 1: Create `data/howItWorksData.ts`**

Create `data/howItWorksData.ts` with exactly this content:

```ts
export type StepGraphicKey = 'step1' | 'step2' | 'jodi-call' | 'step4' | 'final-meeting';

export interface HowItWorksStep {
  num: string;
  durationLabel: string;
  title: string;
  lead: string;
  detail: string;
  graphic: StepGraphicKey;
}

export interface Deliverable {
  title: string;
  desc: string;
}

// Duration labels are a proposal, flagged for confirmation with the client.
export const howItWorksSteps: HowItWorksStep[] = [
  {
    num: "01",
    durationLabel: "Under 2 minutes",
    title: "Upload Property Details",
    lead: "Share your property's address with a few basic details: size, floor count, and current use.",
    detail: "You do not need detailed drawings. Basic floor plans, an address, and your initial assumptions on unit count are enough. If you do not have floor plans, we can often source them ourselves.",
    graphic: "step1",
  },
  {
    num: "02",
    durationLabel: "Automated, within 48 hours",
    title: "Automated Analysis",
    lead: "Our data engine checks planning history, site constraints, density data, and comparable schemes across your local area.",
    detail: "Hundreds of data points are cross-referenced across trusted sources before a human looks at the site. This is the desk study, done in hours, not weeks.",
    graphic: "step2",
  },
  {
    num: "03",
    durationLabel: "Instant call",
    title: "Project Data Gathering Session",
    lead: "An instant call with Jodi, our property expert, to gather the details we need and walk through your goals for the site.",
    detail: "A short, focused conversation. Jodi confirms what the data engine found and captures anything specific to your plans for the building.",
    graphic: "jodi-call",
  },
  {
    num: "04",
    durationLabel: "Days 3 to 4",
    title: "Sketch Scheme Stage",
    lead: "One of our architects carries out the sketch scheme analysis to find the best possible layout for the building.",
    detail: "The architect pressure-tests the data against the physical building, sketches the optimal unit layout, and works through the spatial problems automation cannot solve.",
    graphic: "step4",
  },
  {
    num: "05",
    durationLabel: "Day 5",
    title: "Final Meeting",
    lead: "We review the completed feasibility together on a video call, five days after you uploaded your details.",
    detail: "You leave the call with a clear Go or No-Go, the full report, and the layouts. Enough to bid, exchange, or walk away with confidence.",
    graphic: "final-meeting",
  },
];

// One-line descriptions for the six compact layer cards nested under Step 2.
// Indexed to match feasibilityLayers in data/feasibilityLayers.ts.
export const layerBlurbs: string[] = [
  "Five years of approvals and refusals around the site.",
  "Local and national policy, Building Regs, and licensing.",
  "Density, change-of-use, and local planning thresholds.",
  "Nearby conversions, unit counts, and achieved sale values.",
  "Build cost, margin, and ROI before you commit capital.",
  "Architect-led layout options that maximise unit yield.",
];

export const deliverables: Deliverable[] = [
  { title: "GA Floor Plans", desc: "Proposed layouts showing unit positions, circulation, and core areas." },
  { title: "Schedule of Accommodation", desc: "Unit-by-unit breakdown with GIA, room counts, and NDSS compliance." },
  { title: "Constraints Analysis", desc: "Planning policy, flood risk, Article 4, conservation, and heritage assessment." },
  { title: "Risk Register", desc: "Structural, environmental, and commercial risks, quantified with cost implications." },
  { title: "Go/No-Go Recommendation", desc: "A clear, unambiguous recommendation backed by evidence." },
  { title: "Efficiency Metrics", desc: "Net-to-gross ratios, GDV estimates, and commercial viability indicators." },
];
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (passes).

- [ ] **Step 3: Commit**

```bash
git add data/howItWorksData.ts
git commit -m "feat: add How It Works page content data"
```

---

## Task 3: Step graphics

**Files:**
- Create: `sections/how-it-works/stepGraphics.tsx`

- [ ] **Step 1: Create the directory and `sections/how-it-works/stepGraphics.tsx`**

Create `sections/how-it-works/stepGraphics.tsx` with exactly this content:

```tsx
"use client";

import React from 'react';
import { Upload, CheckCircle2, Phone, Video, History, ScrollText, Crosshair, LayoutGrid, PoundSterling, Ruler } from 'lucide-react';
import type { StepGraphicKey } from '../../data/howItWorksData';

// ─── Step 01: upload portal mock ──────────
export const Step1Graphic: React.FC = () => (
  <div className="aspect-square w-full bg-white rounded-2xl border border-thistle-black/[0.06] shadow-sm shadow-thistle-black/[0.03] p-fl-6 flex flex-col justify-center">
    <div className="flex items-center justify-between mb-fl-4">
      <span className="text-[10px] uppercase tracking-wider text-thistle-black/40 font-semibold">New property</span>
      <span className="text-[10px] text-thistle-green font-medium">Step 1 of 5</span>
    </div>
    <div className="space-y-fl-3">
      <div>
        <span className="block text-[10px] text-thistle-black/40 mb-1">Address</span>
        <div className="h-9 rounded-lg border border-thistle-black/[0.08] bg-thistle-white/50 flex items-center px-3">
          <span className="text-xs text-thistle-black/70">42 High Street, Croydon</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-fl-3">
        <div>
          <span className="block text-[10px] text-thistle-black/40 mb-1">Floors</span>
          <div className="h-9 rounded-lg border border-thistle-black/[0.08] bg-thistle-white/50 flex items-center px-3"><span className="text-xs text-thistle-black/70">3</span></div>
        </div>
        <div>
          <span className="block text-[10px] text-thistle-black/40 mb-1">Current use</span>
          <div className="h-9 rounded-lg border border-thistle-black/[0.08] bg-thistle-white/50 flex items-center px-3"><span className="text-xs text-thistle-black/70">Office</span></div>
        </div>
      </div>
    </div>
    <div className="mt-fl-4 rounded-lg border border-dashed border-thistle-green/40 bg-thistle-green/[0.05] py-fl-4 flex flex-col items-center gap-1">
      <Upload size={18} className="text-thistle-green" />
      <span className="text-[10px] text-thistle-black/50">Drop floor plans, or we source them</span>
    </div>
  </div>
);

// ─── Step 02: data engine desk study mock ──────────
const step2Sources = [
  "Planning portal history",
  "Local & national policy",
  "Constraints & flood risk",
  "Comparable schemes",
  "Density & licensing",
];

export const Step2Graphic: React.FC = () => (
  <div className="aspect-square w-full bg-white rounded-2xl border border-thistle-black/[0.06] shadow-sm shadow-thistle-black/[0.03] p-fl-6 flex flex-col justify-center">
    <div className="flex items-center justify-between mb-fl-4">
      <span className="text-[10px] uppercase tracking-wider text-thistle-black/40 font-semibold">Desk study</span>
      <span className="text-[10px] text-thistle-green font-medium">Running</span>
    </div>
    <div className="space-y-fl-1">
      {step2Sources.map((src, i) => (
        <div key={i} className="flex items-center gap-2.5 py-1.5">
          <CheckCircle2 size={14} className="text-thistle-green flex-shrink-0" />
          <span className="text-xs text-thistle-black/70">{src}</span>
        </div>
      ))}
    </div>
    <div className="mt-fl-4 pt-fl-3 border-t border-thistle-black/[0.06]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] text-thistle-black/40">Sources cross-referenced</span>
        <span className="text-xs font-semibold text-thistle-green">15+</span>
      </div>
      <div className="h-1.5 bg-thistle-black/[0.05] rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-thistle-green" style={{ width: "88%" }} />
      </div>
    </div>
  </div>
);

// ─── Step 04: sketch scheme floor plan ──────────
const step4Top = [
  { x: 14, w: 92, type: "1B" },
  { x: 110, w: 92, type: "2B" },
  { x: 206, w: 100, type: "1B" },
];
const step4Bottom = [
  { x: 14, w: 100, type: "2B" },
  { x: 118, w: 92, type: "1B" },
  { x: 214, w: 92, type: "2B" },
];

export const Step4Graphic: React.FC = () => (
  <div className="aspect-square w-full bg-white rounded-2xl border border-thistle-black/[0.06] shadow-sm shadow-thistle-black/[0.03] p-fl-6 flex flex-col">
    <div className="flex items-center justify-between mb-fl-4">
      <span className="text-[10px] uppercase tracking-wider text-thistle-black/40 font-semibold">Sketch scheme</span>
      <span className="text-[10px] text-thistle-black/50">6 units · Level 2</span>
    </div>
    <div className="flex-1 bg-thistle-white/50 rounded-xl p-fl-4 flex items-center">
      <svg viewBox="0 0 320 200" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <rect x="8" y="8" width="304" height="184" fill="white" stroke="#2F3B36" strokeWidth="1.5" rx="3" />
        <rect x="14" y="92" width="292" height="16" fill="#F5F4EF" stroke="#2F3B36" strokeOpacity="0.25" strokeWidth="0.4" />
        <text x="160" y="103" textAnchor="middle" fontSize="7" fill="#71776E" fontFamily="sans-serif" letterSpacing="0.5">CORRIDOR</text>
        {step4Top.map((u, i) => (
          <g key={`t${i}`}>
            <rect x={u.x} y="14" width={u.w} height="74" fill="#8F9952" fillOpacity="0.18" stroke="#8F9952" strokeWidth="0.8" />
            <text x={u.x + u.w / 2} y="54" textAnchor="middle" fontSize="10" fill="#2F3B36" fontFamily="sans-serif">{u.type}</text>
          </g>
        ))}
        {step4Bottom.map((u, i) => (
          <g key={`b${i}`}>
            <rect x={u.x} y="112" width={u.w} height="74" fill="#8F9952" fillOpacity="0.18" stroke="#8F9952" strokeWidth="0.8" />
            <text x={u.x + u.w / 2} y="152" textAnchor="middle" fontSize="10" fill="#2F3B36" fontFamily="sans-serif">{u.type}</text>
          </g>
        ))}
      </svg>
    </div>
    <div className="mt-fl-3 grid grid-cols-3 gap-2 text-[10px]">
      <div><span className="block text-thistle-black/40 uppercase tracking-wider font-semibold text-[9px]">1-bed</span><span className="text-sm font-semibold text-thistle-black">3</span></div>
      <div><span className="block text-thistle-black/40 uppercase tracking-wider font-semibold text-[9px]">2-bed</span><span className="text-sm font-semibold text-thistle-black">3</span></div>
      <div><span className="block text-thistle-black/40 uppercase tracking-wider font-semibold text-[9px]">Efficiency</span><span className="text-sm font-semibold text-thistle-green">84%</span></div>
    </div>
  </div>
);

// ─── AI-image placeholder treatment (Steps 03 and 05) ──────────
// Brand-tinted gradient panel with the step icon. Replaced by generated
// imagery in a later follow-up pass once the API key and image style are set.
const ImagePlaceholder: React.FC<{ icon: React.ReactNode; caption: string }> = ({ icon, caption }) => (
  <div className="aspect-square w-full rounded-2xl border border-thistle-black/[0.06] bg-gradient-to-br from-thistle-green/15 via-thistle-white to-thistle-pink/15 flex flex-col items-center justify-center gap-fl-3">
    <div className="w-14 h-14 rounded-2xl bg-white/70 backdrop-blur flex items-center justify-center text-thistle-green">
      {icon}
    </div>
    <span className="text-[10px] uppercase tracking-[0.2em] text-thistle-black/40 font-semibold">{caption}</span>
  </div>
);

export const JodiCallPlaceholder: React.FC = () => (
  <ImagePlaceholder icon={<Phone size={24} />} caption="Project data gathering" />
);

export const FinalMeetingPlaceholder: React.FC = () => (
  <ImagePlaceholder icon={<Video size={24} />} caption="Feasibility review" />
);

// ─── Compact mini-graphic for the six nested layer cards ──────────
const layerIcons = [History, ScrollText, Crosshair, LayoutGrid, PoundSterling, Ruler];

export const LayerMiniGraphic: React.FC<{ index: number }> = ({ index }) => {
  const Icon = layerIcons[index] ?? History;
  return (
    <div className="h-16 rounded-xl bg-thistle-green/[0.08] flex items-center justify-center">
      <Icon size={22} className="text-thistle-green" />
    </div>
  );
};

// ─── Key-to-component map used by the page ──────────
export const stepGraphicMap: Record<StepGraphicKey, React.FC> = {
  step1: Step1Graphic,
  step2: Step2Graphic,
  "jodi-call": JodiCallPlaceholder,
  step4: Step4Graphic,
  "final-meeting": FinalMeetingPlaceholder,
};
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (passes). If it fails on a missing lucide-react icon name, check the icon is exported by `lucide-react@0.292.0` and substitute the closest equivalent, noting the change.

- [ ] **Step 3: Commit**

```bash
git add sections/how-it-works/stepGraphics.tsx
git commit -m "feat: add How It Works step graphics"
```

---

## Task 4: StepRow component

**Files:**
- Create: `sections/how-it-works/StepRow.tsx`

- [ ] **Step 1: Create `sections/how-it-works/StepRow.tsx`**

Create `sections/how-it-works/StepRow.tsx` with exactly this content:

```tsx
"use client";

import React from 'react';
import { Reveal } from '../../components/animations/Reveal';
import type { HowItWorksStep } from '../../data/howItWorksData';

interface StepRowProps {
  step: HowItWorksStep;
  reversed: boolean;
  graphic: React.ReactNode;
}

// One alternating full-width narrative row. Matches the homepage Feasibility
// Engine's row structure: content on one side, graphic on the other, sides
// swapping on every other row at the lg breakpoint.
export const StepRow: React.FC<StepRowProps> = ({ step, reversed, graphic }) => (
  <Reveal>
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-fl-8 items-center ${reversed ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <div className={reversed ? 'lg:pl-fl-5' : ''}>
        <span className="text-[11px] uppercase tracking-[0.2em] text-thistle-green font-semibold">
          Step {step.num} · {step.durationLabel}
        </span>
        <h3 className="text-fluid-h3 font-medium tracking-tight leading-tight text-thistle-black mt-fl-3 mb-fl-4">
          {step.title}
        </h3>
        <p className="text-fluid-base text-thistle-black/80 leading-relaxed max-w-md mb-fl-4">
          {step.lead}
        </p>
        <p className="text-fluid-sm text-thistle-black/50 leading-relaxed max-w-md">
          {step.detail}
        </p>
      </div>
      <div className={`w-full ${reversed ? '' : 'lg:order-2'}`}>
        {graphic}
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
git add sections/how-it-works/StepRow.tsx
git commit -m "feat: add How It Works StepRow component"
```

---

## Task 5: Rebuild the How It Works page

**Files:**
- Modify: `views/HowItWorksPage.tsx` (full rewrite)

- [ ] **Step 1: Replace the contents of `views/HowItWorksPage.tsx`**

Replace the entire contents of `views/HowItWorksPage.tsx` with exactly this:

```tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/animations/Reveal';
import { Button } from '../components/ui/Button';
import { useFeasibility } from '../components/feasibility/FeasibilityContext';
import { FAQ } from '../sections/FAQ';
import { StepRow } from '../sections/how-it-works/StepRow';
import { stepGraphicMap, LayerMiniGraphic } from '../sections/how-it-works/stepGraphics';
import { howItWorksSteps, deliverables, layerBlurbs } from '../data/howItWorksData';
import { feasibilityLayers } from '../data/feasibilityLayers';

export const HowItWorksPage: React.FC = () => {
  const { openModal } = useFeasibility();

  return (
    <>
      <PageHero
        label="How It Works"
        heading="From Building To Go/No-Go, Step By Step."
        description="A structured, data-driven process that gives developers the confidence to bid, exchange, or walk away. In five days."
        variant="dark"
      >
        <Button
          variant="glass"
          icon={<ArrowUpRight size={16} />}
          onClick={openModal}
          className="!bg-thistle-green !text-black !border-thistle-green hover:!bg-thistle-green/80 hover:!border-thistle-green/80"
        >
          Start Feasibility
        </Button>
      </PageHero>

      {/* The 5-step narrative timeline */}
      <section className="bg-thistle-white py-fl-section px-fl-margin">
        <div className="max-w-[1360px] mx-auto">
          <div className="text-center mb-fl-section-sm max-w-2xl mx-auto">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">The 5-Step Process</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
                Every Step From Upload<br /><span className="text-thistle-green">To Clear Recommendation.</span>
              </h2>
            </Reveal>
          </div>

          <div className="space-y-fl-section-sm">
            {howItWorksSteps.map((step, i) => {
              const Graphic = stepGraphicMap[step.graphic];
              return (
                <div key={step.num}>
                  <StepRow step={step} reversed={i % 2 !== 0} graphic={<Graphic />} />
                  {step.graphic === 'step2' && (
                    <Reveal delay={0.1}>
                      <div className="mt-fl-7">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-thistle-green font-semibold">
                          Inside the analysis: six data layers
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fl-4 mt-fl-4">
                          {feasibilityLayers.map((layer, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-thistle-black/[0.06] p-fl-5">
                              <LayerMiniGraphic index={idx} />
                              <span className="block text-[10px] uppercase tracking-wider text-thistle-green font-semibold mt-fl-3">{layer.eyebrow}</span>
                              <h4 className="text-fluid-h6 font-medium tracking-tight text-thistle-black mt-1">{layer.title}</h4>
                              <p className="text-fluid-sm text-thistle-black/60 leading-relaxed mt-fl-2">{layerBlurbs[idx]}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Reveal>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What you receive */}
      <section className="py-fl-section px-fl-margin bg-thistle-black text-white">
        <div className="max-w-[1360px] mx-auto">
          <div className="mb-fl-8">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-white/30 font-semibold mb-fl-5">What You Receive</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight">
                Everything In One Report.
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-fl-4">
            {deliverables.map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="p-fl-5 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-500 h-full"
                >
                  <h3 className="text-fluid-h6 font-medium tracking-tight mb-fl-2">{item.title}</h3>
                  <p className="text-fluid-base text-white/80 leading-relaxed">{item.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA band — dark with a gradient treatment standing in for the
          AI image background slot until generated imagery lands. The gradient
          keeps it visually distinct from the flat-dark deliverables section. */}
      <section className="relative py-fl-section px-fl-margin bg-thistle-black text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-thistle-green/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-thistle-pink/10 rounded-full blur-[110px]" />
        </div>
        <div className="max-w-[1360px] mx-auto text-center relative z-10">
          <Reveal>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight mb-fl-5">
              Ready To Start?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-fluid-base text-white/80 leading-relaxed max-w-md mx-auto mb-fl-6">
              Submit your property details and get a clear Go or No-Go in five days.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Button
              variant="glass"
              size="lg"
              icon={<ArrowUpRight size={18} />}
              onClick={openModal}
              className="!bg-thistle-green !text-black !border-thistle-green hover:!bg-thistle-green/80 hover:!border-thistle-green/80"
            >
              Start Feasibility
            </Button>
          </Reveal>
        </div>
      </section>

      <FAQ />
    </>
  );
};
```

- [ ] **Step 2: Type-check and build**

Run: `npx tsc --noEmit`
Expected: no output (passes).

Run: `npm run build`
Expected: the build completes successfully, and the route list includes `/how-it-works`.

- [ ] **Step 3: Responsive verification**

Start the dev server in the background: `npm run dev` (wait until it reports ready on `http://localhost:3000`).

Run: `npm run sweep`
Expected: the sweep logs `OK <viewport> how-it-works` for all five viewports (alongside the other routes), and `screenshots/<viewport>/how-it-works-top.png`, `-mid.png`, `-deep.png` exist for each viewport.

Run: `RESPONSIVE_ORIGIN=http://localhost:3000 ROUTE=/how-it-works VP_WIDTH=375 VP_HEIGHT=812 npm run find-overflow`
Expected: `[]`, or only SVG `<path>` false positives (a known limitation documented in the foundation phase — confirmed harmless when `document.body.scrollWidth === document.body.clientWidth`). If a real layout element (a `section`, `div`, grid, or heading) overflows, fix it before committing.

Open `screenshots/mobile-375/how-it-works-top.png`, `screenshots/mobile-375/how-it-works-mid.png`, and `screenshots/desktop-1440/how-it-works-mid.png` and confirm: the hero renders, the step rows alternate the graphic side at desktop and stack cleanly at mobile, the six nested layer cards sit under Step 2, the deliverables section and closing CTA render, and nothing is clipped or overflowing.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add views/HowItWorksPage.tsx
git commit -m "feat: rebuild How It Works page as 5-step narrative timeline"
```

---

## Self-Review

**Spec coverage:** Checked against `docs/superpowers/specs/2026-05-15-how-it-works-page-design.md`.
- Section 2 page structure (hero, section intro, 5-step timeline, deliverables, closing CTA, reused FAQ) — Task 5.
- Section 2 hero heading direction ("building to Go/No-Go", drops "enquiry") — Task 5, `heading` prop.
- Section 3 standard step row (eyebrow with number + duration, title, lead, detail) — Task 4 `StepRow`, Task 2 data.
- Section 3 Step 2 nested compact grid of 6 layer cards — Task 5 (the `step.graphic === 'step2'` block), Task 3 `LayerMiniGraphic`.
- Section 3 the 5 steps and duration labels — Task 2 `howItWorksSteps`.
- Section 3 deliverables — Task 2 `deliverables`, Task 5 render.
- Section 4 component architecture (StepRow, stepGraphics, howItWorksData, shared feasibilityLayers extraction) — Tasks 1-5, file-for-file.
- Section 5 imagery (custom graphics for 1/2/4, placeholder treatments for 3/5, AI as later follow-up) — Task 3.
- Section 6 quality bar (responsive sweep, overflow check, copy rules) — Task 5 Step 3; copy in Task 2 uses UK English, no em or en dashes, "to" for ranges.
- Section 7 out of scope (AI generation, no homepage Process/FeasibilityEngine change beyond the shared data extraction, no SubPageCTA) — respected; Task 1 only extracts shared data.

One deliberate refinement: spec Section 2 listed the closing CTA as a dark band and the deliverables as a dark section, which would stack two dark sections (an SOP-flagged pitfall). Task 5 keeps both dark per the spec but gives the closing CTA a blur-gradient background treatment so it reads as distinct, not a continuation. This gradient also stands in as the placeholder for the CTA's AI image slot.

**Placeholder scan:** No "TBD"/"TODO"/"implement later". The `data/howItWorksData.ts` comment "Duration labels are a proposal, flagged for confirmation with the client" is intentional content per the spec, not a plan placeholder. All file contents are complete.

**Type consistency:** `StepGraphicKey` is defined in `data/howItWorksData.ts` (Task 2) and imported by `stepGraphics.tsx` (Task 3) and used as the key type of `stepGraphicMap`. `HowItWorksStep` is defined in Task 2 and imported by `StepRow.tsx` (Task 4). `feasibilityLayers` / `FeasibilityLayer` defined in Task 1, consumed in Task 5. The five `graphic` key values in `howItWorksSteps` (`step1`, `step2`, `jodi-call`, `step4`, `final-meeting`) exactly match the five keys of `stepGraphicMap`. `layerBlurbs` and `feasibilityLayers` are both 6-element arrays indexed together in Task 5.
