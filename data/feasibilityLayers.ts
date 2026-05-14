export interface FeasibilityLayer {
  eyebrow: string;
  title: string;
}

// The six data layers of the Feasibility Engine. Shared between the homepage
// FeasibilityEngine section and the How It Works page so layer names cannot drift.
export const feasibilityLayers: FeasibilityLayer[] = [
  { eyebrow: "Layer 01", title: "Planning history & policy analysis" },
  { eyebrow: "Layer 02", title: "Local Policy Analysis" },
  { eyebrow: "Layer 03", title: "Targeted Policy Analysis" },
  { eyebrow: "Layer 04", title: "Comparable schemes" },
  { eyebrow: "Layer 05", title: "GDV and viability" },
  { eyebrow: "Layer 06", title: "Spatial layout optimisation" },
];
