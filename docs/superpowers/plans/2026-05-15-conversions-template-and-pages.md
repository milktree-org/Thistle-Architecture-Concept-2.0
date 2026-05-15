# Conversions Template And Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/conversions/[type]` template plus the three initial conversion pages (commercial-to-residential, office-to-resi-class-ma, hmo), with a Conversions dropdown added to the navbar.

**Architecture:** One shared `ConversionPage` view driven by a per-type record from `data/conversionsData.ts`. Four small section components handle each block of the page. A Next.js dynamic route at `src/app/conversions/[type]/page.tsx` exports `generateStaticParams` and `generateMetadata` so all three pages are statically pre-rendered with their own SEO. The Navbar swaps the "About" top-level slot for a Conversions dropdown surfacing the three paths.

**Tech Stack:** Next.js 16 App Router (sync `params` signature matches existing dynamic routes), React 18, TypeScript, Tailwind CSS v3.4, framer-motion v11, lucide-react.

**Verification model:** No unit-test harness. Per task: `npx tsc --noEmit`. Final task: also `npm run build` (all three new routes present), the responsive sweep with the three new paths added, and a body-overflow probe on each.

---

## File Structure

| File | Responsibility |
|---|---|
| `data/conversionsData.ts` (create) | Types + 3 conversion records + `getConversion(slug)` helper. |
| `sections/conversions/Opportunity.tsx` (create) | Opportunity copy + 3 stat cards. |
| `sections/conversions/Challenges.tsx` (create) | 3-4 challenge items as a vertical list. |
| `sections/conversions/HowThistleSolves.tsx` (create) | Type-specific deliverable highlights, zipping `deliverables` with the conversion's highlights. |
| `sections/conversions/RelatedCaseStudy.tsx` (create) | One case-study card looked up by slug. Returns `null` for missing slugs. |
| `views/ConversionPage.tsx` (create) | Shared page view composing the above. |
| `src/app/conversions/[type]/page.tsx` (create) | Next.js dynamic route. `generateStaticParams` + `generateMetadata` + render. |
| `components/ui/Navbar.tsx` (modify) | Replace the "About" link with a "Conversions" dropdown listing the three paths. Update mobile drawer accordingly. |
| `scripts/responsive-sweep.mjs` (modify) | Add the three new conversion routes to the `ROUTES` array. |

---

## Task 1: Conversions content data

**Files:**
- Create: `data/conversionsData.ts`

- [ ] **Step 1: Create `data/conversionsData.ts`**

Create the file with EXACTLY this content:

```ts
export interface ConversionStat {
  label: string;
  value: string;
}

export interface ConversionChallenge {
  title: string;
  detail: string;
}

export interface DeliverableHighlight {
  deliverableIndex: number; // 0..5, index into deliverables in data/howItWorksData.ts
  forThisType: string;
}

export interface Conversion {
  slug: string;
  label: string;
  heroHeading: string;
  heroDescription: string;
  opportunityCopy: string;
  opportunityStats: ConversionStat[];
  challenges: ConversionChallenge[];
  deliverableHighlights: DeliverableHighlight[];
  relatedCaseStudySlug?: string;
  metaTitle: string;
  metaDescription: string;
}

export const conversions: Conversion[] = [
  {
    slug: "commercial-to-residential",
    label: "Commercial to Residential",
    heroHeading: "Turn A Commercial Building Into Viable Homes.",
    heroDescription: "A feasibility built for developers buying offices, retail upper parts, and small commercial blocks to convert into housing.",
    opportunityCopy: "Commercial-to-residential conversions are the fastest route from a tired commercial asset to a stabilised residential scheme. Less risk than ground-up, faster than full redevelopment, and supported by national permitted-development rights.",
    opportunityStats: [
      { label: "Typical unit yield", value: "6 to 14" },
      { label: "Planning route", value: "Class MA or full" },
      { label: "Typical GDV uplift", value: "+80% to +150%" },
    ],
    challenges: [
      { title: "Building Regs and fire compliance", detail: "Office and retail buildings often need significant work to meet residential Building Regulations, especially around fire compartmentation and means of escape." },
      { title: "Daylight to lower floors", detail: "Deep commercial floor plates can leave ground-floor or rear-facing units short of daylight, which tanks the scheme on planning and on resale." },
      { title: "Hidden structural costs", detail: "Removing walls, adding bathrooms, and routing services through a commercial structure can add cost that the headline GDV does not reveal." },
    ],
    deliverableHighlights: [
      { deliverableIndex: 0, forThisType: "Tested against the building's real structural grid and core positions, not an assumed plan." },
      { deliverableIndex: 2, forThisType: "Class MA eligibility, Article 4 directions, conservation, and noise mapping covered before you bid." },
      { deliverableIndex: 3, forThisType: "Every conversion risk named and costed, so the deal model reflects reality." },
      { deliverableIndex: 5, forThisType: "Net-to-gross checked carefully, since commercial-to-resi often loses more area than developers expect." },
    ],
    relatedCaseStudySlug: "reading-high-street",
    metaTitle: "Commercial to Residential Feasibility | Thistle Architecture",
    metaDescription: "Data-driven feasibility for converting commercial buildings into residential schemes. Five-day turnaround, fixed fee, clear Go or No-Go.",
  },
  {
    slug: "office-to-resi-class-ma",
    label: "Office to Resi (Class MA)",
    heroHeading: "Class MA Feasibility, In Five Days.",
    heroDescription: "Office-to-residential conversion is the most-used permitted development route in the country. A clear-eyed feasibility on whether your building qualifies, and what it can become.",
    opportunityCopy: "Class MA gives you a permitted-development route from office to residential without going through full planning. It is fast and predictable, but only when the building genuinely qualifies, and many do not pass the prior-approval tests.",
    opportunityStats: [
      { label: "Decision window", value: "8 weeks" },
      { label: "Planning route", value: "Class MA prior approval" },
      { label: "Floor-space cap", value: "1,500 sqm" },
    ],
    challenges: [
      { title: "Prior-approval traps", detail: "Daylight, noise, flooding, and intended use can all torpedo a Class MA application. We screen against every test before you commit." },
      { title: "Floor-space limits", detail: "Class MA caps at 1,500 sqm of new residential floorspace. Larger buildings need a different route, or partial conversion, or full planning." },
      { title: "Article 4 directions", detail: "Many local authorities have removed Class MA permitted-development rights in specific areas. A property in the wrong borough loses the route entirely." },
    ],
    deliverableHighlights: [
      { deliverableIndex: 2, forThisType: "Article 4 status, conservation, listed-building, and prior-approval test screening surfaced at the desk study." },
      { deliverableIndex: 0, forThisType: "Layouts that meet NDSS without relying on daylight from windows you cannot install." },
      { deliverableIndex: 4, forThisType: "A clear answer on whether Class MA is the right route, or whether full planning beats it." },
      { deliverableIndex: 3, forThisType: "Every prior-approval risk costed, so you know the headroom before you exchange." },
    ],
    relatedCaseStudySlug: "croydon-office-conversion",
    metaTitle: "Office to Resi Class MA Feasibility | Thistle Architecture",
    metaDescription: "Class MA office-to-residential feasibility. Prior-approval screening, layout testing, and a clear Go or No-Go in five days, for a fixed fee.",
  },
  {
    slug: "hmo",
    label: "HMO",
    heroHeading: "HMO Feasibility, Without The Guesswork.",
    heroDescription: "Houses of multiple occupation work on tight margins. A feasibility that pressure-tests density, licensing, and layout before you put in an offer.",
    opportunityCopy: "HMO conversions deliver strong yield in the right area, but Article 4 directions, density caps, and licensing thresholds can quietly kill a deal before it starts. The numbers only stack up when the regulatory picture is genuinely clear.",
    opportunityStats: [
      { label: "Typical room count", value: "5 to 9" },
      { label: "Planning route", value: "Full or Class C4" },
      { label: "Typical yield", value: "8% to 12%" },
    ],
    challenges: [
      { title: "Density and Article 4", detail: "Local HMO density caps and Article 4 directions vary borough by borough. The right address can sail through, the wrong one is blocked entirely." },
      { title: "Licensing thresholds", detail: "Mandatory, additional, and selective licensing schemes overlap unpredictably. Each adds cost, time, and standards the conversion must meet." },
      { title: "Space-standard compliance", detail: "HMO room sizes are tightly regulated. A scheme that looks viable on a brochure plan often fails the minimum-area tests for habitable rooms." },
    ],
    deliverableHighlights: [
      { deliverableIndex: 2, forThisType: "HMO density saturation, Article 4 exposure, and licensing scheme overlap mapped at desk-study stage." },
      { deliverableIndex: 0, forThisType: "Room layouts checked against HMO minimum sizes and amenity standards, not just optimistic plans." },
      { deliverableIndex: 3, forThisType: "Licensing costs, planning risks, and standards-compliance gaps each costed and ranked." },
      { deliverableIndex: 5, forThisType: "Net-to-gross and per-room yield projections benchmarked against local market data." },
    ],
    metaTitle: "HMO Feasibility | Thistle Architecture",
    metaDescription: "HMO conversion feasibility. Density, Article 4, licensing, and layout pressure-tested in five days. Fixed fee, clear Go or No-Go.",
  },
];

export const getConversion = (slug: string): Conversion | undefined =>
  conversions.find((c) => c.slug === slug);
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (passes).

- [ ] **Step 3: Commit**

```bash
git add data/conversionsData.ts
git commit -m "feat: add Conversions content data"
```

---

## Task 2: Opportunity section

**Files:**
- Create: `sections/conversions/Opportunity.tsx`

- [ ] **Step 1: Create `sections/conversions/Opportunity.tsx`**

Create with EXACTLY this content:

```tsx
"use client";

import React from 'react';
import { Reveal } from '../../components/animations/Reveal';
import type { ConversionStat } from '../../data/conversionsData';

interface OpportunityProps {
  copy: string;
  stats: ConversionStat[];
}

// The opportunity section: short framing copy plus three stat cards.
export const Opportunity: React.FC<OpportunityProps> = ({ copy, stats }) => (
  <section className="bg-white py-fl-section px-fl-margin">
    <div className="max-w-[1000px] mx-auto">
      <div className="text-center mb-fl-8 max-w-2xl mx-auto">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">The Opportunity</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-fluid-base text-thistle-black/80 leading-relaxed">
            {copy}
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-fl-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-thistle-white rounded-2xl border border-thistle-black/[0.06] p-fl-6 text-center">
              <span className="block text-[10px] uppercase tracking-widest text-thistle-green font-semibold mb-fl-3">{s.label}</span>
              <span className="block text-fluid-h3 font-medium tracking-tight text-thistle-black leading-none">{s.value}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add sections/conversions/Opportunity.tsx
git commit -m "feat: add Conversions Opportunity section"
```

---

## Task 3: Challenges section

**Files:**
- Create: `sections/conversions/Challenges.tsx`

- [ ] **Step 1: Create `sections/conversions/Challenges.tsx`**

Create with EXACTLY this content:

```tsx
"use client";

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Reveal } from '../../components/animations/Reveal';
import type { ConversionChallenge } from '../../data/conversionsData';

interface ChallengesProps {
  typeLabel: string;
  challenges: ConversionChallenge[];
}

// Type-specific challenges as a vertical list with a small warning indicator.
export const Challenges: React.FC<ChallengesProps> = ({ typeLabel, challenges }) => (
  <section className="bg-thistle-white py-fl-section px-fl-margin">
    <div className="max-w-[1000px] mx-auto">
      <div className="text-center mb-fl-8 max-w-2xl mx-auto">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">What Is Hard</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
            The Risks Unique To<br /><span className="text-thistle-green">{typeLabel}.</span>
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <ul className="rounded-2xl border border-thistle-black/[0.06] bg-white overflow-hidden">
          {challenges.map((c, i) => (
            <li key={i} className={`flex items-start gap-fl-4 px-fl-6 py-fl-5 ${i < challenges.length - 1 ? 'border-b border-thistle-black/[0.06]' : ''}`}>
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={16} className="text-amber-500" />
              </div>
              <div>
                <h3 className="text-fluid-h6 font-medium tracking-tight text-thistle-black mb-fl-2">{c.title}</h3>
                <p className="text-fluid-base text-thistle-black/70 leading-relaxed">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  </section>
);
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add sections/conversions/Challenges.tsx
git commit -m "feat: add Conversions Challenges section"
```

---

## Task 4: HowThistleSolves section

**Files:**
- Create: `sections/conversions/HowThistleSolves.tsx`

- [ ] **Step 1: Create `sections/conversions/HowThistleSolves.tsx`**

Create with EXACTLY this content:

```tsx
"use client";

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Reveal } from '../../components/animations/Reveal';
import { deliverables } from '../../data/howItWorksData';
import type { DeliverableHighlight } from '../../data/conversionsData';

interface HowThistleSolvesProps {
  typeLabel: string;
  highlights: DeliverableHighlight[];
}

// Type-specific deliverable highlights. For each highlight, render a card with
// the deliverable's canonical title and description (from howItWorksData) plus
// the per-type "for this type" framing line (from the conversion record).
export const HowThistleSolves: React.FC<HowThistleSolvesProps> = ({ typeLabel, highlights }) => (
  <section className="bg-white py-fl-section px-fl-margin">
    <div className="max-w-[1360px] mx-auto">
      <div className="text-center mb-fl-8 max-w-2xl mx-auto">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">How We Solve It</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
            Built For<br /><span className="text-thistle-green">{typeLabel}.</span>
          </h2>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-fl-4">
        {highlights.map((h, i) => {
          const deliverable = deliverables[h.deliverableIndex];
          if (!deliverable) return null;
          return (
            <Reveal key={i} delay={i * 0.08}>
              <div className="bg-thistle-white rounded-2xl border border-thistle-black/[0.06] p-fl-6 h-full flex flex-col">
                <div className="flex items-center gap-fl-3 mb-fl-4">
                  <div className="w-9 h-9 rounded-xl bg-thistle-green/10 flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-thistle-green" />
                  </div>
                  <h3 className="text-fluid-h6 font-medium tracking-tight text-thistle-black">{deliverable.title}</h3>
                </div>
                <p className="text-fluid-base text-thistle-black/80 leading-relaxed mb-fl-4">
                  {deliverable.desc}
                </p>
                <p className="text-fluid-sm text-thistle-black/55 leading-relaxed mt-auto pt-fl-4 border-t border-thistle-black/[0.06]">
                  {h.forThisType}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add sections/conversions/HowThistleSolves.tsx
git commit -m "feat: add Conversions HowThistleSolves section"
```

---

## Task 5: RelatedCaseStudy section

**Files:**
- Create: `sections/conversions/RelatedCaseStudy.tsx`

- [ ] **Step 1: Create `sections/conversions/RelatedCaseStudy.tsx`**

Create with EXACTLY this content:

```tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../../components/animations/Reveal';
import { caseStudies } from '../../data/caseStudiesData';

interface RelatedCaseStudyProps {
  slug?: string;
}

// A single case-study feature card looked up by slug. Returns null when the
// slug is missing or does not match any case so the page degrades cleanly.
export const RelatedCaseStudy: React.FC<RelatedCaseStudyProps> = ({ slug }) => {
  if (!slug) return null;
  const item = caseStudies.find((c) => c.slug === slug);
  if (!item) return null;

  return (
    <section className="bg-thistle-white py-fl-section px-fl-margin">
      <div className="max-w-[1360px] mx-auto">
        <div className="text-center mb-fl-8 max-w-2xl mx-auto">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">A Real Project</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
              We Have Done This Before.
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <Link href={`/case-studies/${item.slug}`} className="block">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden bg-white border border-thistle-black/[0.06] hover:border-thistle-black/[0.12] hover:shadow-xl hover:shadow-thistle-black/[0.04] transition-all duration-500"
            >
              <div className="aspect-[4/3] lg:aspect-auto overflow-hidden relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 text-[10px] uppercase tracking-widest text-white/80 font-medium">
                    {item.tag}
                  </span>
                </div>
              </div>
              <div className="p-fl-7 flex flex-col justify-center">
                <h3 className="text-fluid-h3 font-medium tracking-tight text-thistle-black mb-fl-2">{item.title}</h3>
                <p className="text-fluid-sm text-thistle-black/50 uppercase tracking-wider mb-fl-5">{item.location}</p>
                <p className="text-fluid-base text-thistle-black/80 leading-relaxed mb-fl-5">{item.desc}</p>
                <span className="inline-flex items-center gap-2 text-fluid-sm text-thistle-black font-medium">
                  Read the full case study <ArrowUpRight size={16} />
                </span>
              </div>
            </motion.div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add sections/conversions/RelatedCaseStudy.tsx
git commit -m "feat: add Conversions RelatedCaseStudy section"
```

---

## Task 6: ConversionPage view

**Files:**
- Create: `views/ConversionPage.tsx`

- [ ] **Step 1: Create `views/ConversionPage.tsx`**

Create with EXACTLY this content:

```tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/animations/Reveal';
import { Button } from '../components/ui/Button';
import { useFeasibility } from '../components/feasibility/FeasibilityContext';
import { FAQ } from '../sections/FAQ';
import { Opportunity } from '../sections/conversions/Opportunity';
import { Challenges } from '../sections/conversions/Challenges';
import { HowThistleSolves } from '../sections/conversions/HowThistleSolves';
import { RelatedCaseStudy } from '../sections/conversions/RelatedCaseStudy';
import type { Conversion } from '../data/conversionsData';

interface ConversionPageProps {
  conversion: Conversion;
}

export const ConversionPage: React.FC<ConversionPageProps> = ({ conversion }) => {
  const { openModal } = useFeasibility();

  return (
    <>
      <PageHero
        label={conversion.label}
        heading={conversion.heroHeading}
        description={conversion.heroDescription}
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

      <Opportunity copy={conversion.opportunityCopy} stats={conversion.opportunityStats} />

      <Challenges typeLabel={conversion.label} challenges={conversion.challenges} />

      <HowThistleSolves typeLabel={conversion.label} highlights={conversion.deliverableHighlights} />

      <RelatedCaseStudy slug={conversion.relatedCaseStudySlug} />

      {/* Closing CTA */}
      <section className="py-fl-section px-fl-margin bg-white">
        <div className="max-w-[1360px] mx-auto text-center">
          <Reveal>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-5">
              Test This Building.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-fluid-base text-thistle-black/80 leading-relaxed max-w-md mx-auto mb-fl-6">
              Submit your property and get a clear Go or No-Go in five days, for a fixed fee.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Button variant="primary" size="lg" icon={<ArrowUpRight size={18} />} onClick={openModal}>
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

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add views/ConversionPage.tsx
git commit -m "feat: add ConversionPage shared view"
```

---

## Task 7: Dynamic route

**Files:**
- Create: `src/app/conversions/[type]/page.tsx`

- [ ] **Step 1: Create `src/app/conversions/[type]/page.tsx`**

Create the directory `src/app/conversions/[type]/` and the file with EXACTLY this content:

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { conversions, getConversion } from '@/data/conversionsData';
import { ConversionPage } from '@/views/ConversionPage';

export function generateStaticParams() {
  return conversions.map((c) => ({ type: c.slug }));
}

export function generateMetadata({ params }: { params: { type: string } }): Metadata {
  const c = getConversion(params.type);
  return {
    title: c?.metaTitle ?? 'Conversion Feasibility | Thistle Architecture',
    description: c?.metaDescription ?? 'Data-driven feasibility for residential conversions across the UK.',
  };
}

export default function Page({ params }: { params: { type: string } }) {
  const conversion = getConversion(params.type);
  if (!conversion) notFound();
  return <ConversionPage conversion={conversion} />;
}
```

- [ ] **Step 2: Type-check + build verification**

Run: `npx tsc --noEmit`
Expected: no output (passes).

Run: `npm run build`
Expected: build completes successfully, and the route list shows all three conversion paths: `/conversions/commercial-to-residential`, `/conversions/office-to-resi-class-ma`, `/conversions/hmo` (as statically generated entries).

- [ ] **Step 3: Commit**

```bash
git add src/app/conversions/[type]/page.tsx
git commit -m "feat: add /conversions/[type] dynamic route"
```

---

## Task 8: Navbar dropdown

**Files:**
- Modify: `components/ui/Navbar.tsx` (full rewrite of the navLinks structure + rendering for both desktop and mobile)

- [ ] **Step 1: Read the current Navbar to confirm the surrounding structure**

Run: `sed -n '1,30p' components/ui/Navbar.tsx`

Confirm the current `navLinks` is a flat array with four items (Feasibility Package, How It Works, Case Studies, About).

- [ ] **Step 2: Replace the navLinks array and the rendering blocks**

In `components/ui/Navbar.tsx`:

A. Replace the `navLinks` constant near the top of the file with this exact block:

```ts
interface NavItem {
  label: string;
  path: string;
  children?: { label: string; path: string }[];
}

const navLinks: NavItem[] = [
  { label: "Feasibility Package", path: "/feasibility-package" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "Case Studies", path: "/case-studies" },
  {
    label: "Conversions",
    path: "/conversions/commercial-to-residential",
    children: [
      { label: "Commercial to Residential", path: "/conversions/commercial-to-residential" },
      { label: "Office to Resi (Class MA)", path: "/conversions/office-to-resi-class-ma" },
      { label: "HMO", path: "/conversions/hmo" },
    ],
  },
];
```

This both adds the `NavItem` interface and drops the "About" link, replacing the fourth nav slot with the Conversions dropdown.

B. Add this import to the lucide-react import line at the top of the file. The existing import line is:

```ts
import { ArrowUpRight, Menu, X } from 'lucide-react';
```

Change it to:

```ts
import { ArrowUpRight, Menu, X, ChevronDown } from 'lucide-react';
```

C. Replace the desktop nav links rendering block. The current block is:

```tsx
          {/* Centre: Nav Links */}
          <div className="hidden lg:flex items-center justify-center gap-fl-6 text-fluid-sm font-medium text-white/80">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`transition-colors hover:text-white ${pathname.startsWith(link.path) ? 'text-white' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
```

Replace it with this exact block:

```tsx
          {/* Centre: Nav Links */}
          <div className="hidden lg:flex items-center justify-center gap-fl-6 text-fluid-sm font-medium text-white/80">
            {navLinks.map((link) => {
              if (link.children) {
                const active = link.children.some((ch) => pathname.startsWith(ch.path));
                return (
                  <div key={link.path} className="relative group">
                    <Link
                      href={link.path}
                      className={`inline-flex items-center gap-1 transition-colors hover:text-white ${active ? 'text-white' : ''}`}
                    >
                      {link.label}
                      <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
                    </Link>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 hidden group-hover:block">
                      <div className="bg-thistle-black border border-white/10 rounded-xl py-2 min-w-[260px] shadow-lg shadow-black/30">
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            className={`block px-fl-4 py-fl-3 text-sm transition-colors hover:bg-white/[0.05] hover:text-white ${pathname === child.path ? 'text-white' : 'text-white/70'}`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`transition-colors hover:text-white ${pathname.startsWith(link.path) ? 'text-white' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
```

D. Replace the mobile drawer nav-links rendering block. The current block is:

```tsx
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`py-3 px-3 rounded-lg text-lg font-medium border-b border-thistle-black/5 last:border-b-0 ${pathname.startsWith(link.path) ? 'text-thistle-green' : 'text-thistle-black'}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
```

Replace it with this exact block:

```tsx
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <div key={link.path} className="border-b border-thistle-black/5 last:border-b-0">
                    <Link
                      href={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-3 px-3 rounded-lg text-lg font-medium ${pathname.startsWith(link.path) || (link.children && link.children.some((ch) => pathname.startsWith(ch.path))) ? 'text-thistle-green' : 'text-thistle-black'}`}
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="flex flex-col pl-fl-5 pb-fl-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`py-2 text-sm ${pathname === child.path ? 'text-thistle-green' : 'text-thistle-black/70'}`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (passes).

- [ ] **Step 4: Commit**

```bash
git add components/ui/Navbar.tsx
git commit -m "feat: add Conversions dropdown to navbar, move About to footer-only"
```

---

## Task 9: Update sweep + final verification

**Files:**
- Modify: `scripts/responsive-sweep.mjs`

- [ ] **Step 1: Add the three new conversion routes to the sweep's ROUTES array**

In `scripts/responsive-sweep.mjs`, the `ROUTES` array currently looks like:

```js
const ROUTES = [
  { slug: "home",                path: "/" },
  { slug: "how-it-works",        path: "/how-it-works" },
  { slug: "feasibility-package", path: "/feasibility-package" },
  { slug: "case-studies",        path: "/case-studies" },
  { slug: "case-study-detail",   path: "/case-studies/croydon-office-conversion" },
  { slug: "about",               path: "/about" },
  { slug: "blog",                path: "/blog" },
  { slug: "privacy",             path: "/privacy" },
  { slug: "terms",               path: "/terms" },
  { slug: "cookies",             path: "/cookies" },
];
```

Add these three entries right after `case-study-detail`:

```js
  { slug: "conversions-commercial",  path: "/conversions/commercial-to-residential" },
  { slug: "conversions-class-ma",    path: "/conversions/office-to-resi-class-ma" },
  { slug: "conversions-hmo",         path: "/conversions/hmo" },
```

The full updated array reads:

```js
const ROUTES = [
  { slug: "home",                path: "/" },
  { slug: "how-it-works",        path: "/how-it-works" },
  { slug: "feasibility-package", path: "/feasibility-package" },
  { slug: "case-studies",        path: "/case-studies" },
  { slug: "case-study-detail",   path: "/case-studies/croydon-office-conversion" },
  { slug: "conversions-commercial",  path: "/conversions/commercial-to-residential" },
  { slug: "conversions-class-ma",    path: "/conversions/office-to-resi-class-ma" },
  { slug: "conversions-hmo",         path: "/conversions/hmo" },
  { slug: "about",               path: "/about" },
  { slug: "blog",                path: "/blog" },
  { slug: "privacy",             path: "/privacy" },
  { slug: "terms",               path: "/terms" },
  { slug: "cookies",             path: "/cookies" },
];
```

- [ ] **Step 2: Final build verification**

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npm run build`
Expected: build succeeds, the route list shows all three `/conversions/*` paths as static (`●` or `○`) entries, the case-studies route still works.

- [ ] **Step 3: Commit the sweep update**

```bash
git add scripts/responsive-sweep.mjs
git commit -m "chore: add Conversions pages to responsive sweep"
```

- [ ] **Step 4: Visual + responsive verification (controller, not subagent)**

This step is handled by the controller (not by an implementer subagent) after this task is committed. The controller will:

1. Start the dev server in the background: `npm run dev` (wait until ready on `http://localhost:3000`).
2. Run `npm run sweep` and confirm each of the three new conversion routes logs `OK <viewport> conversions-*` for all five viewports.
3. Run `RESPONSIVE_ORIGIN=http://localhost:3000 ROUTE=/conversions/commercial-to-residential npm run probe` and confirm `bodyScrollW === bodyClientW` at every viewport. Repeat for `/conversions/office-to-resi-class-ma` and `/conversions/hmo`.
4. Open one screenshot per page (mobile-375 mid and desktop-1440 mid) and confirm hero + opportunity stats + challenges list + deliverable highlights + (for the two pages with one) related case study + closing CTA + FAQ all render cleanly, and that the navbar shows the new Conversions dropdown.
5. Stop the dev server.

---

## Self-Review

**Spec coverage:** Checked against `docs/superpowers/specs/2026-05-15-conversions-template-and-pages-design.md`.
- §2 page structure (hero, opportunity, challenges, how-we-solve, related case study, CTA, FAQ) — Task 6 (`ConversionPage`) composes all of these, sourcing from Tasks 2–5.
- §3 component architecture (every named file) — Tasks 1–7 cover each.
- §3 data shape — Task 1 matches exactly, including the optional `relatedCaseStudySlug` for the HMO case (no matching case study yet).
- §3 Navbar update — Task 8.
- §4 content rules (UK English, no em/en dashes, Grade 7) — all new copy in Task 1 audited.
- §5 SEO (`generateStaticParams` + `generateMetadata` + `notFound` for unknowns) — Task 7.
- §6 quality bar (responsive sweep + overflow probe) — Task 9 adds the routes; controller runs the sweep.
- §7 out of scope respected (no additional types, no per-type FAQs, no SEO location pages, no changes outside the named files).

**Placeholder scan:** No "TBD"/"TODO". All content is final. The HMO record intentionally omits `relatedCaseStudySlug` — the `RelatedCaseStudy` component returns `null` for missing slugs (Task 5), so the section will simply not render on the HMO page. No code-level placeholders.

**Type consistency:** `ConversionStat`, `ConversionChallenge`, `DeliverableHighlight`, `Conversion` defined in Task 1 and consumed by their respective section components in Tasks 2–5 with matching shapes. `Conversion` is imported by `ConversionPage` (Task 6) and the dynamic route (Task 7). The `relatedCaseStudySlug` field is optional (`?:` in Task 1) and the `RelatedCaseStudy` component (Task 5) accepts an optional `slug?: string` prop accordingly. `deliverableIndex` references valid indices 0–5 into the `deliverables` array (which has six entries), confirmed against `data/howItWorksData.ts`.
