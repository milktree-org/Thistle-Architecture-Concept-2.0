# Thistle Site Architecture — Design Spec

**Date:** 2026-05-14
**Status:** Approved (design), pending spec review
**Scope:** Information architecture for the full Thistle marketing site, plus the foundation docs and build sequence. The homepage is already built and live; this spec covers everything else.

---

## 1. Context

Thistle is a developer-led, technology-enhanced feasibility platform with architectural delivery. It is **not** a traditional architecture practice. The sole commercial purpose of the website is to **sell feasibility reports**. The canonical primary action everywhere is **"Start Feasibility"** (opens the existing feasibility modal).

The original client brief covered Phase 1 (homepage) only and explicitly noted: *"Future pages (tools, SEO landing pages) will build off this structure."* This spec is that next phase.

Process follows the `PROJECT_SOP.md` playbook (adapted from the Aqua Logic build): Phase 2 Information Architecture → foundation docs → page-by-page spec/plan/build.

### Reference research

Market research across the brief's named references (Resi, Searchland, Urbanist) plus the sister product hmochecker.co.uk confirmed a consistent pattern in this space:

- Free tools / calculators are the primary lead-generation mechanism (every site has them).
- Project-type / conversion-type pages carry the SEO load.
- Proof via case studies / portfolio is universal.
- A clear product + pricing story, or an explicit quote path.

### Audience (from the brief)

Property developers, HMO investors, commercial-to-residential converters, land buyers / deal sourcers.

### Locked decisions

- **Pricing:** a "from £X" anchor on the Feasibility Package page, no separate pricing page. The pricing component is structured so it can graduate to a full tier table when Edward confirms numbers. Rationale: the brief positions this as a product you start, not enquire about, so a price anchor matters for conversion, but pricing numbers are not yet confirmed.
- **Free tools:** a `/tools` section exists in the IA; 1-2 tools ship this phase.
- **Contact:** a dedicated page (not the modal) with an inline form wired to Formspree.
- **Build structure:** Approach A — this spec produces the IA + foundation docs; each subsequent page or page-group gets its own spec → plan → build cycle.

---

## 2. Sitemap

```
/                                      Home                          built
/how-it-works                          Process + Feasibility Engine deep-dive
/feasibility-package                   The product: deliverables, what's included, "from £X" anchor
/case-studies                          Index: step-by-step worked example + grid   built
/case-studies/[slug]                   Case study detail                            exists
/conversions/[type]                    Conversion-type pages (SEO + audience)
   /conversions/commercial-to-residential
   /conversions/office-to-resi-class-ma
   /conversions/hmo
/tools                                 Tools index
/tools/[slug]                          Individual tools (2 this phase)
   /tools/class-ma-eligibility-checker
   /tools/gdv-viability-calculator
/about                                 Team, architects as hero                     built
/blog                                  Blog index                                   exists
/blog/[slug]                           Blog post                                    exists
/contact                               Contact page (inline Formspree form)
/privacy  /terms  /cookies              Legal                                        exist
```

"built" = rebuilt during the Figma round 2 session. "exists" = present but not yet rebuilt to the new design system.

---

## 3. Navigation

### Top nav — 4 items

Contact lives in the footer; every primary CTA opens the feasibility modal.

| Nav item | Type | Reveals |
|---|---|---|
| How It Works | direct link | — |
| Feasibility Package | direct link | — |
| Case Studies | direct link | — |
| Conversions | dropdown | Commercial to Residential / Office to Resi (Class MA) / HMO |

Tools, About, and Blog are surfaced through the footer and contextually within pages.

### Footer — 4 columns

- **Product:** How It Works, Feasibility Package, Case Studies, Tools
- **Conversions:** Commercial to Residential, Office to Resi (Class MA), HMO
- **Company:** About, Blog, Contact
- **Contact details:** email, phone, address, with the legal links (Privacy, Terms, Cookies) in a row beneath

---

## 4. Page templates and shared components

### New shared templates (built once, reused)

| Template | Used by | Purpose |
|---|---|---|
| `ConversionPage` | all `/conversions/[type]` pages | One data-driven layout so every conversion page is pixel-identical |
| `ToolPage` | all `/tools/[slug]` pages | Shared shell: tool hero, the interactive tool, a "now start a real feasibility" CTA |
| `SubPageCTA` | every inner page's closing band | One canonical closing CTA, not redesigned per page |

### Existing components reused and standardised

`Navbar`, `Footer`, `PageHero`, `Button`, `InlineCTA`, the `Reveal` animation primitives, and the `FeasibilityModal` + `useFeasibility` context. These already exist and work; `design.md` documents them as the canonical set so new pages compose from the same vocabulary.

### Page jobs, one line each

- **How It Works** — the 4-step process expanded, plus the Feasibility Engine data layers in depth. The brief marks this page "critical".
- **Feasibility Package** — the spec sheet that closes. Each deliverable expanded with a sample visual, a sample-report walkthrough, the 5-day timeline broken down, the "from £X" anchor, scope clarity (what is not included), and a package-specific FAQ. Shares the homepage's design system and components but carries distinct, non-overlapping content: the homepage convinces, this page details.
- **Conversions/[type]** — problem framing for that buyer segment, how Thistle's feasibility solves it, proof, CTA. SEO-targeted.
- **Tools** — index plus the two tools. Both must directly serve the question "should I get a feasibility?": the Class MA eligibility checker (am I eligible for permitted-development conversion?) and the GDV / viability quick calculator (does the deal roughly stack up?). Both close into the feasibility modal.
- **Contact** — a dedicated page with an inline form wired to Formspree via `NEXT_PUBLIC_FORMSPREE_ENDPOINT`. Until the real form ID is supplied it logs-and-stubs so previews work.

---

## 5. Foundation docs

Produced before any page build:

- **`brief.md`** — the client brief restated and structured, covering positioning, audience, messaging pillars, and the conversion model.
- **`design.md`** — the design system spec, extracted fresh from the current homepage code (not from memory, since the homepage was changed after the original build). Pins down: colour tokens, the `text-fluid-*` type scale, the `fl-*` spacing scale and section padding, motion language, the canonical component inventory from Section 4, and the copy rules (UK English, no em dashes, Grade 7 reading level, canonical CTA "Start Feasibility"). This document is what makes consistent spacing, margins, and font sizing across the whole site achievable.
- **SOP responsive-sweep tooling** — `scripts/responsive-sweep.mjs`, `scripts/find-overflow.mjs`, and a probe template, copied from the SOP appendix and adapted to Thistle's route list. `/screenshots/` added to `.gitignore`.

---

## 6. Build order

Each of steps 2-7 gets its own spec → plan → build cycle.

1. **Foundation** — `brief.md`, `design.md`, responsive-sweep tooling
2. **How It Works** — the brief's "critical" page
3. **Feasibility Package** — the money page
4. **Conversions template + the 3 conversion pages**
5. **Tools index + Class MA checker + GDV calculator**
6. **Contact** — Formspree
7. **Blog refresh + legal refresh** — lighter touch

---

## 7. Quality bar

Per the user's explicit requirement, the entire site must be pixel-perfect responsive: correct spacing, margins, and padding, and a correct type scale at every breakpoint. This is enforced by:

- `design.md` as the single source of spacing and type tokens.
- The SOP responsive-sweep run at mobile-375, tablet-768, laptop-1280, desktop-1440, desktop-1920 for every page before it is considered done.
- The overflow audit on every page (`scrollWidth === clientWidth` at every viewport).
- Mobbin and Playwright used for section-level references during individual page design.

---

## 8. Out of scope (this phase)

- Programmatic location SEO pages (a later phase, will reuse the `ConversionPage` template pattern).
- A standalone pricing page (pricing is an anchor on the Feasibility Package page until numbers are confirmed).
- More than two tools.
- A CMS for the blog (blog content stays in the existing data structure).
