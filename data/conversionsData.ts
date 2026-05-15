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
