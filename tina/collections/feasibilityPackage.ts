import type { Collection, TinaField } from 'tinacms';
import { joinKeyField } from '../fields';

// The two pages of the feasibility purchase: /feasibility-package and
// /feasibility-confirmed.
//
// FILENAME → PAGE, and nothing else decides it:
//
//   content/feasibility/package.json    → /feasibility-package
//   content/feasibility/confirmed.json  → /feasibility-confirmed
//
// The two are one collection because they are one journey — the hard-sell page
// and the page someone lands on seconds after paying for what it sold them —
// and an editor changing what the package promises should find the "here is
// what happens next" copy in the same place. They are two documents rather than
// one because they are two routes, and each server page asks for its own file
// by relativePath, so the names above are load-bearing in both directions:
// renaming a file breaks the route lookup and the preview at the same time,
// which is why the filename is read-only and create/delete are off. A third
// page here would be a code change (a route, a view) before it is a document.
//
// Templates rather than one flat field list, because the two documents share
// almost nothing. A single list would put "Five deliverables" and the FAQ on
// the confirmation page's form, where they edit nothing.
//
// /feasibility-package is the site's one hard-sell page and its primary
// conversion path (PRODUCT.md), so the schema is deliberately generous with the
// copy around the offer and deliberately mean about anything that decides what
// a customer is charged or what the form does.
//
// DELIBERATELY NOT HERE, AND STAYING IN CODE:
//
// - Every figure that reads as the price OF a product: "£49.99" and "From £298"
//   on the two cards, and "£49.99 inc. VAT" in the mobile sticky bar. Those are
//   rendered from constants next to the pricing engine (BASE_FEE and the area
//   ladder in data/pricingData.ts, which the calculator and /api/checkout both
//   compute from, and pricingFrom in data/feasibilityPackageData.ts). An
//   editable card price could publish a fee the site does not honour — the page
//   saying £250 while Stripe takes £298 — with nothing to catch it. This is the
//   same line tina/collections/pricing.ts draws, for the same reason.
//
//   Sentences that QUOTE a price are editable, because they are sentences:
//   "Feasibility from £49.99.", "Architect-led feasibility from £298.", the
//   partner note's "HMO Property Check, £15.99". Each one carries a warning in
//   its description that the number has to move in code at the same time.
//
// - The whole quote wizard and detailed brief (components/feasibility/**), the
//   shared pricing calculator, the automated checkout form inside the entry
//   section, and the email box on the sample-report card. Their placeholders,
//   button states, validation and error messages are the mechanic, not copy,
//   and a reworded button state is a broken button.
//
// - Anchors and routes (#instant-quote, /pricing#calculator, /about, hmochecker.co.uk,
//   the case-study link), the pinned Maywood Group review, the order of the
//   sections, and the positions that pair a list item with a drawing or a
//   photograph in code.
//
// - Photo alt text for the three people in "Who You're Working With": it is
//   built from the name and job title fields, so it stays correct on its own
//   when either is edited, exactly as the About page roster does.

// A price-quoting sentence. Declared once because the same warning applies
// wherever a headline repeats a figure the engine actually charges.
const PRICE_WARNING =
  'This line quotes a price. The number here is only the wording — it does not change what anyone is charged, which is set in code next to the pricing engine. If a price changes, ask the developer to move both together, rather than editing this on its own.';

// The eyebrow and heading that open most sections on this page. Declared once
// because six sections take the same shape. Where the heading runs to two
// lines, the second is a separate field because it is set in green: a single
// string with a line break in it cannot carry the colour change.
const sectionHeadingFields = (opts: { accent?: boolean } = {}): TinaField[] => [
  { type: 'string', name: 'eyebrow', label: 'Eyebrow', description: 'The small green line above the heading.' },
  {
    type: 'string',
    name: 'heading',
    label: opts.accent ? 'Heading (first line)' : 'Heading',
    ...(opts.accent ? { description: 'Shown in black, on its own line.' } : {}),
  },
  ...(opts.accent
    ? ([
        {
          type: 'string',
          name: 'headingAccent',
          label: 'Heading (second line, green)',
          description:
            'Shown in green underneath the first line. Both lines always appear; clearing this box restores the wording that is there now rather than removing the line.',
        },
      ] as TinaField[])
    : []),
];

export const feasibilityPackageCollection: Collection = {
  name: 'feasibilityPackage',
  label: 'Feasibility Package',
  path: 'content/feasibility',
  format: 'json',

  ui: {
    // Two fixed pages, two documents, no set to grow.
    allowedActions: { create: false, delete: false },

    // Every collection needs a router, or the editor opens the form with no
    // live preview beside it and click-to-edit never engages. There is no slug
    // to interpolate — these are two specific pages — so each filename is
    // mapped explicitly. `_sys.filename` arrives without the extension, so
    // 'package.json' is 'package'.
    router: ({ document }) => {
      switch (document._sys.filename) {
        case 'package':
          return '/feasibility-package';
        case 'confirmed':
          return '/feasibility-confirmed';
        default:
          // Unreachable while create is off. Returning undefined would drop the
          // preview pane entirely, so fall back to somewhere real.
          return '/feasibility-package';
      }
    },

    filename: {
      // The filename is what src/app/**/page.tsx asks for by relativePath and
      // what the router above switches on. A rename silently un-routes a page.
      readonly: true,
    },
  },

  templates: [
    // ───────────────────────── /feasibility-package ─────────────────────────
    {
      name: 'package',
      label: 'Feasibility Package page',
      fields: [
        // --- Search engine listing. Never appears on the page itself. ---
        {
          type: 'string',
          name: 'metaTitle',
          label: 'Search result title',
          description:
            'The tab title and the blue headline in Google. "| Thistle Architecture" is added automatically, so type just the page name, e.g. "Feasibility Package". Around 50 characters works best.',
        },
        {
          type: 'string',
          name: 'metaDescription',
          label: 'Search result description',
          ui: { component: 'textarea' },
          description:
            'The grey summary under the headline in Google. Not shown anywhere on the page. Google cuts it off after roughly 155 characters. This is the page people find when they search for a feasibility study, so it is worth the time.',
        },

        // --- The photographic hero ---
        {
          type: 'object',
          name: 'hero',
          label: 'Hero',
          description: 'The full-height photograph at the top, with the headline and the first call to action over it.',
          fields: [
            { type: 'string', name: 'label', label: 'Eyebrow', description: 'The small green line above the headline.' },
            {
              type: 'string',
              name: 'heading',
              label: 'Headline',
              ui: { component: 'textarea' },
              description:
                'The only h1 on the page. Press Enter where you want the line to break — it currently breaks after "Answered", and the break is part of the design rather than an accident of screen width.',
            },
            {
              type: 'string',
              name: 'priceHeadline',
              label: 'Price line',
              description:
                'The larger of the two price lines. Ed\'s August 2026 final brief asked for exactly this shape: "Feasibility from £49.99" with "Architect-led feasibility from £298" immediately below. ' +
                PRICE_WARNING,
            },
            {
              type: 'string',
              name: 'priceSub',
              label: 'Second price line',
              description: 'The quieter line under it, for the architect-led fee. ' + PRICE_WARNING,
            },
            {
              type: 'string',
              name: 'lede',
              label: 'Supporting paragraph',
              ui: { component: 'textarea' },
              description: 'The sentence under the prices, above the button.',
            },
            {
              type: 'string',
              name: 'ctaLabel',
              label: 'Button label',
              description:
                'The main call to action. It opens the fee calculator on the pricing page; where it goes is set in code, so only the wording is editable here.',
            },
            {
              type: 'string',
              name: 'ctaNote',
              label: 'Note under the button',
              description:
                'The small reassurance line. It promises a response time, so only change it to one the team can actually meet.',
            },
            {
              type: 'image',
              name: 'image',
              label: 'Background photograph',
              description:
                'Sits behind a dark overlay, so it wants to be a finished building with a clear silhouette rather than anything with detail to read. The current shot is the completed Bereweeke Avenue house.',
            },
            {
              type: 'string',
              name: 'imageAlt',
              label: 'Photograph description (alt text)',
              ui: { component: 'textarea' },
              description:
                'Read aloud to blind visitors and used by Google; it is never shown on the page, so it cannot be clicked on the page either. Describe what is actually in the photo, and change it whenever you change the photo.',
            },
            {
              type: 'object',
              name: 'markers',
              label: 'Trust markers',
              list: true,
              ui: { itemProps: (item) => ({ label: item?.label }) },
              description:
                'The three ticked claims along the bottom of the hero. Each one is a public promise, so only put something here the practice could evidence if a client asked. The row is built for three; a fourth wraps onto its own line. The icons are set in code and pair with these by position.',
              fields: [{ type: 'string', name: 'label', label: 'Claim' }],
            },
          ],
        },

        // --- Product choice + the shared calculator ---
        {
          type: 'object',
          name: 'entry',
          label: '"Choose Your Route" section',
          description:
            'The two product cards near the top of the page per Ed\'s August 2026 final brief: "the website should never feel like contact us for a quote". The name/email/phone form on the £49.99 card is the mechanic rather than copy and is set in code. The fee calculator itself lives on the pricing page only, since September 2026.',
          fields: [
            { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
            {
              type: 'string',
              name: 'heading',
              label: 'Heading',
              description: 'The large line. ' + PRICE_WARNING,
            },
            {
              type: 'string',
              name: 'priceSub',
              label: 'Second line under the heading',
              description: 'The quieter architect-led price line under it. ' + PRICE_WARNING,
            },
            { type: 'string', name: 'lede', label: 'Supporting paragraph', ui: { component: 'textarea' } },

            {
              type: 'object',
              name: 'automated',
              label: 'Automated Site Feasibility card',
              description:
                'The left-hand card. Its price is set in code, beside the code that actually takes the payment, so it cannot be edited here — see the note at the top of this collection.',
              fields: [
                { type: 'string', name: 'name', label: 'Product name' },
                {
                  type: 'string',
                  name: 'strapline',
                  label: 'One-line summary',
                  description:
                    'The bold line under the price. It states a turnaround, so keep it to one the team can meet.',
                },
                {
                  type: 'object',
                  name: 'includes',
                  label: 'What is included',
                  list: true,
                  ui: { itemProps: (item) => ({ label: item?.label }) },
                  description:
                    'The ticked list. These are what the automated report actually contains, so add a line only when the report really covers it.',
                  fields: [{ type: 'string', name: 'label', label: 'Line' }],
                },
              ],
            },

            {
              type: 'object',
              name: 'architectural',
              label: 'Architectural Feasibility card',
              description: 'The right-hand, preferred card. Its price is set in code for the same reason as the other one.',
              fields: [
                {
                  type: 'string',
                  name: 'badge',
                  label: 'Badge',
                  description:
                    "The small tab on the top edge. Ed's brief asks for the architect-led product to be the visually preferred option, labelled explicitly.",
                },
                { type: 'string', name: 'name', label: 'Product name' },
                { type: 'string', name: 'strapline', label: 'One-line summary', ui: { component: 'textarea' } },
                { type: 'string', name: 'body', label: 'Paragraph', ui: { component: 'textarea' } },
                {
                  type: 'string',
                  name: 'ctaLabel',
                  label: 'Button label',
                  description: 'Opens the fee calculator on the pricing page. Where it goes is set in code.',
                },
              ],
            },

            // The partner note is three fields because a link sits in the
            // middle of the sentence and each part has to be separately
            // clickable in the editor.
            {
              type: 'string',
              name: 'partnerPrefix',
              label: 'Partner note: opening',
              description:
                'The faint line under the calculator, before the link. Ed asked that the £15.99 HMO check is not used as the main feasibility headline and is clearly marked as a partner offer, which is why it sits here rather than in the cards above.',
            },
            {
              type: 'string',
              name: 'partnerLinkLabel',
              label: 'Partner note: link text',
              description:
                'The linked words in the middle of that line. The link goes to hmochecker.co.uk, which is set in code. ' +
                PRICE_WARNING,
            },
            {
              type: 'string',
              name: 'partnerSuffix',
              label: 'Partner note: closing',
              description:
                'The rest of the sentence after the link. It is what makes clear the tool is a partner product and not an architectural feasibility, so keep that distinction in whatever you write.',
            },
          ],
        },

        // --- The five-step process ---
        {
          type: 'object',
          name: 'howItWorks',
          label: '"Five Days, Five Steps." section',
          description: 'The numbered timeline, absorbed from the old How It Works page.',
          fields: [
            ...sectionHeadingFields({ accent: true }),
            {
              type: 'object',
              name: 'steps',
              label: 'Steps',
              list: true,
              ui: { itemProps: (item) => ({ label: item?.title }) },
              description:
                'In order down the page. The circled numbers are counted from the order of this list, so there is nothing to renumber — but the heading above says "Five Steps", so change that too if you add or remove one.',
              fields: [
                {
                  type: 'string',
                  name: 'durationLabel',
                  label: 'How long it takes',
                  description:
                    'The small green line above the step title. These durations are a proposal and were flagged for confirmation with the client, so check one before treating it as a promise.',
                },
                { type: 'string', name: 'title', label: 'Step title' },
                { type: 'string', name: 'lead', label: 'First paragraph', ui: { component: 'textarea' } },
                {
                  type: 'string',
                  name: 'detail',
                  label: 'Second paragraph',
                  ui: { component: 'textarea' },
                  description:
                    'The smaller grey paragraph. Steps 1 and 5 describe how the deposit and the five-day clock work, and the brief defines that clock as starting once both payment and the full project brief are in. Do not restate it as starting from payment alone.',
                },
              ],
            },
          ],
        },

        // --- "What You Actually Receive" ---
        {
          type: 'object',
          name: 'deliverables',
          label: '"What You Actually Receive" section',
          description:
            'The five deliverables, the sample-report request, and the nine-bed HMO example, merged into one section per Ed\'s August 2026 final brief.',
          fields: [
            ...sectionHeadingFields({ accent: true }),
            { type: 'string', name: 'lede', label: 'Supporting paragraph', ui: { component: 'textarea' } },
            {
              type: 'object',
              name: 'items',
              label: 'The five deliverables',
              list: true,
              ui: { itemProps: (item) => ({ label: item?.key }) },
              description:
                'Each deliverable\'s "why it matters" line and the document shown beside it. The deliverable NAME and its one-line description are deliberately not here: the /conversions pages render the same five names and descriptions from the same place in code, so editing them here would leave the two sets of pages disagreeing. Ask the developer if one needs renaming.',
              fields: [
                joinKeyField({
                  label: 'Deliverable (fixed)',
                  description:
                    'The deliverable this row belongs to. Read-only: it is how the page finds the right row, so changing it would stop your edits on this row from showing.',
                }),
                {
                  type: 'string',
                  name: 'why',
                  label: 'Why it matters',
                  ui: { component: 'textarea' },
                  description:
                    'The second paragraph, shown when this deliverable is the one selected. This is the sell, not the description.',
                },
                {
                  type: 'image',
                  name: 'image',
                  label: 'Document shown beside it',
                  description:
                    'A real page from a real report — all five are from 155 Windmill Lane, the example project Ed nominated, and they replaced stock images he described as wrong and muddled on 5 August. Use a page of the document this deliverable actually produces. It is shown whole rather than cropped, so a full page reads correctly.',
                },
                {
                  type: 'string',
                  name: 'imageAlt',
                  label: 'Document description (alt text)',
                  ui: { component: 'textarea' },
                  description:
                    'Read aloud to blind visitors and used by Google; never shown on the page. Say what the document shows, not just what it is called.',
                },
              ],
            },
            {
              type: 'object',
              name: 'sample',
              label: 'Sample report request',
              description:
                'The white card offering a full sample feasibility by email. The email box, its button and its messages are the mechanic and are set in code; the wording around them is here.',
              fields: [
                { type: 'string', name: 'heading', label: 'Heading' },
                {
                  type: 'string',
                  name: 'body',
                  label: 'Paragraph',
                  ui: { component: 'textarea' },
                  description:
                    'This promises the sample has the client details removed. It does, because the un-redacted version was taken down for exactly that reason, so keep the promise in whatever you write.',
                },
                {
                  type: 'string',
                  name: 'privacyNote',
                  label: 'Note under the box',
                  description:
                    'The small grey line about what happens to the address. It is a promise about follow-up, so only say what the team will actually do.',
                },
              ],
            },
            {
              type: 'object',
              name: 'example',
              label: '"See It In Practice" card',
              description:
                'The small card at the bottom pointing at one real project. Which project, its title, its description and its photograph all come from the case study itself, so only these two lines are here.',
              fields: [
                { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
                {
                  type: 'string',
                  name: 'linkLabel',
                  label: 'Link text',
                  description: 'The link into the case study. Where it goes is set in code.',
                },
              ],
            },
          ],
        },

        // --- The six data layers ---
        {
          type: 'object',
          name: 'analysis',
          label: '"What\'s Included In Data Analysis" section',
          description:
            'The six analysis layers, each with a drawn diagram. The diagrams are drawn in code from the brand palette, and the sample figures inside them (the £3.2M GDV, the 22 HMOs, the eight units) are illustrative rather than a real project — they are not editable, because a number typed into one would read as a claim.',
          fields: [
            ...sectionHeadingFields({ accent: true }),
            { type: 'string', name: 'lede', label: 'Supporting paragraph', ui: { component: 'textarea' } },
            {
              type: 'object',
              name: 'layers',
              label: 'Layers',
              list: true,
              ui: { itemProps: (item) => ({ label: item?.title }) },
              description:
                'The six cards, in order. All three lines of a card are edited here together — before this collection existed the layer name lived in one file and its description in another, and the two could drift apart. Each card is paired with its diagram by position, and there are six diagrams, so a seventh layer would appear with an empty frame.',
              fields: [
                {
                  type: 'string',
                  name: 'eyebrow',
                  label: 'Layer number',
                  description:
                    'The small green "Layer 01" line. It is typed rather than counted, so renumber the rest if you reorder them.',
                },
                { type: 'string', name: 'title', label: 'Layer name' },
                { type: 'string', name: 'body', label: 'Description', ui: { component: 'textarea' } },
              ],
            },
            {
              type: 'string',
              name: 'ctaLabel',
              label: 'Button label',
              description: 'The button under the six cards. It scrolls back up to the calculator; where it goes is set in code.',
            },
          ],
        },

        // --- Who you are buying from ---
        {
          type: 'object',
          name: 'team',
          label: '"Who You\'re Working With" section',
          description:
            'Three people, not the whole roster: Ed\'s August 2026 final brief asks to "make Edward and Kaan part of the reason to buy the architect-led service", with Jodi as the first point of contact for Expert Sessions. The full team is on the About page and is edited there.',
          fields: [
            ...sectionHeadingFields(),
            {
              type: 'object',
              name: 'people',
              label: 'People',
              list: true,
              ui: { itemProps: (item) => ({ label: item?.name }) },
              description:
                'Three across, so a fourth would start a second row. Photo descriptions are built from the name and job title, so there is nothing separate to keep in step.',
              fields: [
                { type: 'string', name: 'name', label: 'Name' },
                { type: 'string', name: 'role', label: 'Job title' },
                {
                  type: 'string',
                  name: 'line',
                  label: 'Why they matter here',
                  ui: { component: 'textarea' },
                  description:
                    'What this person contributes to a feasibility, in Ed\'s own framing rather than as a CV. Ed\'s own line quotes figures about his track record; only keep a figure that could be evidenced if a client asked.',
                },
                {
                  type: 'image',
                  name: 'image',
                  label: 'Photograph',
                  description:
                    'Optional. Where there is no photograph the card shows the person\'s initials instead, which is deliberate — Jodi has no photo in the client\'s Team Photos folder, and inventing or borrowing one is worse than initials. Use a real photograph, never an AI-generated one.',
                },
              ],
            },
            {
              type: 'object',
              name: 'proofPoints',
              label: 'Credibility line',
              list: true,
              ui: { itemProps: (item) => ({ label: item?.label }) },
              description:
                'The faint dotted line under the three cards. Ed\'s brief asks for "concise credibility proof such as hundreds of conversions designed, nationwide project experience, planning success and core project types" — phrased generally on purpose, rather than borrowing HMO Designers\' project counts, which are a different business\'s numbers.',
              fields: [{ type: 'string', name: 'label', label: 'Claim' }],
            },
            {
              type: 'string',
              name: 'linkLabel',
              label: 'Link to the About page',
              description: 'The link under the credibility line. Where it goes is set in code.',
            },
          ],
        },

        // --- Reviews band ---
        {
          type: 'object',
          name: 'reviews',
          label: 'Reviews heading',
          description:
            'Just the eyebrow above the Trustpilot reviews on this page. The reviews themselves are edited under "Reviews", the supporting line and the link label under "Site Settings", and the heading is the shared one every page with this band uses. Maywood Group leads here, pinned in code: their review is about booking a feasibility before committing to a purchase, and about the study returning an answer they did not want, which argues for the product better than any wording of ours.',
          fields: [{ type: 'string', name: 'eyebrow', label: 'Eyebrow' }],
        },

        // --- FAQ ---
        {
          type: 'object',
          name: 'faq',
          label: '"The Practical Questions" section',
          fields: [
            ...sectionHeadingFields(),
            { type: 'string', name: 'lede', label: 'Supporting paragraph', ui: { component: 'textarea' } },
            {
              type: 'string',
              name: 'ctaLabel',
              label: 'Button label',
              description: 'The button beside the questions. Where it goes is set in code.',
            },
            {
              type: 'object',
              name: 'items',
              label: 'Questions',
              list: true,
              ui: { itemProps: (item) => ({ label: item?.question }) },
              description:
                'In order down the page; the first one is open when the page loads. Several of these commit the practice to something — the fee being fixed either way, VAT being included, one round of revisions, the five-day clock. Check a commitment still holds before changing how it is worded.',
              fields: [
                { type: 'string', name: 'question', label: 'Question' },
                { type: 'string', name: 'answer', label: 'Answer', ui: { component: 'textarea' } },
                {
                  type: 'object',
                  name: 'exclusions',
                  label: 'Bulleted list under the answer',
                  list: true,
                  ui: { itemProps: (item) => ({ label: item?.label }) },
                  description:
                    'Optional, and used by one question only: what is not in the fixed fee. Anything left off this list is something a client can reasonably expect to be included, so it is a scope document as much as a FAQ.',
                  fields: [{ type: 'string', name: 'label', label: 'Line' }],
                },
              ],
            },
          ],
        },

        // --- Mobile sticky bar ---
        {
          type: 'object',
          name: 'stickyCta',
          label: 'Mobile sticky bar',
          description:
            'The black bar pinned to the bottom of the screen on phones once the hero has scrolled past. The price in it is set in code, next to the pricing engine.',
          fields: [
            { type: 'string', name: 'label', label: 'Line above the price' },
            {
              type: 'string',
              name: 'ctaLabel',
              label: 'Button label',
              description:
                'This bar is narrow at 320px, so a long label pushes the price line onto two. Keep it about as short as the wording that is there now.',
            },
          ],
        },
      ],
    },

    // ──────────────────────── /feasibility-confirmed ────────────────────────
    {
      name: 'confirmed',
      label: 'Feasibility Confirmed page',
      fields: [
        {
          type: 'string',
          name: 'metaTitle',
          label: 'Browser tab title',
          description:
            'Shown in the browser tab. This page is deliberately hidden from Google — it is the tail of a paid transaction and should never be a landing page — so it is not a search result headline and there is no description to write.',
        },

        // The page shows one of two sets of copy depending on what was bought.
        // The choice is made in code from the tier Stripe sends back in its
        // success_url; that is a UI hint only and is never what confirms a
        // payment, which is the webhook's job alone. Two named groups rather
        // than one list, so neither set can be reordered away from the tier it
        // belongs to.
        {
          type: 'object',
          name: 'architectural',
          label: 'After an Architectural Feasibility deposit',
          description:
            'What someone sees after paying the 50% deposit on the architect-led feasibility. This is the version most buyers see.',
          fields: [
            { type: 'string', name: 'eyebrow', label: 'Eyebrow', description: 'The small green line beside the tick.' },
            { type: 'string', name: 'heading', label: 'Headline' },
            { type: 'string', name: 'lede', label: 'Supporting paragraph', ui: { component: 'textarea' } },
            {
              type: 'object',
              name: 'steps',
              label: 'What happens next',
              list: true,
              ui: { itemProps: (item) => ({ label: item?.title }) },
              description:
                'The numbered list under the button. The numbers are counted from the order of this list. Someone has just paid, so every line here is a promise made at the worst possible moment to break one.',
              fields: [
                { type: 'string', name: 'title', label: 'Step title' },
                { type: 'string', name: 'body', label: 'Description', ui: { component: 'textarea' } },
              ],
            },
          ],
        },

        {
          type: 'object',
          name: 'automated',
          label: 'After an Automated Site Feasibility payment',
          description:
            'What someone sees after paying for the £49.99 automated appraisal in full. It differs from the version above in more than tone: there is no architect review and no validation call at this tier, so do not copy those promises across.',
          fields: [
            { type: 'string', name: 'eyebrow', label: 'Eyebrow', description: 'The small green line beside the tick.' },
            { type: 'string', name: 'heading', label: 'Headline' },
            { type: 'string', name: 'lede', label: 'Supporting paragraph', ui: { component: 'textarea' } },
            {
              type: 'object',
              name: 'steps',
              label: 'What happens next',
              list: true,
              ui: { itemProps: (item) => ({ label: item?.title }) },
              description:
                'The numbered list under the button. One of these lines quotes the £49.99 fee: the number is wording only and does not change what anyone is charged, so ask the developer to move both together if the price ever changes.',
              fields: [
                { type: 'string', name: 'title', label: 'Step title' },
                { type: 'string', name: 'body', label: 'Description', ui: { component: 'textarea' } },
              ],
            },
          ],
        },

        {
          type: 'object',
          name: 'support',
          label: '"Something to send us?" card',
          description:
            'The bordered card at the bottom, shown after either purchase. The email address itself is set in code so the link and the words it shows can never disagree.',
          fields: [
            { type: 'string', name: 'heading', label: 'Heading' },
            { type: 'string', name: 'body', label: 'Paragraph', ui: { component: 'textarea' } },
            {
              type: 'string',
              name: 'linkLabel',
              label: 'Case study link text',
              description: 'The second link, into a worked example. Where it goes is set in code.',
            },
          ],
        },
      ],
    },
  ],
};
