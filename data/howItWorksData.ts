export type StepGraphicKey = 'step1' | 'step2' | 'jodi-call' | 'step4' | 'final-meeting';

export interface HowItWorksStep {
  num: string;
  durationLabel: string;
  title: string;
  lead: string;
  detail: string;
  graphic: StepGraphicKey;
}

export interface Deliverable {
  title: string;
  desc: string;
}

// Duration labels are a proposal, flagged for confirmation with the client.
export const howItWorksSteps: HowItWorksStep[] = [
  {
    num: "01",
    durationLabel: "Under 2 minutes",
    title: "Upload Property Details",
    lead: "Share your property's address with a few basic details: size, floor count, and current use.",
    detail: "You do not need detailed drawings. Basic floor plans, an address, and your initial assumptions on unit count are enough. If you do not have floor plans, we can often source them ourselves.",
    graphic: "step1",
  },
  {
    num: "02",
    durationLabel: "Automated, within 48 hours",
    title: "Automated Analysis",
    lead: "Our data engine checks planning history, site constraints, density data, and comparable schemes across your local area.",
    detail: "Hundreds of data points are cross-referenced across trusted sources before a human looks at the site. This is the desk study, done in hours, not weeks.",
    graphic: "step2",
  },
  {
    num: "03",
    durationLabel: "Instant call",
    title: "Project Data Gathering Session",
    lead: "An instant call with Jodi, our property expert, to gather the details we need and walk through your goals for the site.",
    detail: "A short, focused conversation. Jodi confirms what the data engine found and captures anything specific to your plans for the building.",
    graphic: "jodi-call",
  },
  {
    num: "04",
    durationLabel: "Days 3 to 4",
    title: "Sketch Scheme Stage",
    lead: "One of our architects carries out the sketch scheme analysis to find the best possible layout for the building.",
    detail: "The architect pressure-tests the data against the physical building, sketches the optimal unit layout, and works through the spatial problems automation cannot solve.",
    graphic: "step4",
  },
  {
    num: "05",
    durationLabel: "Day 5",
    title: "Final Meeting",
    lead: "We review the completed feasibility together on a video call, five days after you uploaded your details.",
    detail: "You leave the call with a clear Go or No-Go, the full report, and the layouts. Enough to bid, exchange, or walk away with confidence.",
    graphic: "final-meeting",
  },
];

// One-line descriptions for the six compact layer cards nested under Step 2.
// Indexed to match feasibilityLayers in data/feasibilityLayers.ts.
export const layerBlurbs: string[] = [
  "Five years of approvals and refusals around the site.",
  "Local and national policy, Building Regs, and licensing.",
  "Density, change-of-use, and local planning thresholds.",
  "Nearby conversions, unit counts, and achieved sale values.",
  "Build cost, margin, and ROI before you commit capital.",
  "Architect-led layout options that maximise unit yield.",
];

export const deliverables: Deliverable[] = [
  { title: "GA Floor Plans", desc: "Proposed layouts showing unit positions, circulation, and core areas." },
  { title: "Schedule of Accommodation", desc: "Unit-by-unit breakdown with GIA, room counts, and NDSS compliance." },
  { title: "Constraints Analysis", desc: "Planning policy, flood risk, Article 4, conservation, and heritage assessment." },
  { title: "Risk Register", desc: "Structural, environmental, and commercial risks, quantified with cost implications." },
  { title: "Go/No-Go Recommendation", desc: "A clear, unambiguous recommendation backed by evidence." },
  { title: "Efficiency Metrics", desc: "Net-to-gross ratios, GDV estimates, and commercial viability indicators." },
];
