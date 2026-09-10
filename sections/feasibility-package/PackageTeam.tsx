"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../../components/animations/Reveal';
import { pruneEmpty } from '../../lib/tina';

/**
 * One person on the trust band, plus the CMS field ids for that one card.
 */
export interface PackagePerson {
  name: string;
  role: string;
  line: string;
  /** Optional: a card with no photograph shows initials instead. See below. */
  image?: string;
  /**
   * Per-item, never per-list: an id taken from the list itself opens an empty
   * form instead of the person clicked.
   */
  tina?: Partial<Record<'name' | 'role' | 'line' | 'image', string>>;
}

// Ed's August 2026 final brief, section 03: "Make Edward and Kaan part of the
// reason to buy the design-led service", and add Jodi as the first point of
// contact for Expert Sessions. Bios follow his wording closely.
//
// Jodi has no photo yet (About page's own note: no photo in the client's Team
// Photos folder for her), so her card uses an initials avatar rather than
// inventing or borrowing one, same discipline the About page roster follows
// for anyone whose details are not yet confirmed.
//
// Now a fallback rather than this section's only copy: the same strings live in
// content/feasibility/package.json, seeded byte-for-byte from here.
const PEOPLE_FALLBACK: PackagePerson[] = [
  {
    name: "Edward Kercher",
    role: "Founder & Director",
    line: "Commercial and technical experience from £50,000 refurbs to £20m construction management. Founder of HMO Designers and HMO Checker, and a developer himself, so the advice comes from someone who has taken the risk personally.",
    image: "/images/team/ed.jpg",
  },
  {
    name: "Kaan",
    role: "Design & Planning Lead",
    line: "BArch. Runs every feasibility from sketch scheme to sign-off, with 5+ years across residential and HMO planning, from deal sourcing through to submission.",
    image: "/images/team/kaan.jpg",
  },
  {
    name: "Jodi",
    role: "Business Development & Expert Sessions",
    line: "A property sales background and strong HMO and developer knowledge. Jodi is the first point of contact for a free Expert Session: she helps you understand the opportunity, clarify your objectives, and choose the right feasibility route.",
  },
];

const HEADER_FALLBACK = {
  eyebrow: 'The People',
  heading: "Who You're Working With.",
  linkLabel: 'Meet the whole team',
};

// Ed's August 2026 final brief: "Use concise credibility proof such as
// hundreds of conversions designed, nationwide project experience,
// planning success and core project types." Phrased generally rather
// than borrowing HMO Designers' own project-count figures, which are a
// different business's numbers.
const PROOF_POINTS_FALLBACK = [
  '350+ HMO conversions designed, across the group',
  '500+ projects delivered nationwide',
  'Commercial, HMO, co-living and high-end residential',
];

// Derived from the name rather than being a field of its own, so it cannot
// drift when a name is edited — the same reason the photo description below is
// built from the name and role. "Edward Kercher" gives "EK", "Kaan" gives "K",
// which is exactly what the three cards carried when it was typed by hand.
const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');

interface PackageTeamProps {
  eyebrow?: string;
  heading?: string;
  linkLabel?: string;
  /**
   * All-or-nothing rather than merged person by person: an editor removing
   * someone has to be able to remove them, not have them reappear.
   */
  people?: PackagePerson[];
  proofPoints?: { label: string; tina?: string }[];
  /** CMS field ids for this section's own copy. */
  tina?: Partial<Record<'eyebrow' | 'heading' | 'linkLabel', string>>;
}

// Compact trust band: the people a buyer actually deals with.
export const PackageTeam: React.FC<PackageTeamProps> = ({ eyebrow, heading, linkLabel, people, proofPoints, tina }) => {
  // pruneEmpty: a field the editor has cleared arrives as '' and would blank the
  // heading, so an empty field leaves the standing copy in place.
  const copy = { ...HEADER_FALLBACK, ...pruneEmpty({ eyebrow, heading, linkLabel }) };
  const rows = people?.length ? people : PEOPLE_FALLBACK;
  // Annotated: the fallback branch carries no `tina` key, so the inferred
  // union would drop the field id from the type at the render site.
  const proof: { label: string; tina?: string }[] = proofPoints?.length
    ? proofPoints
    : PROOF_POINTS_FALLBACK.map((label) => ({ label }));

  return (
    <section className="bg-white py-fl-section px-fl-margin">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-fl-8 max-w-2xl mx-auto">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4" data-tina-field={tina?.eyebrow}>{copy.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black" data-tina-field={tina?.heading}>
              {copy.heading}
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-fl-5">
          {/* Keyed by position rather than by name: the name is a live form
              value in the editor, so keying on it remounts the card on every
              keystroke and replays the reveal animation as you type. */}
          {rows.map((person, i) => (
            <Reveal key={i} delay={i * 0.08} fullHeight>
              <div className="h-full flex flex-col items-center text-center gap-fl-4 rounded-2xl bg-thistle-white/70 border border-thistle-black/[0.06] p-fl-5">
                {person.image ? (
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-full overflow-hidden ring-2 ring-thistle-green/20">
                    {/* The marker goes on the image itself, not the round frame
                        around it: the frame is a wrapper, and a marker there
                        would swallow every click inside it.

                        Alt text is derived from the name and role rather than
                        being a field of its own, so it cannot drift out of date
                        when either is edited. */}
                    <Image
                      src={person.image}
                      alt={`${person.name}, ${person.role} at Thistle Architecture`}
                      fill
                      sizes="80px"
                      className="object-cover"
                      data-tina-field={person.tina?.image}
                    />
                  </div>
                ) : (
                  <div
                    className="w-20 h-20 flex-shrink-0 rounded-full bg-thistle-green/10 ring-2 ring-thistle-green/20 flex items-center justify-center text-lg font-bold text-thistle-green"
                    aria-hidden="true"
                  >
                    {initialsOf(person.name)}
                  </div>
                )}
                <div>
                  <span className="block text-fluid-h6 font-medium tracking-tight text-thistle-black" data-tina-field={person.tina?.name}>{person.name}</span>
                  <span className="block text-[10px] uppercase tracking-wider text-thistle-green font-semibold mt-0.5 mb-fl-2" data-tina-field={person.tina?.role}>{person.role}</span>
                  <p className="text-fluid-sm text-thistle-black/65 leading-snug" data-tina-field={person.tina?.line}>{person.line}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="flex flex-wrap items-center justify-center gap-x-fl-6 gap-y-fl-2 mt-fl-7 text-xs text-thistle-black/50">
            {/* Each claim carries its own marker; the dots between them are
                separators rather than copy and carry none. The separator sits
                before every claim but the first, which is how the row was
                written by hand. */}
            {proof.map((point, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="hidden sm:inline text-thistle-black/20">·</span>}
                <span data-tina-field={point.tina}>{point.label}</span>
              </React.Fragment>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-center mt-fl-6">
            <Link href="/about" className="inline-flex items-center gap-1.5 text-sm font-medium text-thistle-green hover:text-thistle-black transition-colors" data-tina-field={tina?.linkLabel}>
              {copy.linkLabel}
              <ArrowUpRight size={15} />
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
};
