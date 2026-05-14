# How It Works Page — Design Spec

**Date:** 2026-05-15
**Status:** Approved (design), pending spec review
**Scope:** Rebuild of the How It Works page (`/how-it-works`). Part of the site build sequence in `docs/superpowers/specs/2026-05-14-thistle-site-architecture-design.md` (build order step 2). The brief marks this the "critical" page.

---

## 1. Context

The How It Works page is the in-depth walkthrough of Thistle's feasibility process. Where the homepage's `Process` section is a scannable 5-step overview, this page is the full narrative: each step explained in real depth, with the Feasibility Engine's data layers shown in their proper place inside Step 2.

A `views/HowItWorksPage.tsx` already exists but is built on a stale 4-step model with generic stock photography. It is being rebuilt to this spec.

### Decisions locked during brainstorming

- **Step model:** the page uses the homepage's canonical **5 steps**, not the old 4-step model. The whole site tells one story.
- **Feasibility Engine layers:** the 6 data layers are nested **inside Step 2 (Automated Analysis)** as a compact grid, not given a separate top-level section. The full layer detail stays a homepage concern; here it is "what is inside the box".
- **Layout:** Approach A, a **vertical narrative timeline** of alternating full-width rows (graphic and copy alternate sides), matching the homepage Feasibility Engine's visual language.
- **Imagery:** **custom SVG/CSS product graphics** for the system-heavy steps, **AI-generated imagery** for a few human-moment and atmospheric surfaces. The page is built with custom graphics and placeholder treatments first; AI imagery is a separate follow-up pass.

---

## 2. Page structure

Top to bottom:

1. **Page hero** — dark variant `PageHero`. Label "How It Works", heading, one-line description, "Start Feasibility" button. Background is an AI image slot (placeholder gradient treatment first).
2. **Section intro** — eyebrow + H2 introducing the 5-step process, anchored to the homepage's 5-day frame. Short framing line, no large text block.
3. **The 5-step narrative timeline** — five alternating full-width rows (see Section 3). Step 2 expands inline into the 6 nested layers.
4. **What you receive** — dark section, the 6 deliverables as cards.
5. **Closing CTA band** — dark band, "Start Feasibility". Background is an AI image slot (placeholder treatment first).
6. **FAQ** — the existing shared `FAQ` section, reused as-is.

### Hero heading

The existing page heading "From Enquiry To Complete Clarity" is replaced. New direction: a "building to Go/No-Go, step by step" framing that matches the homepage's "building to conversion" language and drops the word "enquiry" (the brief explicitly moves away from the enquiry framing). Final wording is written during the build.

---

## 3. The step row

### Standard step row (Steps 1, 3, 4, 5)

Each row carries, on one side:
- Eyebrow: step number + duration label
- Title
- One-line lead
- Expanded detail line (the reassurance / "what this really means" copy)

And on the alternating side: the step's graphic. Rows alternate which side the graphic sits on.

### Step 2 — Automated Analysis

Follows the standard row, then expands inline into a nested treatment: an eyebrow ("Inside the analysis — six data layers") above a **compact grid of 6 cards**. Each card is a mini graphic + layer title + one-line description. This is deliberately lighter than the homepage Feasibility Engine's full alternating-row treatment; it shows what is inside the analysis without re-running the homepage section.

### The 5 steps

| Step | Duration label (confirm with Edward) | Graphic |
|---|---|---|
| 01 Upload Property Details | Under 2 minutes | Custom — portal / upload UI mock |
| 02 Automated Analysis | Automated, within 48 hours | Custom — data-engine mock, plus the 6 compact layer cards nested |
| 03 Project Data Gathering Session | Instant call | AI image slot — the call with Jodi, the property expert |
| 04 Sketch Scheme Stage | Days 3 to 4 | Custom — sketch-scheme floor plan |
| 05 Final Meeting | Day 5 | AI image slot — the feasibility review meeting |

Step content expands the homepage `Process` copy into a one-line lead plus an expanded detail line per step. Duration labels are a proposal and are flagged for client confirmation.

### Deliverables

The "What you receive" section carries 6 cards: GA Floor Plans, Schedule of Accommodation, Constraints Analysis, Risk Register, Go/No-Go Recommendation, Efficiency Metrics. Copy is carried from the existing page and lightly tightened.

---

## 4. Component architecture

**Rebuilt:** `views/HowItWorksPage.tsx`. The route file `src/app/how-it-works/page.tsx` already exists and does not change.

**Reused as-is:** `PageHero`, `Reveal`, `Button`, `InlineCTA`, the `FAQ` section, and the `useFeasibility` context.

**New files:**

| File | Responsibility |
|---|---|
| `sections/how-it-works/StepRow.tsx` | One alternating narrative row. Props: step data, a `reversed` boolean, a `graphic` slot. One clear responsibility, reused five times. |
| `sections/how-it-works/stepGraphics.tsx` | The custom SVG/CSS product graphics for Steps 1, 2, and 4, the 6 compact layer mini-graphics, and the placeholder treatments for the AI-image slots (Steps 3 and 5, hero background, CTA background). |
| `data/howItWorksData.ts` | The 5-step content array and the 6 deliverables array, kept out of the component. |

**Targeted refactor that serves this page:** the 6 nested layer cards need layer titles and one-line descriptions. To avoid duplicating that copy, the 6 layers' `eyebrow` and `title` data is extracted from `sections/FeasibilityEngine.tsx` into a new `data/feasibilityLayers.ts`. Both the homepage Feasibility Engine and this page import it, so the layer names cannot drift. The homepage's full graphic components stay in place and are not touched; this page's compact cards get their own mini graphics in `stepGraphics.tsx`.

---

## 5. Imagery

- **Custom graphics, built now:** Steps 1, 2, and 4 get bespoke SVG/CSS product graphics using the same technique as the homepage Feasibility Engine graphics.
- **AI image slots:** the hero background, Step 3, Step 5, and the closing CTA background. Each is built with a **placeholder treatment first** — a brand-tinted gradient panel with the step's icon — so the page ships fully working and is never blocked on imagery.
- **AI imagery is a separate follow-up task**, out of scope for this page's build plan. It has two prerequisites from the client:
  1. The OpenAI image API key, wired to an environment variable and never committed.
  2. A locked image-style preamble (a fixed prompt style, the SOP's `images.md` concept) so all generated images read as one cohesive set.

---

## 6. Quality bar

Per the site-architecture spec and `design.md`: the page is verified pixel-perfect responsive at mobile-375, tablet-768, laptop-1280, desktop-1440, desktop-1920 using `scripts/responsive-sweep.mjs`, with `document.body.scrollWidth === document.body.clientWidth` at every viewport. Copy follows the `design.md` rules: UK English, no em dashes, Grade 7 reading level, canonical CTA "Start Feasibility".

---

## 7. Out of scope

- AI image generation and the `images.md` style preamble (separate follow-up task, needs the API key).
- Any change to the homepage `Process` or `FeasibilityEngine` sections beyond extracting the shared `data/feasibilityLayers.ts`.
- The `SubPageCTA` shared template named in the site-architecture spec — this page uses its own closing CTA band; the shared template is extracted in a later page's plan once a second consumer exists.
