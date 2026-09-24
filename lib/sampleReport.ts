/**
 * The example feasibility, and where it lives.
 *
 * Ed sent the Claremont Road pack on 23 September 2026, which is the example the
 * package page had been promising since August. Published two ways: the whole
 * thing as one file, and each document on its own, because someone who wants
 * the sketch should not have to open fifteen pages to reach it.
 *
 * Luton Borough Council's own HMO standards document came with them and is
 * deliberately NOT republished. It is the council's copyright, and they publish
 * it themselves.
 *
 * WHAT WE SAY ABOUT IT, AND WHY IT IS WORDED CAREFULLY. The pack carries no
 * client name, no house number, no postcode and no contact details. It does
 * name the street and the town, and its planning research names eight nearby
 * properties with their application references, which are public records. So
 * the site says the client is not named. It does not say "client details
 * removed", which the document would not support and which invites exactly the
 * reading it cannot survive.
 *
 * The file names carry a random suffix. That is not security, since anyone with
 * the link can pass it on. It stops the address being guessed from the page, so
 * the email step is worth something.
 *
 * Named here rather than typed in three places: the card reveals these, the
 * Formspree autoresponse emails them, and a rename that missed one would send
 * people to a 404 they cannot report. scripts/test-sample-report.mjs fails the
 * build if a file here is missing or is not in the email.
 */
export interface SampleReportPart {
  label: string;
  path: string;
  /** Pages, so the email and the card can say how long each one is. */
  pages: number;
}

export const SITE = 'https://www.thistlearchitecture.co.uk';

/** Everything in one file, which is what the card's button opens. */
export const SAMPLE_REPORT_PATH = '/downloads/thistle-example-feasibility-claremont-road-9e72bfd0.pdf';
export const SAMPLE_REPORT_URL = SITE + SAMPLE_REPORT_PATH;
export const SAMPLE_REPORT_PAGES = 15;

/** The same documents separately, in the order they appear in the pack. */
export const SAMPLE_REPORT_PARTS: SampleReportPart[] = [
  {
    label: 'Feasibility Overview',
    path: '/downloads/claremont-road-overview-c4812e.pdf',
    pages: 4
  },
  {
    label: 'Planning Research',
    path: '/downloads/claremont-road-planning-research-d9221d.pdf',
    pages: 7
  },
  {
    label: 'Space Standards',
    path: '/downloads/claremont-road-space-standards-3068bf.pdf',
    pages: 3
  },
  {
    label: 'Sketch Layout',
    path: '/downloads/claremont-road-sketch-layout-c5fb3b.pdf',
    pages: 1
  }
];

/** Luton's HMO standards, cited in the pack. Linked, never rehosted. */
export const SAMPLE_REPORT_COUNCIL_DOC =
  'https://www.luton.gov.uk/Housing/Pages/Private-sector-housing.aspx';
