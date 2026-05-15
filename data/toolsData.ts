export interface Tool {
  slug: string;
  label: string;
  summary: string;
  iconName: 'ListChecks' | 'Calculator';
  path: string;
  metaTitle: string;
  metaDescription: string;
}

export const tools: Tool[] = [
  {
    slug: "class-ma-checker",
    label: "Class MA Eligibility Checker",
    summary: "Six quick questions to see if your building qualifies for permitted-development conversion under Class MA.",
    iconName: "ListChecks",
    path: "/tools/class-ma-checker",
    metaTitle: "Class MA Eligibility Checker | Thistle Architecture",
    metaDescription: "Free Class MA eligibility checker. Six quick questions on use class, vacancy, floor space, Article 4, and listing status. See whether your office-to-resi conversion qualifies for permitted development.",
  },
  {
    slug: "gdv-calculator",
    label: "GDV & Viability Calculator",
    summary: "A quick back-of-envelope check on whether the numbers work, before you spend a pound on a feasibility.",
    iconName: "Calculator",
    path: "/tools/gdv-calculator",
    metaTitle: "GDV & Viability Calculator | Thistle Architecture",
    metaDescription: "Free GDV and viability calculator for conversion schemes. Enter purchase price, area, units, and sale prices; see projected margin and a quick verdict on whether the deal stacks up.",
  },
];

export const getToolBySlug = (slug: string): Tool | undefined =>
  tools.find((t) => t.slug === slug);
