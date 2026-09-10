"use client";

import React from 'react';
import Image from 'next/image';
import { useTina } from 'tinacms/dist/react';
import { PageHero } from '../components/ui/PageHero';
import { Testimonials, type ReviewItem } from '../sections/Testimonials';
import { Reveal } from '../components/animations/Reveal';
import { motion } from 'framer-motion';
import { f, type TinaQuery, EMPTY_QUERY } from '../lib/tina-fields';
import { str, num, arr, pruneEmpty, normalizeImage } from '../lib/tina';

// Everything below is now a fallback rather than the page's only copy: the
// same strings also live in content/about/index.json, seeded byte-for-byte
// from what was here. They stay in code so the page renders unchanged if it is
// ever mounted without a CMS query, and so the provenance notes on each block
// stay next to the words they explain.

// Roster of six. Seyma joined on 2026-08-26: her caption had been ready for
// weeks and the only thing missing was a photograph, which the August studio
// shoot supplied. Onaiza is still off the page, with no photo and no presence
// on the client's live site.
//
// role and credentials are optional ON PURPOSE. No document anywhere gives job
// titles for Adouj or Beverley, and design.md forbids inventing team
// credentials, so their cards show name and photo until Ed confirms the titles.
// The schema keeps both optional for the same reason, and says so in the field
// descriptions the editor reads.
//
// `contribution` replaces the old CV-style bullet lists, per Ed's August 2026
// final brief: "Rewrite profiles around what each person contributes to
// projects rather than CV-style bullet lists." One factual credential line is
// kept underneath where it exists, since dropping it entirely would be losing
// real, confirmed information for the sake of a format change.
interface TeamMember {
  name: string;
  role?: string;
  image: string;
  contribution?: string;
  credential?: string;
  /**
   * CMS field ids for this one member. Per-item, never per-list: an id taken
   * from the list itself opens an empty form instead of the person clicked.
   */
  tina?: Partial<Record<'name' | 'role' | 'image' | 'contribution' | 'credential', string>>;
}

// Real photographs from the studio shoot on 23 August 2026, using the posed
// headshot set rather than the candid working shots: everyone faces the camera
// against the same background, so the six cards read as one set. They replaced
// AI-generated headshots, which were a likeness rather than a photograph and
// had put everyone in a suit instead of what they were actually wearing.
//
// Beverley is the exception. Only five people were photographed, so her card
// uses the photo she supplied. It is real but a plain snapshot rather than part
// of the set, and she should be included next time the photographer is in.
//
// The old AI set is still in public/images/team-review/ with the internal
// /team-review page, which compared the three options.
const TEAM_FALLBACK: TeamMember[] = [
  {
    name: "Edward Kercher",
    role: "Founder & Director",
    image: "/images/team/ed.jpg",
    contribution: "Sets the commercial and technical standard every feasibility is judged against, from £50,000 refurbishments to £20m construction management. Founded the Thistle Group, so the developer's perspective is built into how the practice works, not bolted on afterwards.",
    credential: "BA (Hons) Architectural Technology, CIAT Affiliate",
  },
  {
    name: "Kaan",
    role: "Design & Planning Lead",
    image: "/images/team/kaan.jpg",
    contribution: "Runs every feasibility from sketch scheme to sign-off, and is the designer most clients work with through planning. Five-plus years across residential and HMO projects, from deal sourcing through to submission.",
    credential: "BArch in Architecture",
  },
  {
    name: "Jan",
    role: "Interior Designer",
    image: "/images/team/jan.jpg",
    contribution: "Makes sure every scheme is finished to a demanding standard once the architecture is settled, drawing on 25 years across interior design, graphic design, and brand management.",
    credential: "HND Design, Associate CIPD",
  },
  {
    name: "Adouj Abu Saadeh",
    role: "Architectural Designer",
    image: "/images/team/adouj.jpg",
    contribution: "Brings international practice experience in Turkey, Azerbaijan, and the UAE to the design team, since moving to the UK.",
    credential: "BA Architecture, Bilkent University (High Honours, 2019); LEED Green Associate",
  },
  {
    // Caption supplied by Ed on WhatsApp; photo from the August 2026 studio
    // shoot, which is what had been blocking her going on the page.
    name: "Seyma",
    role: "Architectural Designer",
    image: "/images/team/seyma.jpg",
    contribution: "Takes projects from the first survey through design and into the planning and technical stages. Six-plus years across residential and HMO work, commercial surveying, design and planning in the UK.",
    credential: "BSc Architecture, MA Interior Design",
  },
  {
    name: "Beverley Gibbs",
    role: "Practice Manager",
    image: "/images/team/beverley.jpg",
    contribution: "Looks after the finance and admin that keeps every project on track behind the scenes, with over 20 years of practice and studio management experience.",
    credential: "BA (Hons)",
  },
];

interface Stat {
  value: string;
  label: string;
  tina?: Partial<Record<'value' | 'label', string>>;
}

// Ed's August 2026 final brief: "Keep '86% faster' only if the calculation is
// defensible; otherwise replace it with a factual proof point such as '500+
// conversions designed and built'." It's flagged unconfirmed in
// docs/case-study-confirmations.md and docs/dns-migration.md, so it's
// replaced here with the phrasing Ed used himself for the same kind of claim
// elsewhere in this brief (section 03), which doesn't depend on an unverified
// exact number. The field description repeats the standard in the editor: only
// a figure that could be evidenced if a client asked.
const STATS_FALLBACK: Stat[] = [
  // Ed's group figures (30 August 2026): 500+ projects and 350+ HMO
  // conversions across the Thistle Group, HMO Designers included. The 98.5%
  // planning figure came off at his request the same day.
  { value: "500+", label: "Projects delivered nationwide" },
  { value: "5 days", label: "Turnaround, committed" },
  { value: "350+", label: "HMO conversions designed" },
];

interface Theme {
  title: string;
  body: string;
  tina?: Partial<Record<'title' | 'body', string>>;
}

// The five themes from Ed's August 2026 final brief, section 07: "Core
// themes: Feasibility First; Existing Buildings & Retrofit; Data-Informed
// Decisions; Developer-Led / Commercially Aware Design; One Team Through
// Delivery."
const THEMES_FALLBACK: Theme[] = [
  { title: "Feasibility First", body: "Every project starts with the same question: does this actually work? We answer it with a fixed-fee feasibility before a single line is drawn." },
  { title: "Existing Buildings & Retrofit", body: "Most of what we do is testing and reusing what's already there, not building on a clean slate." },
  { title: "Data-Informed Decisions", body: "Planning history, policy, comparables and viability, checked before judgement is applied, not instead of it." },
  { title: "Developer-Led, Commercially Aware Design", body: "We design with the numbers in view throughout, not as a check at the end." },
  { title: "One Team Through Delivery", body: "The person who runs your feasibility is the designer you keep working with through planning and delivery." },
];

const HERO_FALLBACK = {
  label: 'About',
  heading: 'A Feasibility-First Architectural Practice.',
  description: 'We analyse the data, so the answer is accurate and the wait is short. We work with developers and high-end residential clients on retrofit, conversion, and the reuse of existing buildings.',
};

// `heading` and `headingAccent` are two fields because the second line is set
// in green. A single string with a newline, as the footer CTA uses, cannot
// carry that colour change.
const INTRO_FALLBACK = {
  eyebrow: 'Who We Are',
  heading: 'An Architecture Practice,',
  headingAccent: 'Built Around Feasibility.',
  // The practice, not a building. This section is "Who We Are", and it ran on
  // a strip-out shot of Beauchamp House, which says more about the work than
  // the people doing it. From the August 2026 studio shoot.
  image: '/images/site/team-at-work.jpg',
  imageAlt: 'The Thistle Architecture team working together in the studio, reviewing plans on laptops and tablets',
  body1: 'Thistle Architecture tests whether a building can become something more valuable, then designs and delivers the answer. Every scheme starts with the numbers, the planning policy, and the existing structure, so you know whether a deal stacks up before you commit to it.',
  body2: "Thistle Architecture is part of the Thistle Group, alongside HMO Designers and HMO Checker. Some of the team also develop and invest in the same kinds of buildings our clients buy, which sharpens the advice, but it supports the architecture, it doesn't replace it.",
};

const TEAM_COPY_FALLBACK = {
  eyebrow: 'The Team',
  heading: 'The People Behind',
  headingAccent: 'Every Feasibility.',
};

const REVIEWS_COPY_FALLBACK = {
  eyebrow: 'Client Reviews',
  heading: 'Judged On The Outcome.',
};

const CLOSING_FALLBACK = {
  eyebrow: 'How We Work',
  heading: 'Data First, Then Drawings.',
  body: 'Most practices design first and worry about viability later. We do it the other way round. We analyse the data first, which makes the answer more accurate and cuts the time it takes to get it. The team that runs your feasibility stays with you through sketch scheme, planning, and delivery, so nothing is lost in handover.',
};

interface AboutPageProps {
  /**
   * Raw CMS queries, passed straight through from the server page so that
   * useTina can re-run them live inside the editor. Optional so the page still
   * renders if it is mounted without them.
   */
  settings?: TinaQuery;
  reviews?: TinaQuery;
  /** This page's own copy, from the `about` singleton. */
  page?: TinaQuery;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, reviews, page }) => {
  // useTina returns the server data verbatim on the public site and swaps in
  // the live form values inside the editor. Passing a null-ish query is not
  // allowed, so the hooks run against a stub when the props are absent and the
  // results are discarded below.
  const { data: liveSettings } = useTina(settings ?? EMPTY_QUERY);
  const { data: liveReviews } = useTina(reviews ?? EMPTY_QUERY);
  const { data: livePage } = useTina(page ?? EMPTY_QUERY);

  const band = settings ? (liveSettings as any)?.settings?.testimonials : undefined;
  const a = page ? (livePage as any)?.about : undefined;

  // Spread over the fallbacks with pruneEmpty, exactly as the footer does: a
  // field the editor has cleared comes back as '' and would otherwise blank the
  // page, so an empty field simply leaves the standing copy in place.
  const hero = { ...HERO_FALLBACK, ...pruneEmpty({
    label: str(a?.hero?.label),
    heading: str(a?.hero?.heading),
    description: str(a?.hero?.description),
  }) };

  const intro = { ...INTRO_FALLBACK, ...pruneEmpty({
    eyebrow: str(a?.intro?.eyebrow),
    heading: str(a?.intro?.heading),
    headingAccent: str(a?.intro?.headingAccent),
    image: normalizeImage(a?.intro?.image),
    imageAlt: str(a?.intro?.imageAlt),
    body1: str(a?.intro?.body1),
    body2: str(a?.intro?.body2),
  }) };

  const teamCopy = { ...TEAM_COPY_FALLBACK, ...pruneEmpty({
    eyebrow: str(a?.team?.eyebrow),
    heading: str(a?.team?.heading),
    headingAccent: str(a?.team?.headingAccent),
  }) };

  const reviewsCopy = { ...REVIEWS_COPY_FALLBACK, ...pruneEmpty({
    eyebrow: str(a?.reviews?.eyebrow),
    heading: str(a?.reviews?.heading),
  }) };

  const closing = { ...CLOSING_FALLBACK, ...pruneEmpty({
    eyebrow: str(a?.closing?.eyebrow),
    heading: str(a?.closing?.heading),
    body: str(a?.closing?.body),
  }) };

  // Lists are all-or-nothing rather than merged item by item: the fallback
  // stands in only while there is no list at all, because an editor deleting
  // the fifth theme has to be able to delete it, not have it reappear. Each
  // item carries its own field ids so a click resolves to that card.
  const cmsThemes = arr<any>(a?.themes);
  const themes: Theme[] = cmsThemes.length
    ? cmsThemes.map((t) => ({
        title: str(t?.title),
        body: str(t?.body),
        tina: { title: f(t, 'title'), body: f(t, 'body') },
      }))
    : THEMES_FALLBACK;

  const cmsStats = arr<any>(a?.stats);
  const stats: Stat[] = cmsStats.length
    ? cmsStats.map((s) => ({
        value: str(s?.value),
        label: str(s?.label),
        tina: { value: f(s, 'value'), label: f(s, 'label') },
      }))
    : STATS_FALLBACK;

  const cmsTeam = arr<any>(a?.team?.members);
  const team: TeamMember[] = cmsTeam.length
    ? cmsTeam.map((m) => ({
        name: str(m?.name),
        // Still optional on purpose — see the note on TeamMember. An empty
        // field has to mean "no confirmed title", not "fall back to one".
        role: str(m?.role) || undefined,
        image: normalizeImage(m?.image),
        contribution: str(m?.contribution) || undefined,
        credential: str(m?.credential) || undefined,
        tina: {
          name: f(m, 'name'),
          role: f(m, 'role'),
          image: f(m, 'image'),
          contribution: f(m, 'contribution'),
          credential: f(m, 'credential'),
        },
      }))
    : TEAM_FALLBACK;

  // Connection nodes carry their own metadata, so each review's marker points
  // at that review's document rather than at the list.
  const reviewItems: ReviewItem[] | undefined = reviews
    ? arr((liveReviews as any)?.reviewConnection?.edges)
        .map((e: any) => e?.node)
        .filter(Boolean)
        .sort((a: any, b: any) => num(a?.order) - num(b?.order))
        .map((n: any) => ({
          author: str(n.author),
          title: str(n.title) || undefined,
          quote: str(n.quote),
          date: str(n.date),
          datePublished: str(n.datePublished),
          rating: num(n.rating, 5) as 5,
          topics: arr<string>(n.topics) as ReviewItem['topics'],
          tina: {
            author: f(n, 'author'),
            title: f(n, 'title'),
            quote: f(n, 'quote'),
            date: f(n, 'date'),
          },
        }))
    : undefined;

  return (
    <>
      <PageHero
        label={hero.label}
        heading={hero.heading}
        description={hero.description}
        tina={{
          label: f(a?.hero, 'label'),
          heading: f(a?.hero, 'heading'),
          description: f(a?.hero, 'description'),
        }}
      />

      {/* Who we are / how we work. Ed's August 2026 final brief: "Make the
          page about Thistle Architecture as a practice, not primarily about
          the fact that the team buys and invests in buildings." The old
          headline led with "We Buy, Convert, And Invest In Buildings Too.";
          direct development experience is now supporting credibility in the
          closing paragraph, not the practice's main definition. */}
      <section className="py-fl-section px-fl-margin bg-white">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-fl-8 items-center mb-fl-8">
          <Reveal>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-thistle-black/[0.06]">
              {/* The marker goes on the image itself, not the rounded frame
                  around it: the frame is a wrapper, and a marker there would
                  swallow every click inside it. */}
              <Image
                src={intro.image}
                alt={intro.imageAlt}
                fill
                sizes="(max-width: 1024px) 90vw, 620px"
                className="object-cover"
                data-tina-field={f(a?.intro, 'image')}
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4" data-tina-field={f(a?.intro, 'eyebrow')}>{intro.eyebrow}</p>
              {/* Two fields, two markers. The h2 holds the first line, so it
                  carries `heading`; the green span holds the second and
                  carries its own, and closest() finds the span first for a
                  click on the green words. */}
              <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-5" data-tina-field={f(a?.intro, 'heading')}>
                {intro.heading}<br /><span className="text-thistle-green" data-tina-field={f(a?.intro, 'headingAccent')}>{intro.headingAccent}</span>
              </h2>
              <p className="text-fluid-base text-thistle-black/80 leading-relaxed mb-fl-4" data-tina-field={f(a?.intro, 'body1')}>
                {intro.body1}
              </p>
              <p className="text-fluid-base text-thistle-black/80 leading-relaxed" data-tina-field={f(a?.intro, 'body2')}>
                {intro.body2}
              </p>
            </div>
          </Reveal>
        </div>

        <div className="max-w-[1360px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-fl-4">
          {/* Keyed by position rather than by title. The title is a live form
              value in the editor, so keying on it remounts the card on every
              keystroke and replays the reveal animation as you type. */}
          {themes.map((theme, i) => (
            <Reveal key={i} delay={0.15 + Math.min(i * 0.05, 0.2)} fullHeight>
              <div className="h-full rounded-2xl bg-thistle-white/70 border border-thistle-black/[0.06] p-fl-5">
                <h3 className="text-fluid-sm font-semibold tracking-tight text-thistle-black mb-fl-2" data-tina-field={theme.tina?.title}>{theme.title}</h3>
                <p className="text-fluid-sm text-thistle-black/60 leading-relaxed" data-tina-field={theme.tina?.body}>{theme.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stats row */}
      <section className="py-fl-section-sm px-fl-margin bg-thistle-black text-white">
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {stats.map((stat, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className={`flex flex-col items-center text-center px-fl-5 py-fl-3 ${i > 0 ? 'md:border-l md:border-white/[0.1]' : ''}`}>
                  <span className="text-fluid-h3 font-semibold tracking-tight text-white block mb-1" data-tina-field={stat.tina?.value}>{stat.value}</span>
                  <span className="text-sm text-white/70" data-tina-field={stat.tina?.label}>{stat.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-fl-section px-fl-margin bg-thistle-white">
        <div className="max-w-[1360px] mx-auto">
          <div className="text-center mb-fl-8 max-w-2xl mx-auto">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4" data-tina-field={f(a?.team, 'eyebrow')}>{teamCopy.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black" data-tina-field={f(a?.team, 'heading')}>
                {teamCopy.heading}<br /><span className="text-thistle-green" data-tina-field={f(a?.team, 'headingAccent')}>{teamCopy.headingAccent}</span>
              </h2>
            </Reveal>
          </div>

          {/* 3 columns, not 4: the roster is 6, so three gives a clean 3+3.
              A 4-col grid would strand the last two on their own row. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fl-5 items-stretch">
            {/* Keyed by position, not by name, for the same reason as the
                themes above: the name is being typed into as you watch. */}
            {team.map((member, i) => (
              <Reveal key={i} delay={i * 0.08} fullHeight>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="h-full rounded-2xl overflow-hidden bg-white border border-thistle-black/[0.06] hover:border-thistle-black/[0.12] hover:shadow-xl hover:shadow-thistle-black/[0.04] transition-all duration-500"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-thistle-white/60">
                    {/* Guarded because an editor can clear an image field, and
                        next/image throws on an empty src. The tinted box is
                        kept so the card keeps its shape while a replacement
                        photo is being chosen.

                        Alt text is derived from the name and role rather than
                        being a field of its own, so it cannot drift out of date
                        when either is edited. */}
                    {member.image && (
                      <Image
                        src={member.image}
                        alt={member.role ? `${member.name}, ${member.role} at Thistle Architecture` : `${member.name} at Thistle Architecture`}
                        fill
                        sizes="(max-width: 640px) 90vw, 320px"
                        className="object-cover"
                        data-tina-field={member.tina?.image}
                      />
                    )}
                  </div>
                  <div className="p-fl-5">
                    <h3 className="text-fluid-h5 font-medium tracking-tight text-thistle-black" data-tina-field={member.tina?.name}>{member.name}</h3>
                    {member.role && (
                      <p className="text-[11px] uppercase tracking-wider text-thistle-green font-semibold mt-fl-1 mb-fl-3" data-tina-field={member.tina?.role}>{member.role}</p>
                    )}
                    {member.contribution && (
                      <p className="text-fluid-sm text-thistle-black/70 leading-relaxed mb-fl-2" data-tina-field={member.tina?.contribution}>{member.contribution}</p>
                    )}
                    {member.credential && (
                      <p className="text-xs text-thistle-black/40" data-tina-field={member.tina?.credential}>{member.credential}</p>
                    )}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews sit after the team, so the names in them are people the
          reader has just met. Sunny Berhane leads: it is about repeat work with
          Edward and Kaan rather than a single project, which suits a page about
          the practice. featuredAuthor is a lookup against the review author, so
          it stays in code — it selects a record rather than saying anything. */}
      <Testimonials
        eyebrow={reviewsCopy.eyebrow}
        heading={reviewsCopy.heading}
        featuredAuthor="Sunny Berhane"
        lede={band ? str(band.lede) || undefined : undefined}
        linkLabel={band ? str(band.linkLabel) || undefined : undefined}
        reviews={reviewItems}
        tina={{
          eyebrow: f(a?.reviews, 'eyebrow'),
          heading: f(a?.reviews, 'heading'),
          lede: f(band, 'lede'),
          linkLabel: f(band, 'linkLabel'),
        }}
      />

      {/* Approach statement */}
      <section className="py-fl-section px-fl-margin bg-white">
        <div className="max-w-[800px] mx-auto text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4" data-tina-field={f(a?.closing, 'eyebrow')}>{closing.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-5" data-tina-field={f(a?.closing, 'heading')}>
              {closing.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-fluid-base text-thistle-black/80 leading-relaxed" data-tina-field={f(a?.closing, 'body')}>
              {closing.body}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
};
