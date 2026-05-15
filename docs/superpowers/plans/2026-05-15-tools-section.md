# Tools Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/tools` index plus two interactive tools (Class MA eligibility checker, GDV/viability calculator), each as its own static Next.js route, each ending in a "Start Feasibility" CTA.

**Architecture:** Three static App Router routes, no dynamic params. A shared `ToolShell` wraps the per-tool page hero and closing CTA. Two stateful interactive section components (`EligibilityChecker`, `GDVCalculator`) carry the tool logic, with pure verdict helpers (`computeVerdict`, `computeViability`) inside each. Tool metadata lives in `data/toolsData.ts`, shared by the index card grid and per-route SEO.

**Tech Stack:** Next.js 16 App Router, React 18 (`useState`, `useMemo`), TypeScript, Tailwind CSS v3.4, framer-motion v11, lucide-react.

**Verification model:** No unit-test harness. Per task: `npx tsc --noEmit`. Final task: also `npm run build`, the responsive sweep with the three new tool paths added, and an overflow probe + interactive sanity check on dev.

---

## File Structure

| File | Responsibility |
|---|---|
| `data/toolsData.ts` (create) | `Tool` type, `tools` array (two entries), `getToolBySlug` helper. |
| `components/ui/ToolShell.tsx` (create) | Shared shell for a tool page: PageHero, body slot, disclaimer line, closing CTA band. |
| `sections/tools/EligibilityChecker.tsx` (create) | The Class MA decision-tree stepper. Owns `computeVerdict` pure helper. |
| `sections/tools/GDVCalculator.tsx` (create) | The GDV/viability calculator. Owns `computeViability` pure helper. |
| `views/ToolsIndexPage.tsx` (create) | The `/tools` index view. |
| `views/tools/ClassMACheckerPage.tsx` (create) | Composes `ToolShell` + `EligibilityChecker`. |
| `views/tools/GDVCalculatorPage.tsx` (create) | Composes `ToolShell` + `GDVCalculator`. |
| `src/app/tools/page.tsx` (create) | Static route for the index. Per-page `metadata`. |
| `src/app/tools/class-ma-checker/page.tsx` (create) | Static route for the Class MA tool. |
| `src/app/tools/gdv-calculator/page.tsx` (create) | Static route for the GDV calculator. |
| `scripts/responsive-sweep.mjs` (modify) | Add three new tool paths to the `ROUTES` array. |

---

## Task 1: Tools content data

**Files:**
- Create: `data/toolsData.ts`

- [ ] **Step 1: Create `data/toolsData.ts` with this exact content**

```ts
export interface Tool {
  slug: string;
  label: string;
  summary: string;
  iconName: 'ListChecks' | 'Calculator';
  path: string;
  metaTitle: string;
  metaDescription: string;
}

export const tools: Tool[] = [
  {
    slug: "class-ma-checker",
    label: "Class MA Eligibility Checker",
    summary: "Six quick questions to see if your building qualifies for permitted-development conversion under Class MA.",
    iconName: "ListChecks",
    path: "/tools/class-ma-checker",
    metaTitle: "Class MA Eligibility Checker | Thistle Architecture",
    metaDescription: "Free Class MA eligibility checker. Six quick questions on use class, vacancy, floor space, Article 4, and listing status. See whether your office-to-resi conversion qualifies for permitted development.",
  },
  {
    slug: "gdv-calculator",
    label: "GDV & Viability Calculator",
    summary: "A quick back-of-envelope check on whether the numbers work, before you spend a pound on a feasibility.",
    iconName: "Calculator",
    path: "/tools/gdv-calculator",
    metaTitle: "GDV & Viability Calculator | Thistle Architecture",
    metaDescription: "Free GDV and viability calculator for conversion schemes. Enter purchase price, area, units, and sale prices; see projected margin and a quick verdict on whether the deal stacks up.",
  },
];

export const getToolBySlug = (slug: string): Tool | undefined =>
  tools.find((t) => t.slug === slug);
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add data/toolsData.ts
git commit -m "feat: add Tools content data"
```

---

## Task 2: ToolShell component

**Files:**
- Create: `components/ui/ToolShell.tsx`

- [ ] **Step 1: Create the file with this exact content**

```tsx
"use client";

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PageHero } from './PageHero';
import { Reveal } from '../animations/Reveal';
import { Button } from './Button';
import { useFeasibility } from '../feasibility/FeasibilityContext';
import type { Tool } from '../../data/toolsData';

interface ToolShellProps {
  tool: Tool;
  heroHeading: string;
  heroDescription: string;
  disclaimer: string;
  children: React.ReactNode;
}

// Shared page shell for any tool. Wraps the PageHero, the tool body, a small
// disclaimer line, and a closing "Start Feasibility" CTA so every tool page
// has the same conversion frame.
export const ToolShell: React.FC<ToolShellProps> = ({ tool, heroHeading, heroDescription, disclaimer, children }) => {
  const { openModal } = useFeasibility();
  return (
    <>
      <PageHero
        label={tool.label}
        heading={heroHeading}
        description={heroDescription}
      />

      {children}

      <section className="bg-thistle-white px-fl-margin py-fl-7">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-fluid-sm text-thistle-black/55 leading-relaxed text-center">
            {disclaimer}
          </p>
        </div>
      </section>

      <section className="py-fl-section px-fl-margin bg-white">
        <div className="max-w-[1360px] mx-auto text-center">
          <Reveal>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-5">
              The Tool Is A Hint.<br /><span className="text-thistle-green">The Feasibility Is The Answer.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-fluid-base text-thistle-black/80 leading-relaxed max-w-md mx-auto mb-fl-6">
              Get a real, architect-led feasibility on the building in five days. Fixed fee, clear Go or No-Go.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Button variant="primary" size="lg" icon={<ArrowUpRight size={18} />} onClick={openModal}>
              Start Feasibility
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
};
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add components/ui/ToolShell.tsx
git commit -m "feat: add ToolShell shared page shell"
```

---

## Task 3: EligibilityChecker

**Files:**
- Create: `sections/tools/EligibilityChecker.tsx`

- [ ] **Step 1: Create the file with this exact content**

```tsx
"use client";

import React, { useState } from 'react';
import { ArrowUpRight, RotateCcw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Reveal } from '../../components/animations/Reveal';
import { Button } from '../../components/ui/Button';
import { useFeasibility } from '../../components/feasibility/FeasibilityContext';

interface Question {
  key: string;
  prompt: string;
  options: { value: string; label: string }[];
}

const QUESTIONS: Question[] = [
  {
    key: 'useClass',
    prompt: "What is the building's current use class?",
    options: [
      { value: 'class-e', label: 'Class E (commercial, business, service)' },
      { value: 'other-commercial', label: 'Other commercial' },
      { value: 'residential', label: 'Already residential' },
      { value: 'other', label: 'Other or unsure' },
    ],
  },
  {
    key: 'commercialUse2y',
    prompt: "Has the building been in commercial use for the last 2 years?",
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unknown', label: 'Unknown' },
    ],
  },
  {
    key: 'vacant3m',
    prompt: "Has the building been vacant for at least 3 months?",
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unknown', label: 'Unknown' },
    ],
  },
  {
    key: 'floorSpace',
    prompt: "What is the approximate floor space being converted?",
    options: [
      { value: 'under-1500', label: 'Under 1,500 sqm' },
      { value: '1500-3000', label: '1,500 to 3,000 sqm' },
      { value: 'over-3000', label: 'Over 3,000 sqm' },
    ],
  },
  {
    key: 'article4',
    prompt: "Is there an Article 4 direction here that removes Class MA?",
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes' },
      { value: 'unknown', label: 'Unknown' },
    ],
  },
  {
    key: 'listedStatus',
    prompt: "Is the building listed or in a conservation area?",
    options: [
      { value: 'neither', label: 'Neither' },
      { value: 'conservation', label: 'Conservation area' },
      { value: 'listed', label: 'Listed building' },
    ],
  },
];

export type EligibilityVerdict = 'eligible' | 'borderline' | 'not-eligible';

// Pure verdict helper. Hard fails on Q1/Q4/Q5 close the route; any unknown
// or in-between answer surfaces a borderline; only an all-clear is eligible.
export function computeVerdict(answers: Record<string, string>): EligibilityVerdict {
  if (answers.useClass === 'residential' || answers.useClass === 'other') return 'not-eligible';
  if (answers.floorSpace === 'over-3000') return 'not-eligible';
  if (answers.article4 === 'yes') return 'not-eligible';

  if (
    answers.useClass === 'other-commercial' ||
    answers.commercialUse2y === 'unknown' || answers.commercialUse2y === 'no' ||
    answers.vacant3m === 'unknown' || answers.vacant3m === 'no' ||
    answers.floorSpace === '1500-3000' ||
    answers.article4 === 'unknown' ||
    answers.listedStatus !== 'neither'
  ) return 'borderline';

  return 'eligible';
}

interface VerdictCopy {
  headline: string;
  body: string;
  Icon: React.ComponentType<{ size?: number }>;
  bg: string;
  border: string;
  text: string;
}

const VERDICT_COPY: Record<EligibilityVerdict, VerdictCopy> = {
  eligible: {
    headline: 'Likely eligible for Class MA.',
    body: "Your answers do not trigger any of the hard-fail conditions. A full feasibility confirms it against live planning data and runs the prior-approval tests in detail.",
    Icon: CheckCircle2,
    bg: 'bg-thistle-green/[0.08]',
    border: 'border-thistle-green/30',
    text: 'text-thistle-green',
  },
  borderline: {
    headline: 'Borderline — a feasibility removes the doubt.',
    body: "You have at least one unknown or borderline answer. Class MA might still work, but the prior-approval tests need real data, not assumptions. A feasibility runs them for you.",
    Icon: AlertTriangle,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-600',
  },
  'not-eligible': {
    headline: 'Class MA is probably not the route.',
    body: "Something in your answers rules out Class MA permitted development. That does not mean the scheme is dead; full planning may still work. A feasibility tells you which route, if any, stacks up.",
    Icon: XCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-600',
  },
};

export const EligibilityChecker: React.FC = () => {
  const { openModal } = useFeasibility();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentStep = QUESTIONS.findIndex((q) => !answers[q.key]);
  const isDone = currentStep === -1;
  const totalSteps = QUESTIONS.length;
  const progress = isDone ? totalSteps : currentStep;

  const select = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const restart = () => setAnswers({});

  return (
    <section className="bg-thistle-white py-fl-section px-fl-margin">
      <div className="max-w-[800px] mx-auto">
        {!isDone && (
          <Reveal>
            <div className="bg-white rounded-2xl border border-thistle-black/[0.06] p-fl-7">
              <div className="flex items-center justify-between gap-fl-4 mb-fl-5">
                <span className="text-[11px] uppercase tracking-[0.2em] text-thistle-green font-semibold">
                  Question {progress + 1} of {totalSteps}
                </span>
                <div className="flex-1 max-w-[180px] h-1.5 bg-thistle-black/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-thistle-green transition-all duration-300"
                    style={{ width: `${(progress / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
              <h3 className="text-fluid-h4 font-medium tracking-tight leading-tight text-thistle-black mb-fl-6">
                {QUESTIONS[currentStep].prompt}
              </h3>
              <div className="flex flex-col gap-fl-3">
                {QUESTIONS[currentStep].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => select(QUESTIONS[currentStep].key, opt.value)}
                    className="text-left px-fl-5 py-fl-4 rounded-xl border border-thistle-black/[0.08] hover:border-thistle-green/40 hover:bg-thistle-green/[0.04] transition-all duration-200"
                  >
                    <span className="text-fluid-base text-thistle-black/80">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {isDone && (() => {
          const verdict = computeVerdict(answers);
          const copy = VERDICT_COPY[verdict];
          const Icon = copy.Icon;
          return (
            <Reveal>
              <div className={`rounded-2xl border ${copy.border} ${copy.bg} p-fl-7`}>
                <div className={`flex items-center gap-fl-3 mb-fl-5 ${copy.text}`}>
                  <Icon size={28} />
                  <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">Verdict</span>
                </div>
                <h3 className="text-fluid-h3 font-medium tracking-tight leading-tight text-thistle-black mb-fl-4">
                  {copy.headline}
                </h3>
                <p className="text-fluid-base text-thistle-black/80 leading-relaxed mb-fl-6 max-w-2xl">
                  {copy.body}
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-fl-4">
                  <Button variant="primary" icon={<ArrowUpRight size={16} />} onClick={openModal}>
                    Start Feasibility
                  </Button>
                  <button
                    onClick={restart}
                    className="inline-flex items-center gap-2 text-sm text-thistle-black/60 hover:text-thistle-black transition-colors font-medium tracking-tight"
                  >
                    <RotateCcw size={14} /> Start over
                  </button>
                </div>
              </div>
            </Reveal>
          );
        })()}
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add sections/tools/EligibilityChecker.tsx
git commit -m "feat: add Class MA EligibilityChecker"
```

---

## Task 4: GDVCalculator

**Files:**
- Create: `sections/tools/GDVCalculator.tsx`

- [ ] **Step 1: Create the file with this exact content**

```tsx
"use client";

import React, { useState, useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../../components/animations/Reveal';
import { Button } from '../../components/ui/Button';
import { useFeasibility } from '../../components/feasibility/FeasibilityContext';

export type ViabilityBand = 'marginal' | 'viable' | 'strong';

export interface ViabilityInputs {
  purchasePrice: number;
  floorAreaSqm: number;
  unitCount: number;
  avgSalePerUnit: number;
  buildCostPerSqm: number;
}

export interface ViabilityResult {
  gdv: number;
  totalCost: number;
  marginPounds: number;
  marginPct: number;
  band: ViabilityBand;
}

// Pure helper: turns inputs into a result. Band thresholds: under 10% margin
// is marginal, 10 to 25% is viable, over 25% is strong.
export function computeViability(inputs: ViabilityInputs): ViabilityResult {
  const gdv = inputs.unitCount * inputs.avgSalePerUnit;
  const totalCost = inputs.purchasePrice + inputs.buildCostPerSqm * inputs.floorAreaSqm;
  const marginPounds = gdv - totalCost;
  const marginPct = totalCost > 0 ? (marginPounds / totalCost) * 100 : 0;
  const band: ViabilityBand = marginPct < 10 ? 'marginal' : marginPct < 25 ? 'viable' : 'strong';
  return { gdv, totalCost, marginPounds, marginPct, band };
}

const DEFAULTS: ViabilityInputs = {
  purchasePrice: 1_400_000,
  floorAreaSqm: 1_100,
  unitCount: 12,
  avgSalePerUnit: 290_000,
  buildCostPerSqm: 1_800,
};

const BAND_COPY: Record<ViabilityBand, { label: string; body: string; bg: string; text: string }> = {
  marginal: {
    label: 'Marginal',
    body: 'Margin under 10%. The deal is fragile, since small cost overruns or sale-price misses could wipe it. A feasibility runs comparables and a real risk register so you know what you are actually buying.',
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-600',
  },
  viable: {
    label: 'Viable',
    body: 'Margin between 10 and 25%. The deal looks workable on paper. A feasibility confirms the GDV against local comparables and pressure-tests the build cost.',
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-600',
  },
  strong: {
    label: 'Strong',
    body: 'Margin over 25%. The numbers look strong, which usually means either you have a real edge, or one of your inputs is optimistic. A feasibility tells you which.',
    bg: 'bg-thistle-green/[0.08] border-thistle-green/30',
    text: 'text-thistle-green',
  },
};

const formatGBP = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `£${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `£${(n / 1_000).toFixed(0)}k`;
  return `£${Math.round(n).toLocaleString('en-GB')}`;
};

interface NumberInputProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  step: number;
  onChange: (n: number) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, value, prefix, suffix, step, onChange }) => (
  <label className="block">
    <span className="block text-[10px] uppercase tracking-widest text-thistle-black/40 font-semibold mb-fl-2">{label}</span>
    <div className="flex items-center rounded-xl border border-thistle-black/[0.08] bg-white overflow-hidden focus-within:border-thistle-green/50 transition-colors">
      {prefix && <span className="pl-fl-4 text-thistle-black/40 text-sm">{prefix}</span>}
      <input
        type="number"
        value={value}
        step={step}
        min={0}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          onChange(Number.isFinite(n) ? n : 0);
        }}
        className="flex-1 py-fl-4 px-fl-4 bg-transparent text-fluid-base text-thistle-black focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {suffix && <span className="pr-fl-4 text-thistle-black/40 text-sm">{suffix}</span>}
    </div>
  </label>
);

const OutputRow: React.FC<{ label: string; value: string; accent?: boolean }> = ({ label, value, accent }) => (
  <div className="flex items-baseline justify-between gap-fl-4 pb-fl-3 border-b border-thistle-black/[0.05] last:border-b-0 last:pb-0">
    <span className="text-fluid-sm text-thistle-black/60">{label}</span>
    <span className={`text-fluid-h5 font-medium tracking-tight tabular-nums ${accent ? 'text-thistle-green' : 'text-thistle-black'}`}>
      {value}
    </span>
  </div>
);

export const GDVCalculator: React.FC = () => {
  const { openModal } = useFeasibility();
  const [inputs, setInputs] = useState<ViabilityInputs>(DEFAULTS);
  const result = useMemo(() => computeViability(inputs), [inputs]);
  const bandCopy = BAND_COPY[result.band];

  const update = (key: keyof ViabilityInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="bg-thistle-white py-fl-section px-fl-margin">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-fl-7">
          <Reveal>
            <div className="bg-white rounded-2xl border border-thistle-black/[0.06] p-fl-7">
              <h3 className="text-fluid-h5 font-medium tracking-tight text-thistle-black mb-fl-5">Your numbers</h3>
              <div className="flex flex-col gap-fl-5">
                <NumberInput label="Purchase price" value={inputs.purchasePrice} prefix="£" step={10000} onChange={(n) => update('purchasePrice', n)} />
                <NumberInput label="Floor area" value={inputs.floorAreaSqm} suffix="sqm" step={50} onChange={(n) => update('floorAreaSqm', n)} />
                <NumberInput label="Number of units" value={inputs.unitCount} step={1} onChange={(n) => update('unitCount', n)} />
                <NumberInput label="Average sale per unit" value={inputs.avgSalePerUnit} prefix="£" step={5000} onChange={(n) => update('avgSalePerUnit', n)} />
                <NumberInput label="Build cost per sqm" value={inputs.buildCostPerSqm} prefix="£" suffix="/ sqm" step={50} onChange={(n) => update('buildCostPerSqm', n)} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-fl-4 h-full">
              <div className="bg-white rounded-2xl border border-thistle-black/[0.06] p-fl-7">
                <h3 className="text-fluid-h5 font-medium tracking-tight text-thistle-black mb-fl-5">Projected outcome</h3>
                <div className="space-y-fl-4">
                  <OutputRow label="Projected GDV" value={formatGBP(result.gdv)} />
                  <OutputRow label="Total cost (purchase + build)" value={formatGBP(result.totalCost)} />
                  <OutputRow label="Margin" value={formatGBP(result.marginPounds)} />
                  <OutputRow label="Margin %" value={`${result.marginPct.toFixed(1)}%`} accent />
                </div>
              </div>

              <div className={`rounded-2xl border ${bandCopy.bg} p-fl-6`}>
                <span className={`block text-[10px] uppercase tracking-widest font-semibold mb-fl-3 ${bandCopy.text}`}>{bandCopy.label}</span>
                <p className="text-fluid-sm text-thistle-black/80 leading-relaxed mb-fl-5">
                  {bandCopy.body}
                </p>
                <Button variant="primary" icon={<ArrowUpRight size={16} />} onClick={openModal}>
                  Start Feasibility
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add sections/tools/GDVCalculator.tsx
git commit -m "feat: add GDV viability calculator"
```

---

## Task 5: Tools index view

**Files:**
- Create: `views/ToolsIndexPage.tsx`

- [ ] **Step 1: Create the file with this exact content**

```tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ListChecks, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/animations/Reveal';
import { Button } from '../components/ui/Button';
import { useFeasibility } from '../components/feasibility/FeasibilityContext';
import { tools } from '../data/toolsData';

const ICONS = {
  ListChecks,
  Calculator,
} as const;

export const ToolsIndexPage: React.FC = () => {
  const { openModal } = useFeasibility();

  return (
    <>
      <PageHero
        label="Free Tools"
        heading="Test A Building Before You Bid."
        description="Quick checks for the decisions developers make first. Free, no email required, every result links into a real feasibility."
      >
        <Button variant="primary" icon={<ArrowUpRight size={16} />} onClick={openModal}>
          Start Feasibility
        </Button>
      </PageHero>

      <section className="bg-thistle-white py-fl-section px-fl-margin">
        <div className="max-w-[1000px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-fl-5">
            {tools.map((tool, i) => {
              const Icon = ICONS[tool.iconName];
              return (
                <Reveal key={tool.slug} delay={i * 0.1}>
                  <Link href={tool.path} className="block group h-full">
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="bg-white rounded-2xl border border-thistle-black/[0.06] hover:border-thistle-green/30 hover:shadow-lg hover:shadow-thistle-green/5 p-fl-7 transition-all duration-300 h-full flex flex-col"
                    >
                      <div className="w-12 h-12 rounded-xl bg-thistle-green/10 flex items-center justify-center mb-fl-5">
                        <Icon size={22} className="text-thistle-green" />
                      </div>
                      <h3 className="text-fluid-h4 font-medium tracking-tight text-thistle-black mb-fl-3">{tool.label}</h3>
                      <p className="text-fluid-base text-thistle-black/80 leading-relaxed mb-fl-5 flex-1">{tool.summary}</p>
                      <span className="inline-flex items-center gap-2 text-fluid-sm text-thistle-black font-medium">
                        Try it <ArrowUpRight size={16} />
                      </span>
                    </motion.div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-fl-section px-fl-margin bg-white">
        <div className="max-w-[1360px] mx-auto text-center">
          <Reveal>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-5">
              Useful, But Not The Answer.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-fluid-base text-thistle-black/80 leading-relaxed max-w-md mx-auto mb-fl-6">
              The tools narrow the field. A feasibility tells you, with evidence, whether to bid.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Button variant="primary" size="lg" icon={<ArrowUpRight size={18} />} onClick={openModal}>
              Start Feasibility
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
};
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add views/ToolsIndexPage.tsx
git commit -m "feat: add Tools index page view"
```

---

## Task 6: Per-tool page views

**Files:**
- Create: `views/tools/ClassMACheckerPage.tsx`
- Create: `views/tools/GDVCalculatorPage.tsx`

- [ ] **Step 1: Create `views/tools/ClassMACheckerPage.tsx`**

```tsx
"use client";

import React from 'react';
import { ToolShell } from '../../components/ui/ToolShell';
import { EligibilityChecker } from '../../sections/tools/EligibilityChecker';
import { getToolBySlug } from '../../data/toolsData';

const tool = getToolBySlug('class-ma-checker');

export const ClassMACheckerPage: React.FC = () => {
  if (!tool) throw new Error('class-ma-checker tool missing from toolsData');
  return (
    <ToolShell
      tool={tool}
      heroHeading="Class MA: Does Your Building Qualify?"
      heroDescription="Six quick questions to screen your building against the main Class MA prior-approval tests. Around two minutes."
      disclaimer="This screener is a quick check, not a planning determination. A full feasibility is the final word."
    >
      <EligibilityChecker />
    </ToolShell>
  );
};
```

- [ ] **Step 2: Create `views/tools/GDVCalculatorPage.tsx`**

```tsx
"use client";

import React from 'react';
import { ToolShell } from '../../components/ui/ToolShell';
import { GDVCalculator } from '../../sections/tools/GDVCalculator';
import { getToolBySlug } from '../../data/toolsData';

const tool = getToolBySlug('gdv-calculator');

export const GDVCalculatorPage: React.FC = () => {
  if (!tool) throw new Error('gdv-calculator tool missing from toolsData');
  return (
    <ToolShell
      tool={tool}
      heroHeading="Do The Numbers Stack Up?"
      heroDescription="A quick back-of-envelope viability check. Five inputs, live outputs, sensible defaults to start."
      disclaimer="Indicative numbers only. A real feasibility models comparables, voids, and risk."
    >
      <GDVCalculator />
    </ToolShell>
  );
};
```

- [ ] **Step 3: Type-check + commit**

```bash
npx tsc --noEmit
git add views/tools/ClassMACheckerPage.tsx views/tools/GDVCalculatorPage.tsx
git commit -m "feat: add per-tool page views"
```

---

## Task 7: Three Next.js routes

**Files:**
- Create: `src/app/tools/page.tsx`
- Create: `src/app/tools/class-ma-checker/page.tsx`
- Create: `src/app/tools/gdv-calculator/page.tsx`

- [ ] **Step 1: Create `src/app/tools/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { ToolsIndexPage } from '@/views/ToolsIndexPage';

export const metadata: Metadata = {
  title: 'Free Tools | Thistle Architecture',
  description: 'Free conversion-feasibility tools: a Class MA eligibility checker and a GDV viability calculator. Quick checks for property developers.',
};

export default function Page() {
  return <ToolsIndexPage />;
}
```

- [ ] **Step 2: Create `src/app/tools/class-ma-checker/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { ClassMACheckerPage } from '@/views/tools/ClassMACheckerPage';
import { getToolBySlug } from '@/data/toolsData';

const tool = getToolBySlug('class-ma-checker');

export const metadata: Metadata = tool
  ? { title: tool.metaTitle, description: tool.metaDescription }
  : { title: 'Class MA Eligibility Checker | Thistle Architecture' };

export default function Page() {
  return <ClassMACheckerPage />;
}
```

- [ ] **Step 3: Create `src/app/tools/gdv-calculator/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { GDVCalculatorPage } from '@/views/tools/GDVCalculatorPage';
import { getToolBySlug } from '@/data/toolsData';

const tool = getToolBySlug('gdv-calculator');

export const metadata: Metadata = tool
  ? { title: tool.metaTitle, description: tool.metaDescription }
  : { title: 'GDV & Viability Calculator | Thistle Architecture' };

export default function Page() {
  return <GDVCalculatorPage />;
}
```

- [ ] **Step 4: Type-check and build**

```bash
npx tsc --noEmit
npm run build
```

The build must succeed and the route list must include `/tools`, `/tools/class-ma-checker`, and `/tools/gdv-calculator` as static entries.

- [ ] **Step 5: Commit**

```bash
git add 'src/app/tools/page.tsx' 'src/app/tools/class-ma-checker/page.tsx' 'src/app/tools/gdv-calculator/page.tsx'
git commit -m "feat: add /tools index and tool routes"
```

---

## Task 8: Sweep + final verification

**Files:**
- Modify: `scripts/responsive-sweep.mjs`

- [ ] **Step 1: Add the three new tool routes to the sweep's `ROUTES` array**

In `scripts/responsive-sweep.mjs`, the `ROUTES` array currently includes the conversions entries. Find this block:

```js
  { slug: "conversions-hmo",         path: "/conversions/hmo" },
  { slug: "about",               path: "/about" },
```

Insert three new entries between them so the section reads:

```js
  { slug: "conversions-hmo",         path: "/conversions/hmo" },
  { slug: "tools-index",         path: "/tools" },
  { slug: "tools-class-ma",      path: "/tools/class-ma-checker" },
  { slug: "tools-gdv",           path: "/tools/gdv-calculator" },
  { slug: "about",               path: "/about" },
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add scripts/responsive-sweep.mjs
git commit -m "chore: add Tools pages to responsive sweep"
```

- [ ] **Step 3: Final responsive verification (controller, not subagent)**

This step is performed by the controller after the commit lands:

1. Start the dev server in the background: `npm run dev`. Poll `curl http://localhost:3000/tools` until it returns 200.
2. Run `npm run sweep`. Confirm each of the three new tool routes logs `OK <viewport> tools-*` for all five viewports.
3. Run `RESPONSIVE_ORIGIN=http://localhost:3000 ROUTE=/tools npm run probe`. Confirm `bodyScrollW === bodyClientW` at every viewport. Repeat for `/tools/class-ma-checker` and `/tools/gdv-calculator`.
4. Manually verify interactivity by opening `http://localhost:3000/tools/class-ma-checker` and clicking through the six questions (confirm the verdict card appears), then `http://localhost:3000/tools/gdv-calculator` and editing one of the inputs (confirm the outputs update live).
5. Open one screenshot per page (mobile-375 mid and desktop-1440 mid) and confirm hero, card grid/checker/calculator, disclaimer, and closing CTA all render cleanly.
6. Stop the dev server.

---

## Self-Review

**Spec coverage:** Checked against `docs/superpowers/specs/2026-05-15-tools-section-design.md`.
- §2 page structures (index card grid; Class MA checker page; GDV calculator page; each with hero, body, disclaimer, closing CTA) — Tasks 5, 6, 7 implement them via `ToolsIndexPage`, `ClassMACheckerPage` + `GDVCalculatorPage`, and `ToolShell`.
- §3 component architecture (every named file) — Tasks 1–7 cover each. The pure `computeVerdict` and `computeViability` helpers live inside their respective tool components per the spec.
- §3 data shape (Tool interface with the six fields) — Task 1.
- §3 verdict shapes (named exported types and pure functions) — Tasks 3 (`computeVerdict`, `EligibilityVerdict`) and 4 (`computeViability`, `ViabilityBand`, `ViabilityInputs`, `ViabilityResult`).
- §4 content rules (UK English, no em/en dashes, Grade 7) — all new copy audited; "and" or "to" used in place of dashes.
- §5 SEO (per-route metadata, no dynamic params) — Task 7.
- §6 quality bar (responsive sweep + overflow probe + interactive check) — Task 8.
- §7 out of scope respected (no third tool, no live planning lookup, no email capture, no homepage banner, no Navbar changes).

**Placeholder scan:** No "TBD"/"TODO". All file contents are complete and final.

**Type consistency:**
- `Tool` defined in Task 1 with `iconName: 'ListChecks' | 'Calculator'`, consumed in Task 5 (`ToolsIndexPage` uses the same `ICONS` keyed by those exact strings) and Task 2 (`ToolShell` takes a `Tool`).
- `EligibilityVerdict` defined and exported in Task 3, consumed only inside the same file.
- `ViabilityBand`/`ViabilityInputs`/`ViabilityResult` defined and exported in Task 4, consumed only inside the same file.
- `getToolBySlug` defined in Task 1, called with the literal slug strings `'class-ma-checker'` and `'gdv-calculator'` in Tasks 6 and 7 — matches the two slugs in Task 1's `tools` array exactly.
- Route metadata in Task 7 gracefully handles `tool` being `undefined` (defensive, even though it cannot happen in practice) so TypeScript does not require `!` non-null assertions.
