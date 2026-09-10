import type { Collection } from 'tinacms';

// Every case study on the site: 35 documents, 12 feasibility studies and 23
// completed projects, one JSON file each, seeded byte-for-byte from
// data/caseStudiesData.ts.
//
// ONE collection, not two, even though `kind` selects between two mutually
// exclusive sub-trees. A single /case-studies/[slug] route resolves both, and
// feasibilityStudies, completedProjects and caseStudies are all derived from
// the one array. Splitting them would turn the GraphQL type into a union and
// force fragment handling into generateStaticParams, sitemap.ts and the detail
// view for no editorial gain. So `kind` is a required option field and both
// sub-trees are optional objects on the same document.
//
// Both sub-trees are optional ON PURPOSE, which is the same reason
// data/caseStudiesData.ts gives for keeping them optional there: Ed's
// templates arrived after the pages did, and a study or project only moves on
// to its template when there is real material to fill it. Seven of the twelve
// studies carry `feasibility`; eleven of the twenty-three projects carry
// `projectStory`. The rest still render the older challenge / approach /
// outcome narrative, and must keep being able to. Do not make either required.
//
// The filename IS the slug: st-johns-aylesbury.json renders at
// /case-studies/st-johns-aylesbury. There is no slug field to drift out of
// step with it. It is read-only, and delete is off, because roughly twenty
// redirects in next.config.ts point AT these URLs — renaming or removing one
// turns a live 301 into a 404.
//
// Create is off too, for a different reason: the listing pages
// (/case-studies/feasibility-studies, /case-studies/completed-projects), the
// home page band and the conversion pages still build their cards from
// data/caseStudiesData.ts, so a case study created here would be a detail page
// nothing on the site links to. Adding a new one is still a code change:
// add the record to the data module, add the JSON here, then the card appears
// everywhere it should.
//
// Deliberately NOT here, and staying in code:
//
//  - `slug`. It is the filename, and it is the address of the page.
//
//  - `conversionTypes` values themselves, and the ordering lists. FEATURED_SLUGS
//    in sections/ExampleProjects.tsx and COMPLETED_PROJECTS_PRIORITY in the data
//    module pick which studies lead which page. That is placement, not copy.
//
//  - floorArea, purchasePrice, projectedGDV, gdvUpliftPct and riskAvoided.
//    They exist on a handful of records in the data module and no page renders
//    any of them. A form field that changes nothing on the page reads as an
//    edit that did not save.
//
//  - The three feasibility document cards (FEASIBILITY_DOCUMENTS in the data
//    module) and the wording of the "ask for an example" form beside them.
//    Every feasibility produces the same set, so it is one shared constant
//    rather than a field repeated across 35 documents. It needs a home of its
//    own before it can be edited; noted rather than duplicated here.
//
//  - Alt text for the main image and the gallery. Both are built from the
//    title as the page renders ("Beauchamp House, photograph 3"), so they stay
//    correct on their own when the title is edited. The project story images
//    have real, written alt text and do get a field.
export const caseStudyCollection: Collection = {
  name: 'caseStudy',
  label: 'Case Studies',
  path: 'content/case-studies',
  format: 'json',

  ui: {
    // Filename to URL, one to one.
    router: ({ document }) => `/case-studies/${document._sys.filename}`,
    allowedActions: { create: true, delete: false },
    filename: {
      // The filename IS the URL: content/case-studies/<name>.json serves at
      // /case-studies/<name>. Derived from the title on create so a new study
      // gets a clean, readable slug without anyone having to think about it.
      //
      // Not readonly, because a readonly filename cannot be set at all and
      // creation would be impossible. The cost is that an existing study CAN be
      // renamed, which changes a live URL — and several of these slugs are the
      // destination of a 301 in next.config.ts, so a rename breaks an inbound
      // link silently. Hence the warning on `title` below.
      slugify: (values) =>
        String(values?.title ?? 'new-case-study')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 60) || 'new-case-study',
    },

    // Deleting is still off. A deleted study leaves a 404 where a page used to
    // be, and several are linked from the conversion pages and the homepage.
    // Removing one is a redirect decision, not an editing one.
  },

  fields: [
{
      type: 'string',
      name: 'title',
      label: 'Title',
      required: true,
      description: 'What the job was, not the address — e.g. “Six-Bed HMO To Thirteen”. On a new study the web address is built from this.',
    },
{
      type: 'string',
      name: 'kind',
      label: 'Type of case study',
      required: true,
      options: [
        { value: 'feasibility', label: 'Feasibility study' },
        { value: 'project', label: 'Completed project' },
      ],
      description: 'Which of the two lists it belongs to. It also decides which layout the page uses.',
    },
{
      type: 'string',
      name: 'location',
      label: 'Location',
      required: true,
      description: 'Town and county, e.g. “Croydon, South London”. Never the full address.',
    },
{
      type: 'string',
      name: 'tag',
      label: 'Category badge',
      required: true,
      description: 'The small pill over the image, e.g. “HMO”. Two or three words at most.',
    },
{
      type: 'string',
      name: 'buildingType',
      label: 'Building type',
      required: true,
      description: 'What the building is now, e.g. “Existing dwelling (C3)”.',
    },
{
      type: 'string',
      name: 'desc',
      label: 'Summary',
      required: true,
      ui: { component: 'textarea' },
      description: 'One or two sentences: what the building was, and what the job did with it.',
    },
{
      type: 'object',
      name: 'image',
      label: 'Main image',
      description: 'The picture beside the title and on every card. On a completed project this must be a real photograph.',
      fields: [
        { type: 'image', name: 'src', label: 'Image' },
        {
          type: 'string',
          name: 'caption',
          label: 'Caption',
          description:
            'A short line under the main image. Used for "Visualisation" on the pages whose main image is a CGI of a building not yet built (Ed, 9 September 2026), so a reader is not shown a render as a photograph. Leave empty for a photograph or a drawing.',
        },
        {
          type: 'string',
          name: 'kind',
          label: 'How to fit it',
          options: [
            { value: 'drawing', label: 'Drawing — show it whole, never cropped' },
            { value: 'photo', label: 'Photograph — fill the frame, crop if needed' },
          ],
          description:
            'A drawing is shown complete on a white ground, because cropping one cuts off the part that matters. A photograph fills its frame instead, cropping to fit. Every existing image is set to Drawing, which is how the site has always shown them — switching one to Photograph will crop it, so change it only when you want that.',
        },
      ],
    },
    {
      type: 'object',
      name: 'listing',
      label: 'Where it appears',
      description: 'How this study is placed and labelled in the two lists.',
      fields: [
  {
        type: 'number',
        name: 'order',
        label: 'Position in the list',
        description: 'Lower numbers come first. Completed projects list in this order. Feasibility studies list newest first by their date, and this only decides the order between studies with the same date or no date at all. Leave gaps (10, 20, 30) so a new one can be slotted in.',
      },
  {
        type: 'string',
        name: 'provenance',
        label: 'Who did the work',
        description: 'Only if another Thistle Group practice did the work, e.g. “By HMO Designers”. Blank for our own.',
      },
  {
        type: 'string',
        name: 'recommendation',
        label: 'Recommendation badge',
        options: [
          { value: 'Go', label: 'Go' },
          { value: 'No-Go', label: 'No-Go' },
          { value: 'Options Tested', label: 'Options Tested' },
        ],
        description: 'Feasibility studies only. Blank if it did not end in one verdict.',
      },
  {
        type: 'string',
        name: 'status',
        label: 'Build status',
        options: [
          { value: 'Complete', label: 'Complete' },
          { value: 'On site', label: 'On site' },
          { value: 'Consented', label: 'Consented' },
          { value: 'At tender', label: 'At tender' },
          { value: 'In planning', label: 'In planning' },
        ],
        description: 'The stage shown as a badge on the card and the page. Blank means Complete. Set it here, per project; nothing else has to change.',
      },
  {
        type: 'boolean',
        name: 'alsoProject',
        label: 'Also list under Projects',
        description: 'For a feasibility study whose scheme has moved on, so it appears in the Projects list as well as the studies, with the stage above as its badge. Axis House, which went to planning in March 2026, is the case this exists for.',
      },
  {
        type: 'string',
        name: 'conversionTypes',
        label: 'Conversion types',
        list: true,
        options: [
          { value: 'commercial-to-residential', label: 'Commercial to Residential' },
          { value: 'hmo', label: 'HMO' },
          { value: 'co-living-large-hmo', label: 'Co-Living / Large HMO' },
          { value: 'mixed-use-commercial', label: 'Mixed Use Commercial' },
          { value: 'high-end-residential', label: 'High-End Residential' },
        ],
        description: 'Which filters this appears under on the Completed Projects page.',
      },
      ],
    },
    {
      type: 'object',
      name: 'facts',
      label: 'Key facts',
      description: 'The band of facts under the page header. All optional.',
      fields: [
  {
        type: 'object',
        name: 'stats',
        label: 'Headline facts',
        list: true,
        ui: { itemProps: (item) => ({ label: item?.label }) },
        description: 'The three figures on the card, for a completed project or a study not yet on the template. A study with a Key information table below takes its card figures from that table instead (the first three rows that are not the route, the date or the risk), so the card cannot disagree with the page.',
        fields: [
          { type: 'string', name: 'label', label: 'What it is', description: 'The small grey line, e.g. "Bedrooms, all en suite".' },
          { type: 'string', name: 'value', label: 'The figure', description: 'The larger line underneath, e.g. "13".' },
        ],
      },
  {
        type: 'string',
        name: 'planningRoute',
        label: 'Planning route',
        description: 'e.g. “Full planning (Sui Generis)”. Blank if no route was settled.',
      },
  {
        type: 'string',
        name: 'completionDate',
        label: 'Date',
        description: 'A month and year only, e.g. "June 2026". Never a stage word: "On site" and "Complete" belong in Build status, and putting them here made pages read "Completed: On site" (item 88).',
      },
  {
        type: 'string',
        name: 'unitsBefore',
        label: 'Units before',
        description: 'Left half of the before-and-after figure, e.g. “3-bed house”.',
      },
  {
        type: 'string',
        name: 'unitsAfter',
        label: 'Units after',
        description: 'Right half of the same figure, e.g. “7-bed HMO”.',
      },
      ],
    },
    {
      type: 'object',
      name: 'writeup',
      label: 'Write-up (older layout)',
      description: 'Only used where the two templates below are left empty.',
      fields: [
  // The older layout, used by every study and project that has not moved on
      // to one of Ed's templates below. Three numbered sections down the page.
      {
        type: 'string',
        name: 'challenge',
        label: 'The Challenge',
        ui: { component: 'textarea' },
        description: 'Older layout only. What the client was up against.',
      },
  {
        type: 'string',
        name: 'approach',
        label: 'Our Approach',
        ui: { component: 'textarea' },
        description: 'Older layout only. What we actually did.',
      },
  {
        type: 'string',
        name: 'outcome',
        label: 'The Outcome',
        ui: { component: 'textarea' },
        description: 'Older layout only. What the client ended up with.',
      },
      ],
    },
{
      type: 'object',
      name: 'galleryImages',
      label: 'Drawings and photographs',
      list: true,
      ui: { itemProps: (item) => ({ label: item?.src }) },
      description: 'Sketch options on a study; the gallery at the foot of the page on a project.',
      fields: [
        { type: 'image', name: 'src', label: 'Image' },
        {
          type: 'string',
          name: 'kind',
          label: 'How to fit it',
          options: [
            { value: 'drawing', label: 'Drawing — show it whole, never cropped' },
            { value: 'photo', label: 'Photograph — fill the frame, crop if needed' },
          ],
          description:
            'A drawing is shown complete on a white ground; a photograph fills its frame and may be cropped at the edges.',
        },
      ],
    },
// ---- Ed's feasibility template (docs/2026-08-12-drive-tasks.md item 2).
    // Filling this in switches the page off the older three-section narrative
    // above and on to the template. Seven of the twelve studies have moved so
    // far; the others keep the old layout until they are written up.
    {
      type: 'object',
      name: 'feasibility',
      label: 'Feasibility study write-up',
      description:
        'The full feasibility template. Filling this in replaces the older three-section write-up above. Leave it empty on a study not written up this way — an empty template reads worse than the older layout.',
      fields: [
        {
          type: 'object',
          name: 'keyInfo',
          label: 'Key project information',
          list: true,
          ui: { itemProps: (item) => ({ label: item?.label }) },
          description:
            'The band of figures straight under the page header. Six is what the row is built for; a seventh wraps onto a second line. These replace the standard fact band rather than sitting beside it, so anything the reader needs — bedrooms, room sizes, communal space, planning route, key risk, date — belongs here.',
          fields: [
            { type: 'string', name: 'label', label: 'What it is', description: 'The small grey line, e.g. "Planning route".' },
            { type: 'string', name: 'value', label: 'The figure', description: 'The larger line underneath, e.g. "Full planning, sui generis".' },
          ],
        },
        {
          type: 'string',
          name: 'indicativeValue',
          label: 'Indicative end value',
          description:
            'Optional single line under the band, printed as "Indicative end value: …". A range is fine ("£600,000 to £680,000"). Only fill this in where the report actually put a number on it; the figure is read as a claim about a real building.',
        },
        {
          type: 'string',
          name: 'brief',
          label: '01 The Brief',
          ui: { component: 'textarea' },
          description: 'The question the client asked, in their terms. Usually one sentence, often phrased as a question.',
        },
        {
          type: 'string',
          name: 'found',
          label: '02 What We Found',
          ui: { component: 'textarea' },
          description: 'The findings: what the building will take, what the policy says, what the precedents are.',
        },
        {
          type: 'string',
          name: 'recommendation',
          label: '03 Our Recommendation',
          ui: { component: 'textarea' },
          description: 'What we told them to do. Separate from the Go / No-Go badge above, which is only the one-word version of this.',
        },
        {
          type: 'string',
          name: 'sketchCaption',
          label: 'Caption under the sketch',
          ui: { component: 'textarea' },
          description:
            'The line under "The Proposed Layout", describing what the drawing shows. Where two options were drawn, say what each one is — the reader is looking at a carousel.',
        },
        {
          type: 'object',
          name: 'guidance',
          label: 'Guidance reviewed',
          description:
            'The small grey line at the foot of "What The Client Received", naming the standards the study was checked against. Left off where no single document governed it.',
          fields: [
            {
              type: 'string',
              name: 'label',
              label: 'Wording',
              description: 'House style includes the prefix, e.g. "Official guidance reviewed: Croydon HMO space standards".',
            },
            {
              type: 'string',
              name: 'href',
              label: 'Link (optional)',
              description:
                'A web address for the document, if there is a stable public one. With a link the line becomes clickable and opens in a new tab; without one it is plain text. Nothing currently uses this — do not link to a council PDF that will move.',
            },
          ],
        },
        {
          type: 'string',
          name: 'decision',
          label: 'The Decision',
          ui: { component: 'textarea' },
          description:
            'The paragraph under "The Decision", near the foot of the page. This is the one that gets read: the honest summary of whether the scheme works and what it has to survive.',
        },
        {
          type: 'string',
          name: 'roadmap',
          label: 'Recommended roadmap',
          list: true,
          description:
            'The numbered steps under the decision, in order. Three or four words each — they are labels on a sequence, not instructions. The order is the whole point of the list, so drag rather than retype.',
        },
      ],
    },
// ---- Ed's project template (Project Explanations.docx). Same principle as
    // the feasibility template above: filling it in replaces the older
    // narrative. Ed's note on it — "visitors may not scroll through the entire
    // project page" — is why the before-and-after sits so near the top.
    {
      type: 'object',
      name: 'projectStory',
      label: 'Project story',
      description:
        'The completed-project template: the write-up, the existing-and-proposed pair, and the stages down the page. Replaces the older three-section write-up above.',
      fields: [
        {
          type: 'string',
          name: 'summary',
          label: 'The write-up',
          list: true,
          // One box per paragraph rather than one long editor, so that a click
          // on a paragraph in the preview opens that paragraph.
          ui: { component: 'textarea' },
          description:
            'The opening write-up, one paragraph per box, in order. The first paragraph prints larger than the rest, so it wants to be the one that says what the building was and what it became. These are Ed\'s own words from Project Explanations.docx.',
        },
        {
          type: 'object',
          name: 'beforeAfter',
          label: 'Existing and proposed',
          description:
            'Two photographs side by side near the top of the page, labelled "Existing" and "Completed". Ed\'s template puts it there on purpose: a reader who stops after the first screen should still see the scale of the change. Only fill it in where there is a genuine before photograph — one project has one so far.',
          fields: [
            { type: 'image', name: 'before', label: 'Before' },
            {
              type: 'string',
              name: 'beforeAlt',
              label: 'Before — description (alt text)',
              ui: { component: 'textarea' },
              description:
                'Read aloud to blind visitors and used by Google; never shown on the page. Describe what is in the photograph. Change it whenever you change the photograph.',
            },
            { type: 'image', name: 'after', label: 'After' },
            {
              type: 'string',
              name: 'afterAlt',
              label: 'After — description (alt text)',
              ui: { component: 'textarea' },
              description: 'The same, for the completed photograph.',
            },
          ],
        },
        {
          type: 'object',
          name: 'sections',
          label: 'Stages',
          list: true,
          ui: { itemProps: (item) => ({ label: item?.title }) },
          description:
            'The stages of the project, in order down the page, alternating light and white backgrounds. Ed\'s template is explicit that a stage goes in only where there is good material for it, rather than padding the page with placeholders — so a project carries the stages it can evidence and stops there. A stage with one picture shows it wide; two or more go in a grid.',
          fields: [
            { type: 'string', name: 'title', label: 'Stage heading', description: 'e.g. "The Existing Building", "Construction", "The Completed House".' },
            {
              type: 'string',
              name: 'caption',
              label: 'Introduction',
              ui: { component: 'textarea' },
              description: 'A sentence or two under the heading, before the pictures. Optional.',
            },
            {
              type: 'object',
              name: 'images',
              label: 'Pictures',
              list: true,
              ui: { itemProps: (item) => ({ label: item?.alt }) },
              description:
                'Photographs and visualisations for this stage. They are cropped to a common shape so the grid lines up, so avoid anything that loses its subject at the edges.',
              fields: [
                { type: 'image', name: 'src', label: 'Picture' },
                {
                  type: 'string',
                  name: 'alt',
                  label: 'Description (alt text)',
                  ui: { component: 'textarea' },
                  description:
                    'Read aloud to blind visitors and used by Google; never shown on the page. Describe what is in the picture, and say when it is a visualisation rather than a photograph.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'object',
      name: 'seo',
      label: 'Search listing',
      description: 'How the page reads in Google. Both can be left blank.',
      fields: [
  // Search-result copy. It never appears on the page, so it is edited here
      // and carries no click-to-edit marker.
      {
        type: 'string',
        name: 'metaTitle',
        label: 'Search result title',
        description: 'Blank uses the title above, which is usually right.',
      },
  {
        type: 'string',
        name: 'metaDescription',
        label: 'Search result description',
        ui: { component: 'textarea' },
        description: 'Blank uses the summary above. Google cuts it off around 155 characters.',
      },
      ],
    },
  ],
};
