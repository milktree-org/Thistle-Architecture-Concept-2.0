# Thistle Foundation Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce the three foundation artefacts from the site architecture spec — `brief.md`, `design.md`, and the responsive-sweep tooling — so every subsequent page build composes from one written source of truth.

**Architecture:** `brief.md` restates the client brief in structured form. `design.md` is extracted from the *current* homepage code (Tailwind config + CSS variables + the existing component set) so it reflects exactly what is shipped, not memory. The responsive-sweep tooling is three Playwright scripts copied from `PROJECT_SOP.md` Appendix A and adapted to Thistle's route list.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v3.4 (config-based, not v4 `@theme`), TypeScript, Playwright (added in this plan as a dev dependency).

---

## File Structure

| File | Responsibility |
|---|---|
| `brief.md` (create) | Structured restatement of the client brief: positioning, audience, messaging pillars, conversion model |
| `design.md` (create) | The design system spec: colour tokens, type scale, spacing scale, motion, component inventory, copy rules |
| `scripts/responsive-sweep.mjs` (create) | Screenshots every route at five viewports, three scroll positions each |
| `scripts/find-overflow.mjs` (create) | Finds elements that overflow the viewport horizontally |
| `scripts/probe-panel.mjs` (create) | Template script for measuring actual element positions on a route |
| `.gitignore` (modify) | Add `/screenshots/` so sweep output is never committed |
| `package.json` (modify) | Add `playwright` dev dependency and three `npm` script aliases |

---

## Task 1: Write `brief.md`

**Files:**
- Create: `brief.md`

- [ ] **Step 1: Create `brief.md` with the structured brief**

Create `brief.md` with exactly this content:

```markdown
# Thistle Architecture — Brief

## Positioning (non-negotiable)

Thistle is a developer-led, technology-enhanced feasibility platform with architectural delivery.

It is NOT:
- a traditional architecture practice
- a design-led brand

It is a system + service hybrid: the system drives speed and accuracy, architecture validates and delivers.

## Target audience

Primary buyers:
- Property developers
- HMO investors
- Commercial to residential converters
- Land buyers / deal sourcers

Tone must speak to: decision-making, speed, risk reduction, financial outcomes.

## Core messaging pillars

Every page must reinforce:
- Fast (5-day turnaround)
- Data-driven, not opinion-led
- Developer-focused
- National capability
- Retrofit and existing buildings only
- Affordable entry point
- Clear Go / No-Go outcomes

## Key behaviour shift

The site must communicate that this is something you start, not something you enquire about. The primary action everywhere is "Start Feasibility".

## Conversion model

- Canonical primary CTA: "Start Feasibility" (opens the feasibility modal).
- The Contact page is the one exception: it carries its own inline form.
- The feasibility tool/modal is the primary conversion mechanism.

## Reference quality bar

The site should feel like: Resi (clarity) + Searchland (data) + Urbanist (premium).
- https://resi.co.uk/
- https://searchland.co.uk/
- https://urbanistarchitecture.co.uk/

Sister product, same agency, shared visual cues: https://hmochecker.co.uk/

## Visual direction

- Primary background: white / off-white.
- Accent: thistle green (CTAs).
- Secondary accent: thistle purple.
- UI surfaces: light greys for cards and sections.
- Avoid heavy dark backgrounds; limit to occasional contrast sections.
- Product-style components: cards, diagrams, step flows, report previews, layout thumbnails.

## Critical UX requirements

- The CTA appears consistently throughout every page.
- Pages scroll logically: problem, then solution, then proof, then action.
- Avoid large blocks of text.
- Prioritise clarity over design flourishes.

## Status

Phase 1 (homepage) is built and live. This phase covers the rest of the site per
`docs/superpowers/specs/2026-05-14-thistle-site-architecture-design.md`.
```

- [ ] **Step 2: Verify the file**

Run: `test -f brief.md && wc -l brief.md`
Expected: the file exists and reports roughly 70 lines.

- [ ] **Step 3: Commit**

```bash
git add brief.md
git commit -m "docs: add structured brief.md foundation doc"
```

---

## Task 2: Write `design.md`

**Files:**
- Create: `design.md`
- Read first (to verify values are current): `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `components/ui/Button.tsx`, `components/ui/PageHero.tsx`, `components/ui/InlineCTA.tsx`, `components/animations/Reveal.tsx`

- [ ] **Step 1: Read the current source files**

Run: `cat tailwind.config.ts src/app/globals.css` and read `src/app/layout.tsx`, then list the component files: `ls components/ui components/animations sections`.

Expected: confirm the token values below still match. The colour tokens are `thistle-black #2F3B36`, `thistle-white #EDEDE9`, `thistle-pink #DAAEBB`, `thistle-green #8F9952`, `thistle-gray #71776E`. The font is Geist Sans via `--font-geist-sans`. If any value differs from what is written into `design.md` in Step 2, use the value from the source file, not the plan.

- [ ] **Step 2: Create `design.md`**

Create `design.md` with exactly this content:

```markdown
# Thistle Architecture — Design System

The single source of truth for tokens, scale, and components. Extracted from the
shipped homepage code. When code and this document disagree, fix one of them — they
must not drift.

## Stack

- Next.js 16 App Router, React 18.
- Tailwind CSS v3.4, configured in `tailwind.config.ts` (NOT v4 `@theme`).
- Design tokens are CSS custom properties in `src/app/globals.css`, surfaced to
  Tailwind as named utilities in `tailwind.config.ts` under `theme.extend`.
- Motion: `framer-motion` v11.
- Font: Geist Sans, loaded in `src/app/layout.tsx`, exposed as `--font-geist-sans`
  and mapped to the `font-sans` family.

## Colour tokens

Defined in `tailwind.config.ts` as the `thistle` colour group. Use these names only.
Never use Tailwind default palette tokens (`text-red-500`, `bg-slate-100`).

| Token | Hex | Use |
|---|---|---|
| `thistle-black` | #2F3B36 | Body text, dark contrast sections |
| `thistle-white` | #EDEDE9 | Page background, light section surfaces |
| `thistle-green` | #8F9952 | Primary accent, CTAs, eyebrows, active states |
| `thistle-pink` | #DAAEBB | Secondary accent, `::selection`, occasional highlight |
| `thistle-gray` | #71776E | Tertiary text, muted labels |

Opacity steps (e.g. `text-thistle-black/80`, `border-thistle-black/[0.06]`) carry the
tonal range. Body copy on light backgrounds is `/80`; eyebrows and muted labels `/40`.

## Type scale

Fluid `clamp()` sizes, defined as CSS variables in `globals.css`, surfaced as
`text-fluid-*` utilities. Sized for a 320px to 1440px range.

| Utility | Variable | Role |
|---|---|---|
| `text-fluid-display` | `--font-display` | Oversized display only |
| `text-fluid-h1` | `--font-h1` | Page H1 |
| `text-fluid-h2` | `--font-h2` | Section H2 |
| `text-fluid-h3` | `--font-h3` | Sub-section / row title |
| `text-fluid-h4` | `--font-h4` | Card group title |
| `text-fluid-h5` | `--font-h5` | Card title |
| `text-fluid-h6` | `--font-h6` | Small heading (1rem fixed) |
| `text-fluid-lg` | `--font-text-lg` | Lead paragraph |
| `text-fluid-base` | `--font-text-base` | Body copy |
| `text-fluid-sm` | `--font-text-sm` | Small print (0.875rem fixed) |

Headings use `font-medium`, `tracking-tight` or `tracking-tighter`, and
`leading-tight`. Body copy uses `leading-relaxed`.

## Spacing scale

Fluid `clamp()` spacing, defined in `globals.css`, surfaced as `fl-*` utilities.

| Utility | Variable | Typical use |
|---|---|---|
| `fl-section-lg` | `--space-section-lg` | Largest section vertical rhythm |
| `fl-section` | `--space-section` | Default section vertical padding (`py-fl-section`) |
| `fl-section-sm` | `--space-section-sm` | Tighter section / inter-block gap |
| `fl-8` down to `fl-1` | `--space-8` to `--space-1` | Component-level gaps and padding |
| `fl-margin` | `--site-margin` | Site-wide horizontal page margin (`px-fl-margin`) |

Section pattern: every top-level section uses `py-fl-section px-fl-margin`, with an
inner `max-w-[1360px] mx-auto` wrapper.

## Motion

- Library: `framer-motion` v11.
- Primitive: `components/animations/Reveal.tsx` (`Reveal` wrapper, `whileInView`
  fade-and-rise, staggered with a `delay` prop).
- Section graphics use `initial / whileInView` opacity-and-y transitions with the
  easing `[0.21, 0.47, 0.32, 0.98]`.
- Hover: cards lift with `whileHover={{ y: -4 }}` (or `-3` / `-6`), 0.25 to 0.4s.

## Component inventory

The canonical set. New pages compose from these; do not invent parallel patterns.

| Component | Path | Purpose |
|---|---|---|
| `Navbar` | `components/ui/Navbar.tsx` | Fixed dark top nav, 4 items, mobile drawer |
| `Footer` | `sections/Footer.tsx` | Dark footer, link columns, contact details |
| `PageHero` | `components/ui/PageHero.tsx` | Shared inner-page hero (label, heading, description) |
| `Button` | `components/ui/Button.tsx` | Primary / variant button, renders as link or button |
| `InlineCTA` | `components/ui/InlineCTA.tsx` | Mid-page CTA band wrapping the standard Button |
| `Reveal` | `components/animations/Reveal.tsx` | Scroll-reveal animation wrapper |
| `FeasibilityModal` + `useFeasibility` | `components/feasibility/` | The conversion modal and its context |

Templates to be built in later plans (per the architecture spec): `ConversionPage`,
`ToolPage`, `SubPageCTA`.

## Copy rules

- UK English everywhere: body, headings, eyebrows, captions, button labels, alt
  text, meta tags. (organise, behaviour, centre, programme.)
- No em dashes or en dashes anywhere. Hyphen-minus only. Number ranges use "to"
  (5 to 7 years, not 5 to 7 with a dash).
- Reading level: Grade 7 UK English. Short paragraphs, plain words.
- No SaaS hype verbs ("supercharge", "unlock", "unleash").
- Canonical CTA label: "Start Feasibility" (the Contact page form is the one
  exception to the modal pattern).

## Quality bar

Every page is verified pixel-perfect responsive at mobile-375, tablet-768,
laptop-1280, desktop-1440, desktop-1920 using `scripts/responsive-sweep.mjs`, with
`document.body.scrollWidth === document.body.clientWidth` at every viewport.
```

- [ ] **Step 3: Verify the file**

Run: `test -f design.md && grep -c "thistle-" design.md`
Expected: the file exists and the colour tokens appear (count of 5 or more).

- [ ] **Step 4: Commit**

```bash
git add design.md
git commit -m "docs: add design.md extracted from current homepage code"
```

---

## Task 3: Add the responsive-sweep tooling

**Files:**
- Create: `scripts/responsive-sweep.mjs`
- Create: `scripts/find-overflow.mjs`
- Create: `scripts/probe-panel.mjs`
- Modify: `.gitignore`
- Modify: `package.json`

- [ ] **Step 1: Install Playwright as a dev dependency**

Run: `npm install -D playwright && npx playwright install chromium`
Expected: `playwright` is added to `devDependencies` in `package.json`, and the Chromium browser binary downloads without error.

- [ ] **Step 2: Create `scripts/responsive-sweep.mjs`**

Create `scripts/responsive-sweep.mjs` with exactly this content:

```js
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const ORIGIN = process.env.RESPONSIVE_ORIGIN || "http://localhost:3000";

const VIEWPORTS = [
  { name: "mobile-375",   width: 375,  height: 812,  deviceScaleFactor: 2, isMobile: true  },
  { name: "tablet-768",   width: 768,  height: 1024, deviceScaleFactor: 2, isMobile: false },
  { name: "laptop-1280",  width: 1280, height: 800,  deviceScaleFactor: 1, isMobile: false },
  { name: "desktop-1440", width: 1440, height: 900,  deviceScaleFactor: 1, isMobile: false },
  { name: "desktop-1920", width: 1920, height: 1080, deviceScaleFactor: 1, isMobile: false },
];

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

async function run() {
  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    await mkdir(`screenshots/${vp.name}`, { recursive: true });
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
      isMobile: vp.isMobile,
    });
    const page = await ctx.newPage();
    for (const route of ROUTES) {
      try {
        await page.goto(`${ORIGIN}${route.path}`, { waitUntil: "networkidle", timeout: 30000 });
      } catch {
        console.warn(`SKIP ${vp.name} ${route.slug} — navigation failed`);
        continue;
      }
      await page.waitForTimeout(2500);
      const positions = [
        { name: "top",  y: 0 },
        { name: "mid",  y: 0.45 },
        { name: "deep", y: 0.9 },
      ];
      const docHeight = await page.evaluate(() => document.body.scrollHeight);
      const vpHeight = vp.height;
      for (const pos of positions) {
        const target = Math.max(0, Math.round((docHeight - vpHeight) * pos.y));
        await page.evaluate((y) => window.scrollTo(0, y), target);
        await page.waitForTimeout(600);
        await page.screenshot({
          path: `screenshots/${vp.name}/${route.slug}-${pos.name}.png`,
        });
      }
      console.log(`OK ${vp.name} ${route.slug}`);
    }
    await ctx.close();
  }
  await browser.close();
  console.log("Sweep complete. Open screenshots/ to review.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 3: Create `scripts/find-overflow.mjs`**

Create `scripts/find-overflow.mjs` with exactly this content:

```js
import { chromium } from "playwright";

const ORIGIN = process.env.RESPONSIVE_ORIGIN || "http://localhost:3000";
const ROUTE = process.env.ROUTE || "/";
const VP_WIDTH = parseInt(process.env.VP_WIDTH || "375", 10);
const VP_HEIGHT = parseInt(process.env.VP_HEIGHT || "812", 10);

async function run() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: VP_WIDTH, height: VP_HEIGHT },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await ctx.newPage();
  await page.goto(`${ORIGIN}${ROUTE}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const offenders = await page.evaluate((vpW) => {
    const overs = [];
    for (const el of document.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.right > vpW + 1 && r.width > 0) {
        overs.push({
          tag: el.tagName.toLowerCase(),
          cls: el.className?.toString?.()?.slice(0, 120) || "",
          right: Math.round(r.right),
          width: Math.round(r.width),
        });
      }
    }
    return overs.sort((a, b) => a.width - b.width).slice(0, 30);
  }, VP_WIDTH);
  console.log(JSON.stringify(offenders, null, 2));
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 4: Create `scripts/probe-panel.mjs`**

Create `scripts/probe-panel.mjs` with exactly this content:

```js
import { chromium } from "playwright";

const ORIGIN = process.env.RESPONSIVE_ORIGIN || "http://localhost:3000";
const ROUTE = process.env.ROUTE || "/";

const VPS = [
  { name: "mobile-375",   w: 375,  h: 812 },
  { name: "laptop-1280",  w: 1280, h: 800 },
  { name: "desktop-1440", w: 1440, h: 900 },
  { name: "desktop-1920", w: 1920, h: 1080 },
];

async function run() {
  const browser = await chromium.launch();
  for (const v of VPS) {
    const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h } });
    const page = await ctx.newPage();
    await page.goto(`${ORIGIN}${ROUTE}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const data = await page.evaluate(() => {
      const rect = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: Math.round(r.top), bottom: Math.round(r.bottom), width: Math.round(r.width) };
      };
      return {
        vpH: window.innerHeight,
        bodyScrollW: document.body.scrollWidth,
        bodyClientW: document.body.clientWidth,
        firstSection: rect("section:first-of-type"),
        // Add the selectors you care about for the route under test.
      };
    });
    console.log(v.name, JSON.stringify(data));
    await ctx.close();
  }
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 5: Add `/screenshots/` to `.gitignore`**

Append `/screenshots/` as a new line at the end of `.gitignore`. The final lines of `.gitignore` should read:

```
*.sw?
.vercel

# Responsive sweep output (regenerable, never source)
/screenshots/
```

- [ ] **Step 6: Add npm script aliases to `package.json`**

In `package.json`, add three entries to the `"scripts"` block so it includes:

```json
"sweep": "node scripts/responsive-sweep.mjs",
"find-overflow": "node scripts/find-overflow.mjs",
"probe": "node scripts/probe-panel.mjs"
```

Keep the existing scripts (`dev`, `build`, `start`, `lint`) intact; add these alongside them.

- [ ] **Step 7: Verify the tooling runs**

Start the dev server in one shell: `npm run dev`. In a second shell, run: `npm run sweep`.
Expected: the script logs `OK <viewport> <route>` lines for every viewport and route, finishes with `Sweep complete.`, and `screenshots/` contains five viewport folders each with PNG files. Then run `RESPONSIVE_ORIGIN=http://localhost:3000 npm run find-overflow` and confirm it prints `[]` (no overflow) for the homepage. Stop the dev server afterwards.

- [ ] **Step 8: Commit**

```bash
git add scripts/responsive-sweep.mjs scripts/find-overflow.mjs scripts/probe-panel.mjs .gitignore package.json package-lock.json
git commit -m "chore: add Playwright responsive-sweep tooling"
```

---

## Self-Review

**Spec coverage:** The architecture spec's Section 5 (Foundation docs) names three artefacts — `brief.md`, `design.md`, responsive-sweep tooling. Task 1 covers `brief.md`, Task 2 covers `design.md`, Task 3 covers all three scripts plus the `.gitignore` and `package.json` changes. Section 7 (Quality bar) names the five viewports and the overflow check; both are implemented in `responsive-sweep.mjs` and `find-overflow.mjs` and documented in `design.md`. No gaps.

**Placeholder scan:** `probe-panel.mjs` contains one intentional comment (`// Add the selectors you care about`) — this is correct, it is a reusable template by design, as specified in the SOP. No other placeholders; all file contents are complete.

**Type consistency:** Token names (`thistle-black`, `fl-section`, `text-fluid-h2`) are consistent between `design.md` and the verified source files. Viewport names (`mobile-375` etc.) are identical across `responsive-sweep.mjs`, `probe-panel.mjs`, and the `design.md` quality bar section.
