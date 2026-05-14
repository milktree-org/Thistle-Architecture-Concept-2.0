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
- Font: Geist Sans, loaded in `src/app/layout.tsx` via `GeistSans.className`,
  mapped to the `font-sans` family via `var(--font-geist-sans)` in Tailwind config.

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
- Primitive: `components/animations/Reveal.tsx` (`Reveal` wrapper, `useInView` +
  `useAnimation` fade-and-rise from `opacity: 0, y: 30`, staggered with a `delay` prop).
- Easing for all transitions: `[0.21, 0.47, 0.32, 0.98]`, duration 0.6s.
- Section graphics use `initial / whileInView` opacity-and-y transitions with the
  same easing `[0.21, 0.47, 0.32, 0.98]`.
- Hover: cards lift with `whileHover={{ y: -4 }}` (or `-3` / `-6`), 0.25 to 0.4s.

## Component inventory

The canonical set. New pages compose from these; do not invent parallel patterns.

| Component | Path | Purpose |
|---|---|---|
| `Navbar` | `components/ui/Navbar.tsx` | Fixed dark top nav, 4 items, mobile drawer |
| `Footer` | `sections/Footer.tsx` | Dark footer, link columns, contact details |
| `PageHero` | `components/ui/PageHero.tsx` | Shared inner-page hero (label, heading, description) |
| `Button` | `components/ui/Button.tsx` | Primary / variant button, renders as motion.button |
| `InlineCTA` | `components/ui/InlineCTA.tsx` | Mid-page CTA band wrapping the standard Button |
| `Reveal` | `components/animations/Reveal.tsx` | Scroll-reveal animation wrapper |
| `FeasibilityModal` + `useFeasibility` | `components/feasibility/` | The conversion modal and its context (`FeasibilityModal.tsx`, `FeasibilityContext.tsx`) |

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
