export type CaseStudyKind = 'feasibility' | 'project';

/** The five conversion types the site sells, matching data/conversionsData.ts. */
export type ConversionType =
  | 'commercial-to-residential'
  | 'hmo'
  | 'co-living-large-hmo'
  | 'mixed-use-commercial'
  | 'high-end-residential';

export interface CaseStudy {
  slug: string;
  /** 'feasibility' = a feasibility study; 'project' = a completed build. */
  kind: CaseStudyKind;
  title: string;
  location: string;
  image: string;
  /**
   * 'drawing' or 'photo': how the image is fitted to its frame. Set only from
   * the CMS; the records in this file carry paths under /images/projects/, and
   * isDrawing() reads that prefix when the kind is absent.
   */
  imageKind?: string;
  tag: string;
  stats: { label: string; value: string }[];
  desc: string;
  challenge?: string;
  approach?: string;
  outcome?: string;
  galleryImages: string[];
  buildingType: string;
  floorArea?: string;
  planningRoute?: string;
  completionDate?: string;
  recommendation?: "Go" | "No-Go" | "Options Tested";
  /** Completed-project entries only. Defaults to Complete when unset. */
  /**
   * The project's stage. Ed's set, 9 September 2026: Complete, On site,
   * Consented, At tender, plus In planning for a study that has gone in for
   * permission. Shown as a badge on every project card and on the page.
   */
  status?: "Complete" | "On site" | "Consented" | "At tender" | "In planning";
  /**
   * A feasibility study that also belongs in the Projects list because the
   * scheme has moved on (Axis House went to planning in March 2026). It keeps
   * its study page and appears in both lists.
   */
  alsoProject?: boolean;
  /**
   * Completed projects only. When present the detail page tells the project
   * story from Ed's Project Explanations.docx: the finished building first,
   * then existing against proposed, then the stages the project went through.
   *
   * `sections` is deliberately open. The template says to include a stage only
   * where good material exists rather than pad with placeholders, so a project
   * carries the stages it can evidence and stops there.
   */
  projectStory?: {
    /** Ed's own write-up, one string per paragraph. */
    summary: string[];
    /** The transformation, shown near the top because many readers stop there. */
    beforeAfter?: { before: string; after: string; beforeAlt: string; afterAlt: string };
    sections: { title: string; caption?: string; images: { src: string; alt: string }[] }[];
  };

  /**
   * Feasibility studies only. When present the detail page renders Ed's
   * template (docs/2026-08-12-drive-tasks.md item 2) instead of the older
   * challenge/approach/outcome layout, so studies can move over one at a time.
   */
  feasibility?: {
    /** The six-field table under the hero. */
    keyInfo: { label: string; value: string }[];
    /** Optional seventh, kept separate because it is not always given. */
    indicativeValue?: string;
    brief: string;
    found: string;
    recommendation: string;
    /** Caption under the sketch. */
    sketchCaption: string;
    // No per-study document list any more. Every feasibility produces the same
    // set, and the real files name real clients and carry full addresses, so
    // nothing study-specific is published. The standard set lives in
    // FEASIBILITY_DOCUMENTS below and is requested by email.
    /** Named guidance the study worked against, shown as a small link. */
    guidance?: { label: string; href?: string };
    decision: string;
    roadmap: string[];
  };

  /**
   * Which conversion-type tabs a completed project appears under. An array
   * because Ed asked for projects to show under more than one where they fit.
   * Left unset where the project genuinely is not one of the four; those still
   * appear under All, rather than being filed somewhere wrong.
   */
  conversionTypes?: ConversionType[];
  /**
   * Set only where the work was delivered by another Thistle Group practice
   * rather than by Thistle Architecture. Publishing group work is fine, but the
   * page must not imply Thistle did the job itself.
   */
  provenance?: string;
  // Financial figures appear only where a project document supports them.
  purchasePrice?: string;
  projectedGDV?: string;
  gdvUpliftPct?: string;
  riskAvoided?: string;
  unitsBefore?: string;
  unitsAfter?: string;
}

// All entries below are real Thistle Group projects, written from the
// documents and drawings in the client's project folder. Facts that still
// need Ed's confirmation are listed in docs/case-study-confirmations.md.
/**
 * The documents that make up a feasibility. The same set every time, which is
 * why it is one constant rather than a field on each study.
 *
 * Nothing here links to a file, and that is deliberate rather than unfinished.
 * The real reports name the client and carry the full address and postcode on
 * every page, so they are not published. The cards describe what a client
 * receives, the links are inert, and anyone who wants to read one asks by
 * email and the team sends a copy. Ed's decision, on the call: "we show what
 * they get on the page but you can't click on it and see the PDF. If they want
 * to see the PDFs, they need to get in touch and we can send them an example."
 *
 * No page counts either. They varied per report, and a count is a detail about
 * one specific client's document rather than about the deliverable.
 */
export const FEASIBILITY_DOCUMENTS: { title: string; summary: string }[] = [
  {
    title: "Feasibility Overview",
    summary: "The proposed design, planning route, key constraints, commercial position and a clear Go or No-Go recommendation.",
  },
  {
    title: "Planning Research & Risk Analysis",
    summary: "Site-specific policy research, planning precedents, appeal decisions and a risk register with cost implications.",
  },
  {
    title: "Space & Standards Review",
    summary: "Bedroom, amenity, ceiling-height, kitchen and facility requirements checked room by room against the design.",
  },
];

export const caseStudies: CaseStudy[] = [
  {
    slug: "st-johns-aylesbury",
    feasibility: {
      // All figures from the project's Feasibility Overview, March 2026.
      keyInfo: [
        { label: "Bedrooms", value: "9, all en suite" },
        { label: "Room sizes", value: "12 to 16 sqm" },
        { label: "Communal space", value: "About 25 sqm" },
        { label: "Planning route", value: "Full planning, sui generis" },
        { label: "Key risk", value: "Overdevelopment" },
        { label: "Date", value: "March 2026" },
      ],
      brief: "How many bedrooms will this town centre building actually support, and where is the ceiling?",
      found: "Nine bedrooms are achievable at feasibility stage, all en suite and generously sized at 12 to 16 sqm, with about 25 sqm of communal amenity in total, which exceeds the minimum identified in recent officer reports. Local precedent is strong: several seven and eight bedroom HMOs have been approved in the area, confirming larger schemes are acceptable in principle where design and amenity standards are met. The site is not in an Article 4 area, so a six-bedroom HMO remains available under permitted development as a fallback, subject to due diligence.",
      recommendation: "Proceed at nine bedrooms, with the design worked carefully to answer overdevelopment concerns, since nine sits at the upper end of what is likely to be supported. Hold the six-bedroom permitted development route as the fallback position.",
      sketchCaption: "Nine en-suite bedrooms of 12 to 16 sqm arranged across the existing floors, with about 25 sqm of shared amenity.",
      decision: "Nine works, and it is the ceiling rather than the comfortable answer. The scheme performs well on room sizes and amenity, but it sits at the top of what officers have supported locally, so the design has to earn it.",
      roadmap: [
        "Measured survey",
        "Design development",
        "Pre-application advice",
        "Full planning application",
        "Technical design",
        "Construction",
      ],
    },
    kind: "feasibility",
    title: "Nine-Bed HMO Conversion",
    location: "Aylesbury, Buckinghamshire",
    image: "/images/projects/st-johns-sk001-1.webp",
    tag: "HMO",
    stats: [
      { label: "Bedrooms, all en-suite", value: "9" },
      { label: "Room sizes", value: "12 to 16 sqm" },
      { label: "Communal amenity", value: "25 sqm" },
    ],
    desc: "A town-centre house tested for a large HMO. The scheme reached nine generously sized en-suite rooms while staying ahead of the refusal patterns seen locally.",
    challenge: "The client wanted to know whether a substantial HMO was achievable at 4 St John's Street. Local precedent supported larger HMOs, but recent refusals in the area had been driven by undersized kitchens and insufficient communal space. The scheme had to maximise bedrooms without triggering the overdevelopment concerns that had sunk nearby applications.",
    approach: "The desk study confirmed a sustainable town-centre location with strong precedent for 7 to 8 bedroom HMOs and no Article 4 direction, which preserved a six-bed fallback under permitted development. The sketch scheme tested a nine-bedroom Sui Generis layout with every room between 12 and 16 sqm, and deliberately split 25 sqm of communal amenity across two floors, an approach the council has been more receptive to in schemes above seven occupants.",
    outcome: "The feasibility confirmed nine bedrooms are achievable, with a planning-safe eight-bed fallback if design quality concerns arise at application stage. Loft head heights and parking were flagged as the key items to confirm through measured survey. Local room rates of £800 to £850 pcm support the income case. The client left with a clear Go, a fallback position, and a defined list of next steps.",
    galleryImages: [
      "/images/projects/st-johns-existing-1.png",
      "/images/projects/st-johns-proposed-1.png",
    ],
    buildingType: "Existing dwelling (C3)",
    planningRoute: "Full planning (Sui Generis)",
    completionDate: "March 2026",
    recommendation: "Go",
  },
  {
    slug: "harpenden-police-station",
    kind: "feasibility",
    title: "Police Station To Flats",
    location: "Harpenden, Hertfordshire",
    image: "/images/projects/harpenden-sketch-1.webp",
    tag: "Commercial to Residential",
    stats: [
      { label: "Existing use", value: "Sui Generis" },
      { label: "Setting", value: "Conservation Area" },
      { label: "Sketch scheme", value: "Flats" },
    ],
    desc: "A 1990s police station in a conservation area, wrapped in policy protections and a restrictive covenant. We mapped the planning route before sketching the flats.",
    challenge: "The former Harpenden Police Station sits in the town's conservation area, next to locally listed buildings, with a restrictive covenant limiting the site to community uses. As a police station it is a Sui Generis use, so any change of use needs full planning permission, and the emerging Local Plan protects community infrastructure through Policy SP7. The question was whether residential conversion was realistic at all.",
    approach: "We produced a planning appraisal covering the adopted and emerging Local Plans and the Neighbourhood Plan, the conservation area appraisal, and the site's planning history. The key test is Policy SP7: a change of use must show the police function has been re-provided or is no longer required, which the evidence supports. With the building only around 30 years old, reuse scored better than redevelopment, so we sketched flat layouts within the existing envelope, colour-coded by use, respecting daylight to the neighbouring office building.",
    outcome: "The appraisal concluded that a case could be made for residential and other town-centre uses, subject to the SP7 test and the covenant, and flagged the lack of outside amenity space as the main design constraint for housing. The sketch scheme shows how flats fit the existing building. The client went into negotiations knowing exactly which hurdles matter and in what order.",
    galleryImages: [
      "/images/projects/harpenden-sketch-1.webp",
    ],
    buildingType: "Police station (Sui Generis)",
    planningRoute: "Full planning",
    completionDate: "November 2025",
    recommendation: "Options Tested",
  },
  {
    slug: "greyfriars-kings-lynn",
    kind: "feasibility",
    title: "Office To Residential Or HMO",
    location: "King's Lynn, Norfolk",
    image: "/images/projects/greyfriars-option4-1.webp",
    tag: "Mixed Use",
    stats: [
      { label: "Routes compared", value: "2" },
      { label: "HMO option", value: "9 en-suite" },
      { label: "Both options", value: "With extension" },
    ],
    desc: "One building, two viable futures. We drew both the conventional residential option and the nine-bed co-living option so the client could compare returns directly.",
    challenge: "The Greyfriars building could plausibly become conventional flats or a large co-living HMO, and each route carries different planning risk, build cost, and income. Committing to the wrong use class early would have meant abortive design fees and a weaker planning story. The client needed both options tested to the same standard before choosing.",
    approach: "We sketched the building both ways. Option 2 tests a residential conversion with an extension. Option 4 tests a nine-bedroom en-suite HMO with distributed shared spaces, also with the extension. Both layouts are colour-coded by room function, with bedroom sizes and shared amenity areas stated on the drawings, so the two schemes can be compared like for like.",
    outcome: "The client received two fully drawn options for the same envelope, each with its own unit and room schedule. That turned an abstract use-class decision into a straightforward comparison of income, build scope, and planning position.",
    galleryImages: [
      "/images/projects/greyfriars-option2-1.webp",
      "/images/projects/greyfriars-option4-1.webp",
    ],
    buildingType: "Office and mixed use",
    planningRoute: "Full planning",
    recommendation: "Options Tested",
  },
  {
    slug: "axis-house",
    kind: "feasibility",
    title: "Office To High-End Houses",
    location: "Compton, Newbury",
    image: "/images/projects/axis-house-elevation-1.webp",
    tag: "Commercial to Residential",
    stats: [
      { label: "Sketch proposals tested", value: "3" },
      { label: "Unit mix identified", value: "5 houses" },
      { label: "Three-bed units", value: "83 sqm" },
    ],
    desc: "A rural office building tested against three different sketch schemes, landing on a terrace of four three-bed houses and one two-bed unit.",
    challenge: "Axis House is an office building in a village setting, and the client wanted to understand its highest-value residential future. Flats, a small number of large houses, and a terrace of family homes were all plausible, with very different values and build scopes.",
    approach: "We tested three sketch proposals over the existing plans, working with the building's structural grid. The preferred scheme divides the building into four three-bed houses of around 83 sqm each plus one larger two-bed unit, using ground floor timber-frame extensions, new rear openings, dormers, and rooflights to make each house work over three floors.",
    outcome: "The client received drawn options with elevations for the preferred scheme, a clear unit mix, and the alterations list that planning and costing conversations need. Three rounds of sketch testing settled the direction before any detailed design fees were spent.",
    // Section 04 audit, August 2026: both images were the raw PDF export with
    // the full title block, disclaimer and Thistle logo still visible, which
    // is exactly what Ed's final brief asks to be cropped out. Re-cropped from
    // the source PDFs in "03 New Website/Feasibility Examples", content only.
    // The second proposal's sketch (elevation-2/plans-2) is added here since
    // the source folder has it and the copy already refers to multiple
    // proposals being tested. NB: the source also contains a file named
    // "Sketch Proposal 3 - Elevation.pdf", but its content (including the red
    // unit-schedule annotations) is identical to Proposal 2's, just faintly
    // rendered, so it reads as a duplicate export rather than a genuine third
    // design. Not included here pending confirmation; flagged to Akash.
    galleryImages: [
      "/images/projects/axis-house-plans-1.webp",
      "/images/projects/axis-house-elevation-1.webp",
      "/images/projects/axis-house-plans-2.webp",
      "/images/projects/axis-house-elevation-2.webp",
    ],
    buildingType: "Office",
    planningRoute: "Full planning",
    completionDate: "October 2025",
    recommendation: "Options Tested",
  },
  {
    slug: "southgate-winchester",
    kind: "feasibility",
    title: "Listed Building To Co-Living",
    location: "Winchester, Hampshire",
    image: "/images/projects/southgate-sketch-1.png",
    tag: "HMO",
    conversionTypes: ['co-living-large-hmo', 'hmo'],
    stats: [
      { label: "Co-living design", value: "10 beds" },
      { label: "Ground floor", value: "Shop retained" },
      { label: "Constraint", value: "Listed building" },
    ],
    desc: "A listed building on Southgate Street tested for a ten-bed co-living scheme above a retained shop, with private and shared gardens worked into the plan.",
    challenge: "Listed buildings are the hardest conversion category: every internal alteration needs justifying, and co-living intensity multiplies the scrutiny. The client wanted to know whether a ten-bed co-living scheme could work at 23 Southgate while keeping the existing shop trading on the ground floor.",
    approach: "The sketch study worked floor by floor through the building, testing en-suite provision against the existing wall layout, retaining the shop frontage, and allocating the rear garden between shared amenity and private space for the ground-floor rooms. Proposed ensuites and new partitions are drawn against the existing fabric so the listed building impact is visible from the start.",
    outcome: "The study shows a ten-bed co-living layout with the shop partially retained, sunken garden amenity for the basement room, and a shared garden strategy. The client can now brief heritage consultants and approach pre-application discussions with a concrete scheme rather than a hope.",
    galleryImages: [
      "/images/projects/southgate-sketch-1.png",
    ],
    buildingType: "Listed mixed use, shop and residential",
    planningRoute: "Full planning and listed building consent",
    recommendation: "Options Tested",
  },
  {
    slug: "beech-house-road-croydon",
    feasibility: {
      // All figures from the project's Feasibility Overview, June 2026.
      keyInfo: [
        { label: "Bedrooms", value: "13, all en suite" },
        { label: "Room sizes", value: "12.6 to 27 sqm" },
        { label: "Communal space", value: "26 sqm kitchen, 13.8 sqm dining" },
        { label: "Planning route", value: "Full planning, sui generis" },
        { label: "Key risk", value: "Political, not policy" },
        { label: "Date", value: "June 2026" },
      ],
      brief: "Could an existing six-bedroom HMO be taken to thirteen bedrooms, and would the planning position support it?",
      found: "Yes, entirely within the existing envelope through internal alterations only, with no extension. All thirteen bedrooms are en suite at 12.6 to 27 sqm, against a Croydon en-suite minimum of 12.5 sqm. The communal hub is a 26 sqm kitchen and a 13.8 sqm dining room on the ground floor, supported by a second kitchen on the second floor and a 9.1 sqm utility. The lawful six-bed C4 use granted in 2025 is the baseline, so no family dwelling is lost, Croydon has no adopted HMO density threshold, and a directly comparable thirteen-bed sui generis HMO was approved nearby in 2022.",
      recommendation: "Proceed at thirteen bedrooms. The policy case is sound and the risk to manage is political: the site is in a conservation area, ward councillors have opposed nearby schemes, and a nearby seven-bed HMO was refused at committee in 2025. The application needs presenting with that in mind.",
      sketchCaption: "Thirteen en-suite bedrooms from basement to second floor, all within the existing envelope, with the ground floor kitchen and dining room as the communal hub.",
      guidance: { label: "Official guidance reviewed: Croydon HMO space standards" },
      decision: "The scheme works on paper and on policy: an established lawful six-bed use, no density threshold in the borough, and a directly comparable approval nearby. What it has to survive is a committee in a conservation area that has refused smaller schemes.",
      roadmap: [
        "Measured survey",
        "Design development",
        "Pre-application advice",
        "Full planning application",
        "Technical design",
        "Construction",
      ],
    },
    kind: "feasibility",
    title: "Six-Bed HMO To Thirteen",
    location: "Croydon, South London",
    image: "/images/projects/beech-house-sketch-1.webp",
    tag: "HMO",
    stats: [
      { label: "Bedrooms, all en suite", value: "13" },
      { label: "Room sizes", value: "12.6 to 27 sqm" },
    ],
    desc: "A four-storey period house already running as a six-bed HMO, tested for more than double the room count using internal works only.",
    challenge: "The house was a lawful six-bedroom HMO in a Croydon conservation area, and the owner wanted to know how far it could go. The obstacle was not policy but politics: ward councillors had opposed HMO schemes nearby, a seven-bed application nearby had been refused at committee, and Croydon has no allowed HMO appeal on record since 2021. Any scheme had to be designed to pass at first determination.",
    approach: "The analysis confirmed the strongest possible location case: East Croydon station 540 metres away, PTAL 6a to 6b, and a Central controlled parking zone that supports a car-free scheme. It also found the lead precedent, a 13-bed sui generis HMO approved nearby in 2022 against 353 objections, in the same high-PTAL context. The sketch scheme then matched that precedent on every measurable point: 13 en-suite rooms from 12.6 to 27 sqm against a 12.5 sqm standard, around 40 sqm of internal communal space, three kitchen sets, and no external alterations at all, which largely removed the conservation area from the assessment.",
    outcome: "A Go. Because the property is already a lawful HMO, no family dwelling is lost, the logic Croydon officers used to approve a comparable scheme nearby. Indicative figures: £900 per room per month gives £140,400 gross a year and roughly £105,300 net, supporting a value in the order of £1.24m against a conversion cost of about £429,000. The recommendation was to proceed straight to planning drawings and a complete first-time submission.",
    galleryImages: [
      "/images/projects/beech-house-sketch-1.webp",
    ],
    buildingType: "Existing HMO (C4)",
    floorArea: "Four levels, basement to second floor",
    planningRoute: "Full planning (Sui Generis)",
    completionDate: "June 2026",
    recommendation: "Go",
    projectedGDV: "£1.24m",
  },
  {
    slug: "claremont-road-luton",
    feasibility: {
      // All figures from the project's Feasibility Overview, July 2026.
      keyInfo: [
        { label: "Bedrooms", value: "7, all en suite" },
        { label: "Room sizes", value: "10 sqm and above" },
        { label: "Communal space", value: "About 32 sqm" },
        { label: "Planning route", value: "Six-bed LDC, then full planning" },
        { label: "Key risk", value: "Family housing protection" },
        { label: "Date", value: "July 2026" },
      ],
      brief: "Could a large, already extended mid-terrace take a seven-bedroom all en-suite HMO, and which route gets there with the least planning risk?",
      found: "Six bedrooms plus a rear dormer loft are permitted development, confirmed by a lawful development certificate. The seventh is sui generis and turns on the protection of family housing, applied in Luton through Policies LLP1 and LLP15. Phasing answers it: establish and tenant the six-bed C4 first, and the seventh is then judged as an addition to an existing HMO rather than the loss of a family home. A nearby approval at 39 Hazelbury Crescent granted a seventh person on exactly that basis. No bedroom falls below 10 sqm against a 6.51 sqm legal minimum, and the communal space is about 32 sqm against a 23.5 sqm target.",
      recommendation: "Proceed to seven bedrooms in two stages. Take the six-bed certificate first and implement it properly, with tenancies and licence records kept rather than relying on a paper approval, then apply for the seventh. The 20 sqm outbuilding becomes shared co-working space, which strengthens that application. Eight persons is possible later but is not recommended as a base case.",
      sketchCaption: "Seven en-suite bedrooms across three floors, with the whole rear given over to a single kitchen, dining and living space opening onto the garden, and two further bedrooms in a new rear dormer.",
      guidance: { label: "Official guidance reviewed: Luton Borough Council HMO Standards" },
      decision: "The six-bedroom route is low risk and needs no planning permission. The seventh is achievable when the scheme is phased so that there is no family dwelling left to lose, which is the one policy that could defeat it.",
      roadmap: [
        "Measured survey",
        "Six-bed lawful development certificate",
        "Implement and tenant",
        "Full planning for the seventh",
        "Technical design",
        "Construction",
      ],
    },
    kind: "feasibility",
    title: "Three-Bed House To Seven-Bed HMO",
    location: "Luton, Bedfordshire",
    image: "/images/projects/claremont-sketch-1.webp",
    tag: "HMO",
    stats: [
      { label: "Bedrooms, all en suite", value: "7" },
      { label: "Communal space provided", value: "32 sqm" },
    ],
    desc: "A mid-terrace house tested for a seven-bed HMO, delivered in two stages so the riskiest room is argued from the strongest position.",
    challenge: "The client was looking at a three-bedroom terrace guided around £350,000 and wanted seven en-suite rooms out of it. The planning designations were clean, no Article 4, conservation area, flood zone or green belt, so a six-bed C4 HMO was permitted development. The seventh bedroom was the problem: it tips the scheme into sui generis and runs into Luton's protection of family housing.",
    approach: "Rather than apply for seven rooms in one go, the study phased it. Stage one takes the six-bed C4 HMO plus a rear dormer loft, both permitted development, confirmed by a Lawful Development Certificate. Stage two adds the seventh bedroom by full planning, once the six-bed HMO is established and tenanted. The sequence matters: once the property is a lawful HMO there is no family dwelling left to lose, so the seventh room is judged as an addition to an existing HMO rather than the loss of a family home. A nearby approval at 39 Hazelbury Crescent granted a seventh person on exactly that basis.",
    outcome: "A Go, with the phasing as the core recommendation. Every bedroom exceeds 10 sqm against a 6.51 sqm legal minimum, and communal space lands at about 32 sqm against a 23.5 sqm target. A 20 sqm outbuilding becomes shared co-working space, which strengthens the seventh-bed case because officers view extra amenity favourably. Seven rooms at an indicative £675 per month give about £56,700 gross a year, roughly £42,500 net, implying about £500,000 of value against a build cost of £200,000 to £220,000. The loft head height was flagged as the main survey item.",
    galleryImages: [
      "/images/projects/claremont-sketch-1.webp",
    ],
    buildingType: "Existing dwelling (C3)",
    planningRoute: "Permitted development (C4), then full planning",
    completionDate: "July 2026",
    recommendation: "Go",
    projectedGDV: "£500,000",
    unitsBefore: "3-bed house",
    unitsAfter: "7-bed HMO",
  },
  {
    // 155 Windmill Lane, Cheshunt. This is the study Ed wrote his
    // "Feasibility Example Page" template around: every figure in his key
    // information table matches this project's Feasibility Overview (July 2026),
    // and his three document cards match its actual page counts.
    // The client name, full address and project reference are deliberately not
    // published; the location is given as Ed gives it in the template.
    slug: "windmill-lane-cheshunt",
    kind: "feasibility",
    title: "Three-Bed House To Six-Bed HMO",
    location: "Cheshunt, Hertfordshire",
    image: "/images/projects/windmill-lane-hero.jpg",
    tag: "HMO",
    stats: [
      { label: "Bedrooms, all en suite", value: "6" },
      { label: "Communal space", value: "26 sqm" },
      { label: "Planning permission", value: "Householder only" },
    ],
    desc: "Pre-purchase feasibility testing the conversion of a detached family home into a six-bedroom, all en-suite HMO, with the garage brought into the house.",
    galleryImages: [
      "/images/projects/windmill-lane-sketch-1.webp",
    ],
    buildingType: "Detached three-bed house (C3)",
    floorArea: "89.5 sqm existing",
    planningRoute: "Householder application, then C4 lawful development certificate",
    completionDate: "July 2026",
    recommendation: "Go",
    unitsBefore: "3-bed house",
    unitsAfter: "6-bed HMO",
    feasibility: {
      keyInfo: [
        { label: "Bedrooms", value: "6, all en suite" },
        { label: "Room sizes", value: "9.5 to 12.5 sqm" },
        { label: "Communal space", value: "26 sqm" },
        { label: "Planning route", value: "Householder application, then C4 LDC" },
        { label: "Date", value: "July 2026" },
      ],
      brief: "Could a detached three-bedroom house be converted into a compliant and commercially viable six-bedroom HMO before the client committed to buying it?",
      found: "Six en-suite bedrooms are achievable without the loft, which at roughly 1.8 metres to the ridge cannot meet the 2.13 metre standard and is given over to plant and storage instead. The garage is brought into the house through a new full-width rear extension, creating a 26 sqm kitchen and dining space and an 11.7 sqm ground floor bedroom. Every room clears the borough's 9 sqm minimum.",
      recommendation: "Proceed at six bedrooms in Use Class C4. A householder application covers the extension and the garage connection, and a lawful development certificate confirms the change of use once the works are done. Appoint a flood risk assessor before the application. A seventh bedroom would make the use sui generis and require full planning permission, so the value here lies in holding it at six.",
      sketchCaption: "Six all-en-suite bedrooms across two floors, with the existing garage brought in as Bed 3 and a new 26 sqm kitchen and dining space opening onto the garden.",
      guidance: { label: "Official guidance reviewed: Broxbourne HMO Amenity Guidance" },
      decision: "The feasibility confirmed a compliant six-bedroom layout and a supportable planning strategy, with direct local precedent for the garage conversion and an appeal decision a kilometre away. It also identified flood risk as the one input that cannot be settled before a specialist reports.",
      roadmap: [
        "Measured survey",
        "Flood risk assessment",
        "Householder application",
        "Technical design",
        "Construction",
        "C4 lawful development certificate",
      ],
    },
  },
  {
    slug: "gyfford-walk-cheshunt",
    feasibility: {
      // Figures taken from the project's own Feasibility Overview, July 2026.
      // Ed's template document uses a worked example that does not match this
      // site: it describes a detached three-bed with a garage and Flood Zone 3,
      // where 2 Gyfford Walk is a two-bed semi in Flood Zone 1 with the loft as
      // the variable. The template's structure is followed; its figures are not.
      keyInfo: [
        { label: "Bedrooms", value: "6, all en suite" },
        { label: "Room sizes", value: "9.7 to 14 sqm" },
        { label: "Communal space", value: "17 sqm" },
        { label: "Planning route", value: "Permitted development, C4" },
        { label: "Key risk", value: "Loft headroom" },
        { label: "Date", value: "July 2026" },
      ],
      brief: "The client already ran an HMO nearby and wanted the same product here. Could a two-bed semi take six en-suite bedrooms while staying inside Use Class C4, where the change of use is permitted development and needs no planning permission at all?",
      found: "Six en-suite bedrooms work using the existing footprint and the rear extension already built under permitted development, with the boiler and services moved to the ground floor utility room to free the loft. The loft is the variable: only floor area with headroom above 1.5 metres counts, and it had not been measured, so a five-bed fallback was drawn alongside the six-bed scheme.",
      recommendation: "Proceed as a six-bedroom C4 HMO under permitted development. Measure the loft before fixing the design, and treat the roof works as a separate householder application if the hip-to-gable and rear dormer together exceed the 50 cubic metre allowance.",
      sketchCaption: "Option A takes six en-suite bedrooms across three floors with loft rooms of 12.3 and 9.7 sqm. Option B takes five, with a single 22 sqm loft bedroom, if the headroom falls short.",
      guidance: { label: "Official guidance reviewed: Broxbourne HMO Amenity Guidance" },
      decision: "The feasibility confirmed a compliant six-bedroom layout on a route that needs no planning permission, and identified the unmeasured loft as the one thing that decides between six bedrooms and five.",
      roadmap: [
        "Measured survey",
        "Confirm loft headroom",
        "Roof works, if needed",
        "Technical design",
        "Construction",
        "C4 lawful development certificate",
      ],
    },
    kind: "feasibility",
    title: "Two-Bed Semi To Six-Bed HMO",
    location: "Cheshunt, Hertfordshire",
    image: "/images/projects/gyfford-optiona-1.png",
    tag: "HMO",
    stats: [
      { label: "Options tested", value: "2" },
      { label: "Bedrooms, all en suite", value: "5 or 6" },
      { label: "Planning permission", value: "Not required" },
    ],
    desc: "A two-bed semi tested for a six-bed HMO that needs no planning permission at all, with a five-bed fallback drawn for the loft risk.",
    challenge: "The client already ran an HMO nearby and wanted the same product here. The prize was staying inside Use Class C4, because a six-person HMO is then permitted development and needs no planning permission, while seven rooms would push it to sui generis and pull in a full application and a parking survey. Everything depended on whether the loft could take two bedrooms, which had not been measured.",
    approach: "The scheme was designed to use the existing footprint, reusing the substantial rear extension already built under permitted development and relocating services to the ground floor utility room to free the loft. Because only floor area with a ceiling height above 1.5 metres counts toward room sizes, and the loft was unmeasured, two options were drawn rather than one. Option A takes six bedrooms if the headroom is sufficient, with loft rooms of 12.3 and 9.7 sqm. Option B takes five, with a single 22 sqm loft bedroom. The client priority was generous bedrooms over a large communal room, so the kitchen and dining space is held at a functional 17 sqm.",
    outcome: "Both options confirmed as permitted development, with Broxbourne holding no Article 4 direction and recent certificates granted locally on comparable properties. A directly comparable seven-bed all en-suite conversion with a rear dormer has been approved nearby, placing the six-bed scheme comfortably within precedent. The single planning risk is the roof: a combined hip-to-gable and full-width rear dormer may exceed the 50 cubic metre permitted development allowance, which would make the roof works a householder application rather than the change of use.",
    galleryImages: [
      "/images/projects/gyfford-optiona-1.png",
      "/images/projects/gyfford-optionb-1.png",
    ],
    buildingType: "Existing dwelling (C3)",
    planningRoute: "Permitted development (C4)",
    completionDate: "July 2026",
    recommendation: "Options Tested",
    unitsBefore: "2-bed semi",
    unitsAfter: "5 or 6-bed HMO",
  },
  {
    slug: "hathaway-road-croydon",
    feasibility: {
      // All figures from the project's Feasibility Overview, July 2026. This is
      // the one No-Go in the set: the answer was a different use, not a refusal.
      keyInfo: [
        { label: "Bedrooms", value: "5, 11 to 18 sqm" },
        { label: "Communal space", value: "16 sqm" },
        { label: "Floor area", value: "93 to 115 sqm" },
        { label: "Planning route", value: "C3(b) supported living, by LDC" },
        { label: "Key risk", value: "Securing a care provider" },
        { label: "Date", value: "July 2026" },
      ],
      brief: "The client wanted to know whether this house could become an HMO.",
      found: "It could not, and the reason is a floor area threshold rather than anything about the design. Croydon protects family homes below 130 sqm from conversion to an HMO under Policies SP2 and DM1.2 of its Local Plan, and this property is between 93 and 115 sqm, so an HMO application would be very likely to be refused. A different use answers the same building: C3(b) supported living needs no HMO licence, and the layout suits it, with five bedrooms of 11 to 18 sqm and 16 sqm of communal amenity. Permitted development rights are intact, including for a rear extension and a loft conversion.",
      recommendation: "Do not pursue an HMO. Identify and engage a care or support provider willing to operate the property as C3(b) before committing to works or to the purchase, since that is the step everything else depends on. Confirm the provider's requirements on room count, en suites and communal space, verify the floor area by measured survey, and take a specialist broker's view on end value.",
      sketchCaption: "Five en-suite bedrooms of 11 to 18 sqm with a 16 sqm communal amenity space, laid out for supported living rather than as a licensed HMO.",
      guidance: { label: "Official guidance reviewed: Croydon HMO Standards, Housing Act 2004" },
      decision: "A clear no on the HMO, and a route that works in its place. The value of the study was in finding the threshold before the client bought the building, not after.",
      roadmap: [
        "Engage a support provider",
        "Confirm provider requirements",
        "Measured survey",
        "Broker view on end value",
        "C3(b) lawful development certificate",
      ],
    },
    kind: "feasibility",
    title: "When The HMO Is The Wrong Answer",
    location: "Croydon, South London",
    image: "/images/projects/hathaway-sketch-1.webp",
    tag: "Supported Living",
    stats: [
      { label: "Bedrooms via C3(b)", value: "5" },
      { label: "Planning permission", value: "Not required" },
    ],
    desc: "A feasibility that told the client not to do what they asked for, then found a route that needs no planning permission at all.",
    challenge: "The client wanted an HMO in a highly sustainable Croydon location: PTAL 6a, a short walk from West Croydon station, generously sized rooms, and full permitted development rights intact. On the face of it the property looked ideal.",
    approach: "One fact decided it. The gross internal floor area is below 130 sqm, and Croydon protects family homes below that threshold from HMO conversion under Policies SP2 and DM1.2 of its Local Plan. The council measures the original floor area and disregards any extension or loft space, so neither a rear extension nor a loft conversion overcomes the policy, and reducing the room count does not help because the loss of the family house is the objection. The local planning authority indicated it would not even recommend a pre-application enquiry. Rather than stop there, the study tested an alternative: C3(b) supported living, a dwellinghouse for up to six adults living as a single household where care is provided.",
    outcome: "A No-Go on the HMO, with a recommended route instead. Because C3(b) stays within Use Class C3, a genuine change from a family dwelling is not development and needs no planning permission, and neither the family housing policy nor the Article 4 direction applies. The sketch layout shows five bedrooms from 11 to 18 sqm and 16 sqm of communal amenity within the existing building, without touching the loft or extending. This is not an HMO by another name: it requires a genuine care provider, contracts evidenced to the council, and confirmation by a Lawful Development Certificate.",
    galleryImages: [
      "/images/projects/hathaway-sketch-1.webp",
    ],
    buildingType: "Existing dwelling (C3)",
    floorArea: "Below 130 sqm",
    planningRoute: "C3(b) supported living, confirmed by LDC",
    completionDate: "July 2026",
    recommendation: "No-Go",
    riskAvoided: "An HMO application that was very likely to be refused",
  },
  {
    slug: "bath-street-cheddar",
    feasibility: {
      // All figures from the project's Feasibility Overview, June 2026.
      keyInfo: [
        { label: "Bedrooms", value: "11, all en suite" },
        { label: "Room sizes", value: "10 to 22 sqm" },
        { label: "Communal space", value: "27.5 sqm, plus 10 sqm" },
        { label: "Retained shop", value: "45.2 sqm Class E" },
        { label: "Planning route", value: "Full planning, sui generis" },
        { label: "Date", value: "June 2026" },
      ],
      brief: "Could a former Lloyds Bank in a village centre become an HMO without losing the shop the neighbourhood plan protects?",
      found: "Yes, as a mixed use rather than a straight conversion. The 45.2 sqm Class E unit stays in place at the Bath Street frontage, with an eleven-bed sui generis HMO above and behind it across ground, first, second and a new mansard at third floor. Rooms run from 10 sqm in the mansard to 22 sqm on the ground floor. The first floor communal kitchen and lounge is 27.5 sqm, meeting the standard for the seven to ten person bracket, with a smaller 10 sqm kitchen on the mansard serving the upper cluster. The principle of residential conversion is already established by an existing prior approval, and the rear car park takes the highways question off the table.",
      recommendation: "Proceed as a mixed use, retaining the shop. There is direct precedent for the approach in similar Somerset villages.",
      sketchCaption: "Eleven en-suite bedrooms across four levels above and behind a retained 45.2 sqm shop, with the main communal kitchen and lounge on the first floor.",
      guidance: { label: "Official guidance reviewed: Cheddar Neighbourhood Plan, Policy EE1" },
      decision: "The principle is already established and the highways question is answered. The mixed use is designed around the neighbourhood plan's protection of the ground floor shop rather than against it.",
      roadmap: [
        "Measured survey",
        "Heritage statement",
        "Pre-application advice",
        "Full planning application",
        "Technical design",
        "Construction",
      ],
    },
    kind: "feasibility",
    title: "Former Bank To Eleven-Bed HMO And Shop",
    location: "Cheddar, Somerset",
    image: "/images/projects/cheddar-sketch-1.webp",
    tag: "Mixed Use",
    stats: [
      { label: "Bedrooms, all en suite", value: "11" },
      { label: "Retail unit retained", value: "45.2 sqm" },
      { label: "Room sizes", value: "10 to 22 sqm" },
    ],
    desc: "A former high-street bank, now acquired, tested for a mixed-use scheme that keeps the shopfront working and puts eleven en-suite rooms above it.",
    challenge: "The former Lloyds Bank closed in January 2023 and was heading to auction at a guide of around £400,000, with two cottages alongside and all three buildings needing a full back-to-brick refurbishment. The site sits in the Cheddar Conservation Area, and the Market Cross at the top of Bath Street is both Grade II* listed and a Scheduled Monument, so its setting carries the highest level of heritage protection. A prior approval already established that the bank and cottages could become four dwellings, which set the fallback the scheme had to beat.",
    approach: "The recommended scheme is mixed use rather than pure residential. The 45.2 sqm Class E unit stays in place at the Bath Street frontage with its shopfront active, and an eleven-bed sui generis HMO sits above and behind it across ground, first, second and a new mansard. Keeping the commercial unit answers Cheddar Neighbourhood Plan Policy EE1, which resists converting commercial centre properties to residential at ground floor level, and follows an approved approach taken elsewhere in the district. The consented 20-space rear car park takes the highways and parking question off the table under Policy D14, and the new mansard sits behind the existing front parapet so the view from the Market Cross junction reads as before.",
    outcome: "A Go on the mixed-use scheme. All eleven rooms are en suite and exceed the proxy minimum, from 10 sqm in the mansard to 22 sqm on the ground floor, with a 27.5 sqm communal kitchen and lounge on the first floor and a second kitchen serving the upper cluster. The quantum stays well clear of a much larger scheme refused nearby. Removing the commercial unit would free space for two more bedrooms, but that upside was deliberately parked: Policy EE1 would need a documented marketing exercise and evidenced vacancy to overturn, so the safer route is to secure the eleven-bed scheme now and return for the extra rooms later.",
    galleryImages: [
      "/images/projects/cheddar-sketch-1.webp",
    ],
    buildingType: "Former bank (Class E) and two cottages",
    planningRoute: "Full planning (Sui Generis), mixed use",
    completionDate: "June 2026",
    recommendation: "Go",
    purchasePrice: "~£400,000 auction guide",
  },

  // ---------------------------------------------------------------------
  // Completed projects. PLACEHOLDERS: names come from the client's project
  // folders, but imagery and copy are stand-ins until Ed supplies real
  // photography and write-ups. Tracked in docs/case-study-confirmations.md.
  // ---------------------------------------------------------------------
  {
    slug: "beauchamp-house",
    projectStory: {
      // Ed's own write-up, from Project Explanations.docx, where the building is
      // spelt "Beecham House". The site has used Beauchamp throughout and the
      // street in Leamington Spa is Beauchamp, so that spelling is kept. Worth
      // confirming with Ed which is right.
      summary: [
        "The conversion of an existing office building in Leamington Spa into four luxury apartments, creating one substantial apartment on each floor within a characterful Georgian property.",
        "The proposals involve a complete internal reconfiguration of the building, alongside the replacement of all existing windows and a considered programme of external alterations. The site sits within a sensitive conservation area, surrounded by a number of listed buildings, requiring a carefully considered approach to both the conversion and the external appearance.",
        "Thistle Architecture was appointed from the outset, initially securing Class MA Prior Approval for the change of use from commercial to residential, followed by a full planning application for the wider works and alterations to the building.",
        "The project is currently under construction and will transform the former office building into four high-quality apartments while retaining and enhancing the architectural character of the existing property.",
      ],
      // Under construction, so the page ends there rather than inventing a
      // completed section.
      sections: [
        {
          title: "The Existing Building",
          caption: "A Georgian property in a conservation area surrounded by listed buildings, in office use before conversion.",
          images: [
            { src: "/images/projects/beauchamp2/exterior.jpg", alt: "The Georgian building in its existing condition from the street" },
          ],
        },
        {
          title: "Construction",
          caption: "Stripped back to structure internally, with the building scaffolded for the window replacement and external alterations.",
          images: [
            { src: "/images/projects/beauchamp2/stripout-1.jpg", alt: "An interior stripped back to brick and joists during conversion" },
            { src: "/images/projects/beauchamp2/stripout-2.jpg", alt: "A bay-windowed room stripped back, with work in progress" },
            { src: "/images/projects/beauchamp2/scaffold-1.jpg", alt: "The building fully scaffolded for external alterations" },
            { src: "/images/projects/beauchamp2/scaffold-2.jpg", alt: "Scaffolding to the side elevation during the window replacement" },
          ],
        },
      ],
    },
    conversionTypes: ['commercial-to-residential'],
    kind: "project",
    title: "Beauchamp House",
    location: "Royal Leamington Spa, Warwickshire",
    // Ed's August 2026 final brief: card thumbnails must be a real completed-
    // project photograph, never a drawing preview. beauchamp-elevation-1.png
    // is a drawing crop; a real exterior shot already exists in this
    // project's own gallery below, so the listing card now uses that instead.
    image: "/images/projects/beauchamp2/exterior.jpg",
    tag: "Office to Flats",
    stats: [
      { label: "Flats", value: "4" },
      { label: "Flat sizes", value: "73.4 to 80.3 sqm" },
      { label: "Status", value: "On site" },
    ],
    desc: "A Regency building on Kenilworth Road being converted from offices into four flats, from the basement up into the roof.",
    challenge: "Beauchamp House is a period property on Kenilworth Road, and everything that gives it character also constrains it: sash and bay windows to keep, chimneys to retain, and a roof that had to take new accommodation without changing how the building reads from the street.",
    approach: "The conversion works the full height of the building. Flat 1 takes the basement at 74.9 sqm, Flat 2 the ground floor at 80.3 sqm, and Flat 4 the loft at 73.4 sqm, each with en suites and its own kitchen and dining space. The existing windows are retained and upgraded with secondary glazing matched to the profile of the originals, the chimneys stay, and new rooflights are conservation pattern so the roofline is not disturbed. A vaulted ceiling was added to the second floor during the design. External walls are thermally lined rather than replaced, which is what keeps a building like this workable.",
    outcome: "The scheme is on site. Drawings are at Building Regulations stage and have been through five revisions, several of them amendments following site meetings, which is the normal rhythm of a retrofit where the building tells you things the survey did not.",
    galleryImages: [
      "/images/projects/beauchamp-plans-1.png",
      "/images/projects/beauchamp-site-1.jpg",
      "/images/projects/beauchamp-site-2.jpg",
    ],
    buildingType: "Period office building",
    planningRoute: "Office to residential conversion",
    unitsAfter: "4 flats",
    status: "On site",
  },
  {
    // The Design and Access Statement for this scheme is authored by
    // incollective.works, the group's parent company (confirmed by Akash
    // 2026-07-17), so it is group work and fine to publish here.
    slug: "bereweeke-avenue",
    projectStory: {
      // Ed's own write-up, from Project Explanations.docx.
      summary: [
        "A comprehensive extension and reconfiguration of an existing family home in a residential area of Winchester, designed to provide significantly more space for a growing family.",
        "The proposals included two substantial two-storey rear extensions, a single-storey extension connected by a glazed link, a complete internal reconfiguration, and the redesign and landscaping of both the front and rear gardens.",
        "Thistle Architecture was appointed from the outset, undertaking the initial feasibility and design development, securing planning permission, progressing the detailed design and subsequently providing Contract Administration throughout construction.",
        "The completed project has transformed the existing property into a substantially larger, cohesive family home, with the architecture, internal layout and external spaces considered as one complete scheme.",
      ],
      beforeAfter: {
        before: "/images/projects/bereweeke/existing-house.jpg",
        after: "/images/projects/bereweeke/complete-front.jpg",
        beforeAlt: "The original 1930s house before work began, seen from the road",
        afterAlt: "The completed house after extension and remodelling, seen from the drive",
      },
      // Feasibility, planning and technical design are not here on purpose: the
      // drive holds no drawings for them at a quality worth publishing, and the
      // template says to include a stage only where good material exists.
      sections: [
        {
          title: "The Existing House",
          caption: "A 1930s detached house on a generous plot, sound but short of space for a growing family and closed off from its own garden.",
          images: [
            { src: "/images/projects/bereweeke/existing-house.jpg", alt: "The original house before work, with the Thistle Architecture site board in place" },
          ],
        },
        {
          title: "CGI And Interior Design",
          caption: "The scheme was visualised in full before work started, inside and out, so the client could see the finished house rather than read it off a plan.",
          images: [
            { src: "/images/projects/bereweeke/cgi-exterior.jpg", alt: "Visualisation of the completed house from the front" },
            { src: "/images/projects/bereweeke/cgi-rear.jpg", alt: "Visualisation of the rear extensions and garden" },
            { src: "/images/projects/bereweeke/cgi-interior.jpg", alt: "Visualisation of the open plan kitchen and dining space" },
          ],
        },
        {
          title: "Construction",
          caption: "Thistle acted as Contract Administrator through construction, so the detail drawn was the detail built.",
          images: [
            { src: "/images/projects/bereweeke/construction-1.jpg", alt: "Materials on site with the rear of the house stripped back" },
            { src: "/images/projects/bereweeke/construction-2.jpg", alt: "The two-storey rear extensions under construction" },
          ],
        },
        {
          title: "The Completed House",
          caption: "Two two-storey rear extensions and a single-storey wing joined by a glazed link, with the internal layout and both gardens reworked as one scheme.",
          images: [
            { src: "/images/projects/bereweeke/complete-front.jpg", alt: "The completed house from the drive" },
            { src: "/images/projects/bereweeke/complete-rear.jpg", alt: "The completed rear extension in brick with full-height glazing" },
            { src: "/images/projects/bereweeke/interior-kitchen-1.jpg", alt: "The finished kitchen and island under a rooflight" },
            { src: "/images/projects/bereweeke/interior-kitchen-2.jpg", alt: "The kitchen looking out to the garden through full-height glazing" },
            { src: "/images/projects/bereweeke/interior-glazing.jpg", alt: "The glazed link connecting the house to the garden" },
          ],
        },
      ],
    },
    conversionTypes: ['high-end-residential'],
    kind: "project",
    title: "1930s House, Extended And Remade",
    location: "Winchester, Hampshire",
    image: "/images/projects/bereweeke-1.jpg",
    tag: "High-End Residential",
    stats: [
      { label: "Existing", value: "1930s detached" },
      { label: "Extensions", value: "Single and two storey" },
      { label: "Change of use", value: "None" },
    ],
    desc: "A tired 1930s detached house in Winchester, reworked with new extensions and a full fenestration change.",
    challenge: "The house was a two-storey 1930s detached property with a masonry facade and a red clay tile roof, and it had accumulated the usual additions. The windows and doors were dilapidated steel and the rainwater goods were black uPVC. Nothing about it was protected, which is a freedom and a trap: no listing and no conservation area means the constraint is simply whether the design is good enough to be worth doing.",
    approach: "The existing extensions come down and are replaced with a single-storey rear and side extension and two-storey side extensions, keeping the use as a C3 dwellinghouse throughout. The fenestration changes across the whole house, which is what does the real work: steel-framed glazing to the garden, and openings sized to the way the rooms are actually used rather than the way they were in 1935. Access off Bereweeke Avenue is unchanged, the driveway keeps its off-street parking, and no trees or hedges are removed.",
    outcome: "Taken through RIBA Stage 2 and pre-application advice with Winchester City Council, then built. The finished house has a kitchen and dining space opening to the garden under a rooflight, herringbone floors, and a rear elevation that reads as one house rather than a house plus additions.",
    galleryImages: [
      "/images/projects/bereweeke-2.jpg",
      "/images/projects/bereweeke-3.jpg",
      "/images/projects/bereweeke-4.jpg",
    ],
    buildingType: "1930s detached house (C3)",
    planningRoute: "Full planning, extensions and alterations",
    status: "Complete",
  },
  {
    slug: "monument-house",
    conversionTypes: ['commercial-to-residential'],
    kind: "project",
    title: "Monument House",
    location: "Winchester, Hampshire",
    image: "/images/projects/monument-house-render-2.webp",
    tag: "Office to Flats",
    stats: [
      { label: "Apartments", value: "4" },
      { label: "Apartment sizes", value: "46.6 to 90.4 sqm" },
      { label: "Windows", value: "Sash, reinstated" },
    ],
    desc: "A period building in central Winchester converted into four apartments, with the modern uPVC swapped back for traditional sash windows.",
    challenge: "The building sits in the middle of Winchester, a city where what the building looks like from the street is not a detail. It had picked up modern uPVC windows along the way, which is the sort of thing that reads as wrong on a High Street elevation long before anyone can say why.",
    approach: "Four apartments: two at ground floor of 90 and 90.4 sqm, and two above at 46.6 and 69.9 sqm, each with its own kitchen and lounge, bathroom and hall. All the modern uPVC windows are replaced with traditional design sash windows, sized to the existing openings, with the contractor pricing both timber and uPVC alternatives so the client could make that call on cost rather than have it made for them. A new front courtyard was proposed to the street.",
    outcome: "Documented to tender. The fire strategy does the heavy lifting on a conversion like this: a 60-minute protected stairwell serving all four flats, every steel encased to 60 minutes, and a 60-minute rating to the hallway and landings. The drone footage on our homepage is this building's own street.",
    galleryImages: [
      "/images/projects/monument-house-render-2.webp",
      "/images/projects/monument-house-render-1.webp",
      "/images/projects/monument-house-1.png",
      "/images/projects/monument-house-2.png",
    ],
    buildingType: "Period building, Upper High Street",
    planningRoute: "Office to residential conversion",
    unitsAfter: "4 apartments",
    status: "Complete",
  },
  {
    slug: "wigan-church",
    projectStory: {
      // Ed's own write-up, from Project Explanations.docx.
      summary: [
        "The adaptive reuse of a long-vacant former church in Leigh, Greater Manchester, transforming the redundant building into a new headquarters and co-working destination while retaining the character of its historic architecture.",
        "The proposals create dedicated office accommodation for the client and their employees alongside a substantial co-working space within the main church atrium. The design has been developed around the building's existing features, including stained-glass windows, exposed timber roof structure, stonework and original organ, introducing contemporary interventions while allowing the character and scale of the former church to remain central to the scheme.",
        "Thistle Architecture was involved from the initial feasibility stage, securing planning permission for the change of use from a church to Class E office accommodation before progressing further applications for the associated external alterations. Our involvement has continued through Stage 4 technical design, full interior design and tendering of the construction works, with the architectural and interior packages developed as one coordinated scheme.",
        "Planning permission has been secured and the project is progressing through tender, bringing a significant redundant building back into productive use as a distinctive contemporary workplace.",
      ],
      // No before-and-after and no completed section: the building is in tender,
      // so there is nothing finished to photograph yet.
      sections: [
        {
          title: "The Existing Church",
          caption: "A Gothic former Methodist church, vacant and in use as storage when Thistle first visited. The stained glass, stonework and exposed timber roof are the features the scheme is built around rather than removed.",
          images: [
            { src: "/images/projects/wigan/exterior-1.jpg", alt: "The Gothic brick and stone frontage of the former Methodist church" },
            { src: "/images/projects/wigan/exterior-2.jpg", alt: "The church tower and entrance from the street" },
            { src: "/images/projects/wigan/interior-nave.jpg", alt: "The nave in its existing condition, in use as storage" },
            { src: "/images/projects/wigan/interior-gallery.jpg", alt: "The gallery level looking across the nave to the arched windows" },
            { src: "/images/projects/wigan/interior-roof.jpg", alt: "The exposed timber roof structure over the main atrium" },
            { src: "/images/projects/wigan/stained-glass.jpg", alt: "One of the original stained-glass windows retained in the scheme" },
          ],
        },
      ],
    },
    kind: "project",
    title: "Methodist Church To Offices",
    location: "Leigh, Greater Manchester",
    image: "/images/projects/wigan-church-1.jpg",
    tag: "Commercial Conversion",
    stats: [
      { label: "Offices", value: "10" },
      { label: "Conference rooms", value: "2" },
      { label: "Office sizes", value: "12.7 to 19.9 sqm" },
    ],
    desc: "A Gothic Methodist church on Wigan Road, converted into offices without losing the stained glass or the vaulted roof.",
    challenge: "The building is a red-brick Gothic Methodist church with stone tracery, stained glass and an open vaulted timber roof, and it had ended up in use as storage. Everything worth keeping about it was also the thing that made an office conversion difficult: you cannot cut a church nave into cellular offices without either wrecking the interior or ending up with rooms nobody wants to work in.",
    approach: "The scheme works within the existing envelope. Ten offices from 12.7 to 19.9 sqm and two conference rooms of 22.1 and 22.9 sqm sit alongside a 31.3 sqm open office, a 21.6 sqm waiting area at the entrance, a kitchen, showers and changing rooms, with a 176.5 sqm storage space retained at the rear. The stained glass stays: existing stone frames and stained glass are repaired and made good, with secondary triple glazing introduced inside the existing reveals rather than replacing the windows. Original windows to the frontage are retained and made good like for like. Card access control runs to all exterior and connecting doors.",
    outcome: "The conversion is documented through to Rev G. The result keeps a landmark building in use and in one piece, which is usually the argument that carries a scheme like this: the alternative for a redundant church is rarely a better outcome for the street.",
    galleryImages: [
      "/images/projects/wigan-church-2.jpg",
      "/images/projects/wigan-church-3.jpg",
      "/images/projects/wigan-church-4.jpg",
    ],
    buildingType: "Former Methodist church",
    planningRoute: "Change of use to offices",
    status: "Complete",
  },
  {
    slug: "162-millbrook",
    conversionTypes: ['hmo'],
    kind: "project",
    title: "162 Millbrook Road",
    location: "Southampton, Hampshire",
    image: "/images/projects/millbrook-1.png",
    tag: "HMO",
    stats: [
      { label: "Bedrooms, all en suite", value: "8" },
      { label: "Room sizes", value: "9 to 17 sqm" },
      { label: "Kitchens", value: "2" },
    ],
    desc: "A Southampton house taken to an eight-bedroom large sui generis HMO, every room en suite, alongside its neighbour at 160.",
    challenge: "The scheme sits on Millbrook Road alongside a neighbouring property in the same ownership, and the two share a boundary and a party structure. The building had to reach a room count that works commercially while clearing the local authority's HMO standards on room sizes, communal amenity, kitchen provision and refuse storage, which is where schemes like this usually come unstuck.",
    approach: "Eight bedrooms, all en suite, across ground and first floors, from 9 sqm up to 16.95 sqm. Two kitchens serve the house: an 18 sqm kitchen and dining space on the ground floor and a 9 sqm kitchen on the first, so no cluster of rooms is far from a kitchen. The existing conservatory came down and a new beam and block floor went in behind it. Every tea station is a wet area only, with no cooking facilities, which keeps the kitchen count honest against the standards. The external alterations were completed under permitted development rights, so the planning exposure sat where it could be controlled.",
    outcome: "Documented to Building Regulations stage. The technical detail is where a large HMO is won or lost: acoustic bar on stud partitions between rooms, separating floors upgraded to Part E, a Category LD2 alarm system, and a fire strategy agreed with the fire consultant rather than assumed.",
    galleryImages: [
      "/images/projects/millbrook-1.png",
      "/images/projects/millbrook-2.png",
    ],
    buildingType: "Existing dwelling",
    planningRoute: "Large sui generis HMO, external works under PDR",
    status: "Complete",
  },
  // ---------------------------------------------------------------------
  // Added 2026-07-29 from Ed's Google Drive folder ("Eds Home Reno" >
  // HMO Marketing). These three are THISTLE'S OWN work, not HMO Designers':
  // the client's own `03 New Website/Finished Projects/HMO/` folder lists
  // exactly 162 Millbrook, 81 Crecent [sic] and Bishopstoke. Those folders were
  // empty, which is why Bishopstoke was deleted from the site on 2026-07-17 and
  // 81 The Crescent was never listed at all. The Drive folder has the
  // photography the local folders were missing.
  //
  // Every shot is a Canon 5D Mark IV frame edited in Lightroom, so these are
  // proper marketing sets, not phone snaps. Imported at 1600px.
  //
  // WHAT WE DO NOT HAVE: any document. No feasibility study, no drawings, no
  // schedule of accommodation. So these entries claim NO room counts, NO floor
  // areas and NO planning routes. Everything below is either a folder-name fact
  // or something visible in the photographs. Completion years are the EXIF
  // capture dates, which prove the building was finished by then and nothing
  // more. All open questions are in docs/case-study-confirmations.md.
  // ---------------------------------------------------------------------
  {
    slug: "bishopstoke-road",
    conversionTypes: ['hmo'],
    kind: "project",
    title: "Bishopstoke Road",
    location: "Eastleigh, Hampshire",
    image: "/images/projects/bishopstoke-road/bishopstoke-1.jpg",
    tag: "HMO",
    stats: [
      { label: "Communal", value: "Kitchen and dining" },
      { label: "Outside", value: "Walled courtyard" },
      { label: "En suites", value: "Marble tiled" },
    ],
    desc: "A house converted to an HMO in Eastleigh, built around a full-length navy kitchen that runs the depth of the plan into a rooflit dining room.",
    approach: "The whole ground floor is given over to one move: a navy shaker kitchen running the full depth of the house, brass handles, stone worktops, integrated ovens and laundry built in, opening at the far end into a dining room lit from above by a flat rooflight. Panelling to dado height carries through the dining room and up the staircase, all in the same navy, so the circulation reads as part of the design rather than as leftover space. The en suites are tiled floor to ceiling in white marble with backlit round mirrors.",
    outcome: "Complete and photographed in March 2025. The rear opens onto a walled courtyard with paved terrace and planting beds, which on a mid-terrace plot is what stops a house at this occupancy feeling closed in.",
    galleryImages: [
      "/images/projects/bishopstoke-road/bishopstoke-2.jpg",
      "/images/projects/bishopstoke-road/bishopstoke-3.jpg",
      "/images/projects/bishopstoke-road/bishopstoke-4.jpg",
      "/images/projects/bishopstoke-road/bishopstoke-5.jpg",
      "/images/projects/bishopstoke-road/bishopstoke-6.jpg",
      "/images/projects/bishopstoke-road/bishopstoke-7.jpg",
      "/images/projects/bishopstoke-road/bishopstoke-8.jpg",
      "/images/projects/bishopstoke-road/bishopstoke-9.jpg",
      "/images/projects/bishopstoke-road/bishopstoke-10.jpg",
      "/images/projects/bishopstoke-road/bishopstoke-11.jpg",
      "/images/projects/bishopstoke-road/bishopstoke-12.jpg",
      "/images/projects/bishopstoke-road/bishopstoke-13.jpg",
      "/images/projects/bishopstoke-road/bishopstoke-14.jpg",
    ],
    buildingType: "Existing dwelling",
    completionDate: "2025",
    status: "Complete",
  },
  {
    // LOCATION UNKNOWN. "The Crescent" is a street name and nothing in the
    // Drive folder, the client's folder tree or the photographs gives a town.
    // The sibling projects are all Hampshire, but that is an inference, not a
    // fact, so this publishes without a town rather than with a wrong one.
    // Top item on the confirmations list.
    slug: "81-the-crescent",
    conversionTypes: ['hmo'],
    kind: "project",
    title: "81 The Crescent",
    location: "England",
    image: "/images/projects/crescent-81/crescent-1.jpg",
    tag: "HMO",
    stats: [
      { label: "En suites", value: "Every room" },
      { label: "In room", value: "Desk and tea station" },
      { label: "Joinery", value: "Oak and cane" },
    ],
    desc: "An en suite HMO finished to a high specification, with a desk and a tea station in every room and oak joinery running throughout.",
    approach: "Each room is a self-contained unit rather than a bedroom with a shared bathroom down the hall: its own en suite behind an oak door, a slatted timber headboard panel wired with sockets and switches at the bed, a desk under the window, and a wardrobe and chest in cane-fronted oak. The en suites are tiled in large-format stone with quadrant showers and backlit round mirrors. Separate tea stations sit outside the rooms, which is the arrangement that keeps a scheme like this the right side of the licensing standards on kitchen provision.",
    outcome: "Complete and photographed in September 2025. The palette is warm throughout, oak, cream, terracotta and mustard, which is a deliberate step away from the grey-and-white that most rooms at this rent level default to.",
    galleryImages: [
      "/images/projects/crescent-81/crescent-2.jpg",
      "/images/projects/crescent-81/crescent-3.jpg",
      "/images/projects/crescent-81/crescent-4.jpg",
      "/images/projects/crescent-81/crescent-5.jpg",
      "/images/projects/crescent-81/crescent-6.jpg",
      "/images/projects/crescent-81/crescent-7.jpg",
      "/images/projects/crescent-81/crescent-8.jpg",
      "/images/projects/crescent-81/crescent-9.jpg",
      "/images/projects/crescent-81/crescent-10.jpg",
      "/images/projects/crescent-81/crescent-11.jpg",
      "/images/projects/crescent-81/crescent-12.jpg",
      "/images/projects/crescent-81/crescent-13.jpg",
      "/images/projects/crescent-81/crescent-14.jpg",
    ],
    buildingType: "Existing dwelling",
    completionDate: "2025",
    status: "Complete",
  },
  // ---------------------------------------------------------------------
  // HMO Designers projects, ported 2026-07-29 from
  // ~/Downloads/Projects/hmo_designer/site/content/projects/*.json.
  // HMO Designers is a sister practice under the same group, so this is group
  // work and fine to publish, but every entry carries `provenance` so no page
  // implies Thistle Architecture did the job itself.
  //
  // The source records are thin: a title, a one-line subtitle and a short body,
  // with no feasibility documents behind them. So these entries state only what
  // the source asserts (room counts, specification, scope of involvement, year
  // where given) plus what the photography itself shows. No sqm figures, no
  // planning routes and no fire strategies are claimed, unlike the entries above
  // which were written from real documents.
  //
  // THREE SOURCE PROJECTS ARE DELIBERATELY NOT HERE, because slug, title and
  // body disagree about where they are and we will not publish a wrong location:
  //   - hmo-project-bedhampton  slug says Bedhampton (Hampshire), title says
  //                             "London Surrey", which is not a place. Also the
  //                             only one crediting third parties (L&K Estates
  //                             and roost), which needs its own decision.
  //   - hmo-project-crawley     slug says Crawley, title says Gillingham, and
  //                             its subtitle "Project Burlington" collides with
  //                             the unrelated Burlington Road in Southampton.
  //   - hmo-project-chalkridge  title says London, but Chalk Ridge is a
  //                             Basingstoke street and the photography shows a
  //                             suburban semi with a garden, not London.
  // All three are ready to add the moment Ed confirms locations. See
  // docs/case-study-confirmations.md.
  // ---------------------------------------------------------------------
  {
    slug: "derby-road",
    conversionTypes: ['hmo'],
    kind: "project",
    title: "Derby Road",
    location: "South Coast, England",
    image: "/images/projects/hmo-derby-road/derby-road-1.jpg",
    tag: "HMO",
    provenance: "By HMO Designers, part of Thistle Group",
    stats: [
      { label: "Bedrooms", value: "8" },
      { label: "Specification", value: "Ultra luxury" },
      { label: "Communal space", value: "Living and dining" },
    ],
    desc: "An eight-bedroom ultra luxury HMO on the south coast, built around a rooflit living and dining space at the back of the house.",
    approach: "The communal heart of the house is a rear living and dining room lit by a large flush rooflight, with French doors to the outside. The finish is pitched well above the standard letting specification: wall lights either side of a sculptural panel, cane and black timber dining chairs, and a soft palette that reads as a home rather than a room let by the week.",
    outcome: "Complete and let. HMO Designers worked as part of the wider project team on this scheme rather than as sole designer, so the credit is shared with the others involved.",
    galleryImages: [
      "/images/projects/hmo-derby-road/derby-road-2.jpg",
      "/images/projects/hmo-derby-road/derby-road-3.jpg",
      "/images/projects/hmo-derby-road/derby-road-4.jpg",
      "/images/projects/hmo-derby-road/derby-road-5.jpg",
      "/images/projects/hmo-derby-road/derby-road-6.jpg",
      "/images/projects/hmo-derby-road/derby-road-7.jpg",
      "/images/projects/hmo-derby-road/derby-road-8.jpg",
      "/images/projects/hmo-derby-road/derby-road-9.jpg",
      "/images/projects/hmo-derby-road/derby-road-10.jpg",
    ],
    buildingType: "Existing dwelling",
    status: "Complete",
  },
  {
    slug: "george-street-eastleigh",
    conversionTypes: ['hmo'],
    kind: "project",
    title: "George Street",
    location: "Eastleigh, Hampshire",
    image: "/images/projects/hmo-george-street-eastleigh/george-street-eastleigh-1.jpg",
    tag: "HMO",
    provenance: "By HMO Designers, part of Thistle Group",
    stats: [
      { label: "Bedrooms", value: "7" },
      { label: "Thistle role", value: "Design to construction" },
      { label: "Market", value: "Professional lets" },
    ],
    desc: "A seven-bedroom luxury HMO for professionals in the centre of Eastleigh, taken from first design through to finished build.",
    approach: "The client was carried through every stage: design, planning, interior design and construction. The ground floor is the part that does the work. A full-length shaker kitchen in deep grey, with brass handles and integrated ovens down one side, opens straight into a rooflit dining room at the rear, so the shared space reads as one long room rather than a corridor with a table at the end of it.",
    outcome: "Complete. It is the clearest example in this group of what the extra effort buys at the top of the professional letting market.",
    galleryImages: [
      "/images/projects/hmo-george-street-eastleigh/george-street-eastleigh-2.jpg",
      "/images/projects/hmo-george-street-eastleigh/george-street-eastleigh-3.jpg",
      "/images/projects/hmo-george-street-eastleigh/george-street-eastleigh-4.jpg",
      "/images/projects/hmo-george-street-eastleigh/george-street-eastleigh-5.jpg",
      "/images/projects/hmo-george-street-eastleigh/george-street-eastleigh-6.jpg",
      "/images/projects/hmo-george-street-eastleigh/george-street-eastleigh-7.jpg",
      "/images/projects/hmo-george-street-eastleigh/george-street-eastleigh-8.jpg",
      "/images/projects/hmo-george-street-eastleigh/george-street-eastleigh-9.jpg",
      "/images/projects/hmo-george-street-eastleigh/george-street-eastleigh-10.jpg",
      "/images/projects/hmo-george-street-eastleigh/george-street-eastleigh-11.jpg",
      "/images/projects/hmo-george-street-eastleigh/george-street-eastleigh-12.jpg",
      "/images/projects/hmo-george-street-eastleigh/george-street-eastleigh-13.jpg",
      "/images/projects/hmo-george-street-eastleigh/george-street-eastleigh-14.jpg",
      "/images/projects/hmo-george-street-eastleigh/george-street-eastleigh-15.jpg",
    ],
    buildingType: "Existing dwelling",
    status: "Complete",
  },
  {
    slug: "queens-road",
    conversionTypes: ['hmo'],
    kind: "project",
    title: "Queens Road",
    location: "South Coast, England",
    image: "/images/projects/hmo-queens-road/queens-road-1.jpg",
    tag: "HMO",
    provenance: "By HMO Designers, part of Thistle Group",
    stats: [
      { label: "Bedrooms", value: "7" },
      { label: "Before", value: "3 bed family house" },
      { label: "En suite", value: "Every room" },
    ],
    desc: "A three-bedroom city centre family house turned into a seven-bedroom high-end HMO, every room en suite.",
    challenge: "The starting point was an ordinary three-bedroom family house in a city centre. Getting seven en suite rooms out of that means finding the rooms and the drainage for seven bathrooms at the same time, without leaving the shared space so thin that the house stops working for the people actually living in it.",
    approach: "Managed end to end: existing surveys, proposals, planning and building regulations approval, then construction. The rear of the house opens into a communal living space under a glazed lantern, with bifold doors onto a small walled courtyard. On a tight urban plot that courtyard is how the shared amenity space gets won, and it is why the lounge does not feel like a leftover.",
    outcome: "Complete, and in use as seven high-end en suite rooms.",
    galleryImages: [
      "/images/projects/hmo-queens-road/queens-road-2.jpg",
      "/images/projects/hmo-queens-road/queens-road-3.jpg",
      "/images/projects/hmo-queens-road/queens-road-4.jpg",
      "/images/projects/hmo-queens-road/queens-road-5.jpg",
      "/images/projects/hmo-queens-road/queens-road-6.jpg",
    ],
    buildingType: "Three-bed family house (C3)",
    status: "Complete",
  },
  {
    slug: "shadwell-road",
    conversionTypes: ['hmo'],
    kind: "project",
    title: "Shadwell Road",
    location: "Portsmouth, Hampshire",
    image: "/images/projects/hmo-shadwell-road/shadwell-road-1.jpg",
    tag: "HMO",
    provenance: "By HMO Designers, part of Thistle Group",
    stats: [
      { label: "Bedrooms", value: "7" },
      { label: "Completed", value: "2023" },
      { label: "Thistle role", value: "Feasibility to approvals" },
    ],
    desc: "A seven-bedroom HMO in Portsmouth, taken from a feasibility study of the existing property through to planning and building regulations approval.",
    approach: "The instruction started with a feasibility study of the building as it stood, then the relevant surveys, then planning and building regulations approval. The communal room sits at the rear under a glazed lantern with French doors to the yard, finished in sage green with pale timber, so the shared space is the brightest room in the house rather than the one nobody uses.",
    outcome: "Completed in 2023.",
    galleryImages: [
      "/images/projects/hmo-shadwell-road/shadwell-road-2.jpg",
      "/images/projects/hmo-shadwell-road/shadwell-road-3.jpg",
      "/images/projects/hmo-shadwell-road/shadwell-road-4.jpg",
      "/images/projects/hmo-shadwell-road/shadwell-road-5.jpg",
      "/images/projects/hmo-shadwell-road/shadwell-road-6.jpg",
      "/images/projects/hmo-shadwell-road/shadwell-road-7.jpg",
    ],
    buildingType: "Existing dwelling",
    completionDate: "2023",
    status: "Complete",
  },
  {
    slug: "burlington-road",
    conversionTypes: ['hmo'],
    kind: "project",
    title: "Burlington Road",
    location: "Southampton, Hampshire",
    image: "/images/projects/hmo-burlington-road/burlington-road-1.jpg",
    tag: "HMO",
    provenance: "By HMO Designers, part of Thistle Group",
    stats: [
      { label: "Bedrooms", value: "7" },
      { label: "Completed", value: "2023" },
      { label: "Specification", value: "Essential" },
    ],
    desc: "A seven-bedroom HMO in Southampton delivered to an essential specification, with en suite rooms worked into the roof under new rooflights.",
    approach: "A feasibility study of the existing property came first, then the surveys, then planning and building regulations approval. The loft rooms take their light from new rooflights set into the slope, and each has its own shower room off the bedroom. That is what keeps a seven-bed count workable in a house of this size without any room feeling like the short straw.",
    outcome: "Completed in 2023.",
    galleryImages: [
      "/images/projects/hmo-burlington-road/burlington-road-2.jpg",
      "/images/projects/hmo-burlington-road/burlington-road-3.jpg",
      "/images/projects/hmo-burlington-road/burlington-road-4.jpg",
      "/images/projects/hmo-burlington-road/burlington-road-5.jpg",
      "/images/projects/hmo-burlington-road/burlington-road-6.jpg",
      "/images/projects/hmo-burlington-road/burlington-road-7.jpg",
      "/images/projects/hmo-burlington-road/burlington-road-8.jpg",
      "/images/projects/hmo-burlington-road/burlington-road-9.jpg",
    ],
    buildingType: "Existing dwelling",
    completionDate: "2023",
    status: "Complete",
  },
  {
    slug: "project-prince",
    conversionTypes: ['hmo'],
    kind: "project",
    title: "Seven-Bed High-End HMO, Southend-on-Sea",
    location: "Southend-on-Sea, Essex",
    image: "/images/projects/hmo-project-prince/project-prince-1.jpg",
    tag: "HMO",
    provenance: "By HMO Designers, part of Thistle Group",
    stats: [
      { label: "Bedrooms", value: "7" },
      { label: "Let", value: "Individually" },
      { label: "Amenities", value: "En suite plus shared" },
    ],
    desc: "A high-end seven-bedroom HMO in Southend-on-Sea, with seven individually let en suite rooms and shared amenities.",
    approach: "Seven rooms, each individually let and each with its own en suite, alongside the shared amenity space. The bedrooms carry the high-end brief properly rather than decoratively: deep colour taken across the walls and the ceiling, slatted timber panelling behind the bed, and a pendant hung either side instead of one light in the middle of the room.",
    outcome: "Complete, and let to professionals in the area. It is a fair demonstration of what a high-end brief buys when the team specialises in HMOs.",
    galleryImages: [
      "/images/projects/hmo-project-prince/project-prince-2.jpg",
      "/images/projects/hmo-project-prince/project-prince-3.jpg",
      "/images/projects/hmo-project-prince/project-prince-4.jpg",
      "/images/projects/hmo-project-prince/project-prince-5.jpg",
      "/images/projects/hmo-project-prince/project-prince-6.jpg",
      "/images/projects/hmo-project-prince/project-prince-7.jpg",
      "/images/projects/hmo-project-prince/project-prince-8.jpg",
      "/images/projects/hmo-project-prince/project-prince-9.jpg",
      "/images/projects/hmo-project-prince/project-prince-10.jpg",
    ],
    buildingType: "Existing dwelling",
    status: "Complete",
  },
  {
    // Address identified 2026-07-29 from Ed's Drive: the film
    // "7FESTINGRD_16x9_V3.mp4" opens on this exact terrace (pale blue house,
    // Pizza Hut next door) and its interior shots match this gallery frame for
    // frame. HMO Designers' own record had no street, only "South Sea".
    slug: "southsea-co-living",
    conversionTypes: ['co-living-large-hmo', 'hmo'],
    kind: "project",
    title: "Southsea Co-Living",
    location: "Southsea, Portsmouth",
    image: "/images/projects/hmo-southsea-co-living/southsea-co-living-3.jpg",
    tag: "Co-Living",
    provenance: "By HMO Designers, part of Thistle Group",
    stats: [
      { label: "Bedrooms", value: "8" },
      { label: "Format", value: "Luxury co-living" },
      { label: "Building", value: "Victorian terrace" },
    ],
    desc: "An eight-bedroom luxury co-living conversion inside a bay-fronted Victorian terrace in Southsea.",
    approach: "The building is a bay-fronted Victorian terrace on A residential street with dormers already in the roof and shops either side. Inside, the communal floor runs open plan: kitchen, dining and living in one length on a herringbone floor, with the kitchen tucked along the far wall rather than closed off. That single decision is what makes co-living work here. Eight people sharing a corridor is a house share; eight people sharing a room this size is somewhere you would choose to live.",
    outcome: "Complete, and the most recent of the practice's Portsmouth HMO projects.",
    galleryImages: [
      "/images/projects/hmo-southsea-co-living/southsea-co-living-1.jpg",
      "/images/projects/hmo-southsea-co-living/southsea-co-living-2.jpg",
      "/images/projects/hmo-southsea-co-living/southsea-co-living-4.jpg",
      "/images/projects/hmo-southsea-co-living/southsea-co-living-5.jpg",
      "/images/projects/hmo-southsea-co-living/southsea-co-living-6.jpg",
      "/images/projects/hmo-southsea-co-living/southsea-co-living-7.jpg",
      "/images/projects/hmo-southsea-co-living/southsea-co-living-8.jpg",
      "/images/projects/hmo-southsea-co-living/southsea-co-living-9.jpg",
      "/images/projects/hmo-southsea-co-living/southsea-co-living-10.jpg",
      "/images/projects/hmo-southsea-co-living/southsea-co-living-11.jpg",
      "/images/projects/hmo-southsea-co-living/southsea-co-living-12.jpg",
      "/images/projects/hmo-southsea-co-living/southsea-co-living-13.jpg",
      "/images/projects/hmo-southsea-co-living/southsea-co-living-14.jpg",
      "/images/projects/hmo-southsea-co-living/southsea-co-living-15.jpg",
    ],
    buildingType: "Victorian terraced house",
    status: "Complete",
  },
  // Bishopstoke and Forest Home were removed 2026-07-17. Both folders are empty
  // in the shared drive AND in the 6.25GB archive, so both entries were a stock
  // image, a guessed location and "coming soon". That is the same reason
  // 81 Crescent and School House were never listed (see
  // docs/case-study-confirmations.md). Restore from history the moment Ed sends
  // photos and a write-up.
  // ── Projects added 13 August from Ed's Project Explanations.docx ──────────
  // Each was written up by Ed but had no page on the site. Summaries are his
  // words; the stages shown are only those with usable imagery in the drive.
  {
    slug: "corner-house-hackney",
    kind: "project",
    title: "Vacant Corner Plot To New Home",
    location: "Hackney, London",
    image: "/images/projects/corner-house/cgi-street.jpg",
    tag: "New Build",
    status: "Complete",
    stats: [
      { label: "Plot", value: "Previously vacant" },
      { label: "Facade", value: "Green glazed brick" },
      { label: "Thistle role", value: "Feasibility to construction" },
    ],
    desc: "A new home on a vacant corner plot, bookending an existing Hackney terrace behind a curved wall of green glazed brick.",
    galleryImages: [],
    buildingType: "New-build house on an infill plot",
    projectStory: {
      summary: [
        "A new-build residential project on a previously vacant corner plot in Hackney, London, designed to complete and bookend an existing terrace while creating a distinctive new family home.",
        "The design responds directly to its prominent corner position, with a curved external wall and green glazed brickwork creating a strong architectural identity. Buff brick, stone detailing to the window sills and cornice, and carefully proportioned openings reference the surrounding street, allowing the building to feel contemporary and individual while remaining grounded in its context.",
        "Thistle Architecture was involved from the initial feasibility stage, developing the design and securing planning permission before progressing the project through Stage 4 technical design and providing full management of the construction.",
        "The completed scheme has transformed a constrained vacant plot into a characterful new home, a confident contemporary addition to the Hackney streetscape.",
      ],
      sections: [
        { title: "The Existing Plot", caption: "A constrained corner site, vacant and hoarded, at the end of an existing terrace.",
          images: [{ src: "/images/projects/corner-house/existing-plot.jpg", alt: "The vacant hoarded corner plot before development" }] },
        { title: "The Design", caption: "A curved corner in green glazed brick, with buff brick and stone detailing picking up the proportions of the street.",
          images: [
            { src: "/images/projects/corner-house/cgi-street.jpg", alt: "The completed house on its corner, seen along the street" },
            { src: "/images/projects/corner-house/glazed-brick.jpg", alt: "Close view of the green glazed brickwork" },
            { src: "/images/projects/corner-house/cgi-interior.jpg", alt: "The open plan interior looking out to the garden" },
          ] },
      ],
    },
  },
  {
    slug: "forest-house-lymington",
    kind: "project",
    title: "New Home In The New Forest",
    location: "Lymington, Hampshire",
    image: "/images/projects/forest-house/exterior-dusk.jpg",
    tag: "New Build",
    status: "Complete",
    stats: [
      { label: "Setting", value: "New Forest" },
      { label: "Material", value: "Terracotta clay tile" },
      { label: "Thistle role", value: "Feasibility to construction" },
    ],
    desc: "A new family home on a private plot inside the New Forest, tiled in terracotta across both roof and walls to sit inside a protected landscape.",
    galleryImages: [],
    buildingType: "New-build house in a protected landscape",
    projectStory: {
      summary: [
        "A new-build family home on a privately owned plot in Lymington, within the sensitive landscape setting of the New Forest, designed to respond carefully to its rural surroundings.",
        "The house uses terracotta clay tiles across both the roof and external elevations, creating a distinctive but contextually appropriate material palette. The design was developed to sit comfortably within its protected landscape setting while delivering a contemporary new home for the owners.",
        "Thistle Architecture was involved from the initial feasibility stage, progressing the project through planning, technical design and construction. The site presented a number of constraints, particularly in relation to existing trees and the surrounding natural environment, requiring close coordination with specialist consultants throughout.",
        "The completed scheme responds to its landscape setting through form, materiality and detailing, while overcoming the constraints of the site.",
      ],
      sections: [
        { title: "The Completed House", caption: "Terracotta clay tile across roof and walls, with full-height glazing opening the plan to the garden.",
          images: [
            { src: "/images/projects/forest-house/exterior-dusk.jpg", alt: "The completed house at dusk with the interior lit" },
            { src: "/images/projects/forest-house/exterior-day.jpg", alt: "The house and garden in daylight" },
            { src: "/images/projects/forest-house/interior.jpg", alt: "The open plan kitchen and dining space" },
          ] },
      ],
    },
  },
  {
    slug: "peterhayes-farm",
    kind: "project",
    title: "Class Q Barn To Dwelling",
    location: "Somerset",
    image: "/images/projects/peterhayes/cgi-barn.jpg",
    tag: "Class Q",
    status: "Complete",
    stats: [
      { label: "Route", value: "Class Q prior approval" },
      { label: "Approved", value: "2024" },
      { label: "Thistle role", value: "Approval to construction" },
    ],
    desc: "An agricultural barn on a working farm in Somerset, converted to a house under Class Q and delivered through to completion.",
    galleryImages: [],
    buildingType: "Agricultural barn",
    planningRoute: "Class Q prior approval",
    projectStory: {
      summary: [
        "The conversion of an existing agricultural barn at Peter Hayes Farm in Somerset into a new residential dwelling. The barn sits to the rear of an existing farmhouse, within a mixed rural setting that also includes surrounding industrial and agricultural buildings.",
        "Thistle Architecture was commissioned to develop the residential conversion and secure Class Q Prior Approval, establishing the change of use from agricultural to residential while working within the constraints of the existing building and site.",
        "Following approval in 2024, our involvement continued through Stage 4 technical design and into the construction phase, coordinating the detailed information required to deliver the conversion on site.",
        "The project is now complete, transforming the former agricultural building into a new home while retaining and adapting the character and fabric of the original barn.",
      ],
      sections: [
        { title: "The Site", caption: "The barn sits behind the farmhouse in a mixed rural setting of agricultural and industrial buildings.",
          images: [{ src: "/images/projects/peterhayes/site-aerial.jpg", alt: "Aerial view of the farm with the barn to the rear of the farmhouse" }] },
        { title: "The Conversion", caption: "The barn's form and fabric are retained and adapted rather than replaced.",
          images: [
            { src: "/images/projects/peterhayes/cgi-barn.jpg", alt: "The converted barn seen from the approach" },
            { src: "/images/projects/peterhayes/cgi-garden.jpg", alt: "The barn conversion from the garden side" },
          ] },
      ],
    },
  },
  {
    slug: "rotherfield-homes",
    kind: "project",
    title: "One House To Four Homes",
    location: "Hampshire",
    image: "/images/projects/rotherfield/cgi.jpg",
    tag: "Residential Development",
    status: "Complete",
    stats: [
      { label: "Homes", value: "Four" },
      { label: "Strategy", value: "Phased planning" },
      { label: "Outcome", value: "Full permission" },
    ],
    desc: "A single large plot assessed for capacity, then masterplanned and consented as four new homes through a phased planning strategy.",
    galleryImages: [],
    buildingType: "Residential plot with existing dwelling",
    planningRoute: "Phased, then full planning",
    projectStory: {
      summary: [
        "The redevelopment of a substantial residential plot with an existing dwelling, where Thistle Architecture was initially commissioned to assess the wider development potential of the site and establish how additional homes could be successfully accommodated.",
        "The feasibility process considered site capacity, access, highways, pedestrian routes, parking and the relationship between the proposed dwellings and the surrounding context. This resulted in a masterplan for four new homes, incorporating the demolition of the existing property and a comprehensive reconfiguration of the site.",
        "A phased planning strategy was developed to help establish an appropriate scale and massing for future development, including an initial approval for substantial ancillary buildings around the existing dwelling. The approved built form subsequently helped inform the scale and arrangement of the four-home redevelopment, which was progressed through a full planning application.",
        "Full planning permission was secured for the redevelopment.",
      ],
      sections: [
        { title: "Masterplan And Design", caption: "Capacity testing first, then a masterplan for four homes and a phased route to permission.",
          images: [
            { src: "/images/projects/rotherfield/sketch.jpg", alt: "Sketch view of the proposed homes in their landscape setting" },
            { src: "/images/projects/rotherfield/cgi.jpg", alt: "Visualisation of one of the four proposed homes" },
          ] },
      ],
    },
  },
  {
    slug: "school-house-south-downs",
    kind: "project",
    title: "An Accessible Family Home",
    location: "South Downs",
    image: "/images/projects/school-house/cgi-exterior.jpg",
    tag: "Residential",
    status: "Complete",
    stats: [
      { label: "Brief", value: "Level access throughout" },
      { label: "Setting", value: "South Downs" },
      { label: "Constraint", value: "Protected dark skies" },
    ],
    desc: "A family home reconfigured and extended around a daughter's mobility needs, in a landscape where even the external lighting was a planning matter.",
    galleryImages: [],
    buildingType: "Existing family home",
    planningRoute: "Full planning",
    projectStory: {
      summary: [
        "The sensitive reconfiguration and extension of an existing family home within the South Downs, designed to create a more accessible and functional ground floor for the owners and their daughter, whose ongoing mobility requirements were central to the brief.",
        "The proposals included a new single-storey rear extension, comprehensive ground-floor reconfiguration and level access throughout, alongside the creation of an accessible en-suite bathroom directly connected to the daughter's bedroom. External alterations and landscaping were also incorporated to improve accessibility and create a cohesive relationship between the house and garden.",
        "Given the property's sensitive landscape setting, the planning application required careful consideration of its environmental context, including external lighting designed to minimise impact on the area's protected dark skies.",
        "Thistle Architecture progressed the scheme through design and full planning, securing permission for the extension, external alterations and landscaping.",
      ],
      sections: [
        { title: "Design And Massing", caption: "The extension was tested in model form against the existing house before the planning application.",
          images: [
            { src: "/images/projects/school-house/model-1.jpg", alt: "Massing model of the proposed extension" },
            { src: "/images/projects/school-house/model-2.jpg", alt: "Second massing study of the proposal" },
          ] },
        { title: "The Proposal", caption: "A single-storey rear extension with level access throughout the ground floor.",
          images: [
            { src: "/images/projects/school-house/cgi-exterior.jpg", alt: "Visualisation of the extended house" },
            { src: "/images/projects/school-house/proposed-plan.jpg", alt: "Proposed ground floor plan showing the reconfigured accessible layout" },
          ] },
      ],
    },
  },
  {
    slug: "boyne-rise-kings-worthy",
    kind: "project",
    title: "Bungalow To Contemporary Family Home",
    location: "Kings Worthy, Winchester",
    image: "/images/projects/boyne-rise/cgi-1.jpg",
    tag: "High-End Residential",
    status: "On site",
    conversionTypes: ['high-end-residential'],
    stats: [
      { label: "Existing", value: "Bungalow" },
      { label: "Roof", value: "New gable-ended form" },
      { label: "Thistle role", value: "Feasibility to construction" },
    ],
    desc: "A bungalow on a corner plot, reworked internally and extended into a gable-ended house with vaulted ceilings over the open-plan heart.",
    galleryImages: [],
    buildingType: "Existing bungalow",
    planningRoute: "Full planning",
    projectStory: {
      summary: [
        "The comprehensive redevelopment of an existing bungalow on a substantial corner plot in Kings Worthy, Winchester, designed to create a significantly larger and more contemporary family home.",
        "The proposals include a complete internal reconfiguration alongside a substantial side extension, extending the existing pitched roof form to create a new gable-ended composition. Large areas of glazing to the front elevation and a series of south-facing rooflights bring extensive natural light into the property, while vaulted ceilings across the new kitchen, dining and living spaces create a generous open-plan heart to the home.",
        "Thistle Architecture was commissioned from the initial feasibility and concept design stage, progressing the project through full planning and subsequently completing the Stage 4 technical design package. Our involvement will continue through construction.",
      ],
      sections: [
        { title: "The Proposed House", caption: "The existing pitched roof is extended into a gable-ended composition, with glazing to the front and south-facing rooflights over the vaulted living spaces.",
          images: [
            { src: "/images/projects/boyne-rise/cgi-1.jpg", alt: "Visualisation of the extended house from the front" },
            { src: "/images/projects/boyne-rise/cgi-2.jpg", alt: "Visualisation showing the new gable and glazing" },
          ] },
      ],
    },
  },
  {
    slug: "campbell-road-croydon",
    kind: "project",
    title: "A 22-Bed HMO, Rebuilt",
    location: "Croydon, South London",
    image: "/images/projects/campbell-road/existing-2.jpg",
    tag: "HMO",
    status: "On site",
    conversionTypes: ['hmo'],
    stats: [
      { label: "Existing", value: "22-bed local authority HMO" },
      { label: "Proposed", value: "Fewer, larger en-suite rooms" },
      { label: "Thistle role", value: "Stage 4 and delivery" },
    ],
    desc: "An existing 22-bedroom local authority HMO reconfigured into fewer but far larger en-suite rooms, with Thistle running the technical package and the build.",
    galleryImages: [],
    buildingType: "Existing large HMO",
    projectStory: {
      summary: [
        "The comprehensive redevelopment of an existing 22-bedroom local authority HMO in Croydon for a large developer client, with the building being reconfigured to provide fewer but substantially larger bedrooms, each incorporating private en-suite facilities and kitchenettes.",
        "The wider redevelopment includes a substantial two-storey rear extension, additional single-storey accommodation and a complete loft conversion with new dormers. The proposals required an extensive technical design package, coordinating the new accommodation with the existing building and addressing the significant fire, building regulations, servicing and compliance requirements associated with a large-scale HMO.",
        "Thistle Architecture was appointed to deliver the Stage 4 technical design, drawing on our specialist experience within the HMO, co-living and commercial residential sectors. Following completion of the technical package, our role has continued through construction, providing Contract Administration and acting as Principal Designer.",
      ],
      sections: [
        { title: "The Existing Building", caption: "A large local authority HMO, to be reconfigured, extended to the rear and converted into the loft.",
          images: [
            { src: "/images/projects/campbell-road/existing-2.jpg", alt: "The existing HMO building from the street" },
            { src: "/images/projects/campbell-road/existing-1.jpg", alt: "The side and rear of the existing building" },
          ] },
      ],
    },
  },
  // Section 04 audit, August 2026: every "11 bedrooms" / "eleven-bed" mention
  // was corrected to 10 after checking against the source drawing (SK003 -
  // Highbury 10 Bed HMO Layout.pdf, "03 New Website/Feasibility Examples"),
  // which labels exactly ten rooms (bed 1 through bed 10) across ground,
  // first, second and mansard. galleryImages was empty despite that sketch
  // already existing as a processed asset in public/images/projects/; it's
  // now used here instead of sitting unreferenced.
  {
    slug: "highbury-buildings-cosham",
    kind: "project",
    title: "Commercial To Ten-Bed Co-Living",
    location: "Cosham, Portsmouth",
    image: "/images/projects/highbury/cgi-front.jpg",
    tag: "Co-Living",
    status: "On site",
    conversionTypes: ['co-living-large-hmo', 'hmo', 'commercial-to-residential'],
    stats: [
      { label: "Bedrooms", value: "10, all en suite" },
      { label: "Existing", value: "Commercial and storage" },
      { label: "Thistle role", value: "Feasibility, planning, Stage 4, interiors" },
    ],
    desc: "The end of a 1930s terrace, converted from commercial and storage space into ten en-suite co-living rooms with shared amenity on every floor.",
    galleryImages: ["/images/projects/highbury-sk003-1.webp"],
    buildingType: "1930s commercial building",
    planningRoute: "Full planning, change of use",
    projectStory: {
      summary: [
        "The conversion of an existing commercial building in Cosham, Portsmouth, into a 10-bedroom professional co-living HMO. The property forms the end of a 1930s terrace and retains attractive original brickwork and stone detailing, providing a strong architectural base for the redevelopment.",
        "The proposals involve the complete reconfiguration of the existing commercial and storage accommodation to create 10 generously sized en-suite bedrooms, with shared amenity spaces distributed across each floor. The property also benefits from on-site parking and a highly sustainable location.",
        "Thistle Architecture was commissioned from the initial feasibility stage, developing the scheme through planning and securing the change of use before progressing into Stage 4 technical design. Our involvement also includes the full interior design of the co-living accommodation, so the architectural and internal packages are developed as one coordinated scheme.",
      ],
      sections: [
        { title: "The Existing Building", caption: "The end of a 1930s terrace in commercial and storage use, with its original brickwork and stone detailing intact.",
          images: [
            { src: "/images/projects/highbury/existing-1.jpg", alt: "The existing commercial building on the corner of the terrace" },
            { src: "/images/projects/highbury/existing-2.jpg", alt: "The parade of shops with the subject building at the end" },
          ] },
        { title: "The Proposal", caption: "The original brick and stone are retained, with the accommodation entirely reconfigured behind them.",
          images: [
            { src: "/images/projects/highbury/cgi-front.jpg", alt: "Visualisation of the converted building from the front" },
            { src: "/images/projects/highbury/cgi-side.jpg", alt: "Visualisation of the side elevation" },
          ] },
      ],
    },
  },
];

export const feasibilityStudies = caseStudies.filter((c) => c.kind === 'feasibility');

// Ed's August 2026 final brief, section 05: the ten completed projects he
// wants leading the page, in this exact order. Anything not listed keeps its
// existing relative order and follows after. A priority list here, rather
// than physically reordering ~1500 lines of case study data, so the ordering
// intent stays obvious and editable on its own.
const COMPLETED_PROJECTS_PRIORITY = [
  'bereweeke-avenue',
  'highbury-buildings-cosham',
  'monument-house',
  'bishopstoke-road',
  'derby-road',
  'corner-house-hackney',
  'forest-house-lymington',
  'peterhayes-farm',
  'rotherfield-homes',
  'school-house-south-downs',
];

export const completedProjects = caseStudies
  .filter((c) => c.kind === 'project')
  .sort((a, b) => {
    const ai = COMPLETED_PROJECTS_PRIORITY.indexOf(a.slug);
    const bi = COMPLETED_PROJECTS_PRIORITY.indexOf(b.slug);
    if (ai === -1 && bi === -1) return 0; // stable: keep existing relative order
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
