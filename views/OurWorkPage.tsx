import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/animations/Reveal';
import type { CaseStudy } from '../data/caseStudiesData';

/**
 * /case-studies, the Our Work hub.
 *
 * Two doors, one for each listing, each with its count and the cover of its
 * newest entry. Deliberately short: the listings themselves carry the cards,
 * and this page exists so that the nav label and the homepage button land
 * somewhere called Our Work rather than on one of the two lists.
 */

const Door: React.FC<{ href: string; eyebrow: string; heading: string; body: string; count: number; cover?: CaseStudy }> = ({
  href,
  eyebrow,
  heading,
  body,
  count,
  cover,
}) => (
  <Link href={href} className="group block h-full rounded-2xl overflow-hidden bg-white border border-thistle-black/[0.06] hover:border-thistle-black/[0.12] hover:shadow-xl hover:shadow-thistle-black/[0.04] transition-all duration-500">
    <div className="relative aspect-[16/9] overflow-hidden bg-thistle-white/60">
      {cover && (
        <Image
          src={cover.image}
          alt={cover.title}
          fill
          sizes="(max-width: 1024px) 100vw, 660px"
          className={`${cover.imageKind === 'drawing' || cover.image.startsWith('/images/projects/') ? 'object-contain p-4 bg-white' : 'object-cover'} transition-transform duration-700 group-hover:scale-[1.03]`}
        />
      )}
    </div>
    <div className="p-fl-6">
      <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-3">{eyebrow}</p>
      <h2 className="text-fluid-h3 font-medium tracking-tight text-thistle-black mb-fl-2">{heading}</h2>
      <p className="text-fluid-sm text-thistle-black/70 leading-relaxed mb-fl-4">{body}</p>
      <span className="inline-flex items-center gap-1.5 text-fluid-sm font-medium text-thistle-black group-hover:text-thistle-green transition-colors">
        See all {count}
        <ArrowUpRight size={15} />
      </span>
    </div>
  </Link>
);

export const OurWorkPage: React.FC<{ studies: CaseStudy[]; projects: CaseStudy[] }> = ({ studies, projects }) => (
  <>
    <PageHero
      label="Our Work"
      heading="Our Work."
      description="What we have tested, and what we have built. Feasibility studies show the decision; completed projects show what happened after it."
    />
    <section className="bg-thistle-white py-fl-section px-fl-margin">
      <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-fl-6 items-stretch">
        <Reveal fullHeight>
          <Door
            href="/case-studies/feasibility-studies"
            eyebrow="Feasibility Studies"
            heading="The Decision, Before The Money."
            body="Buildings tested for what they could become: a clear Go, No-Go or set of options, with the sketch and the numbers behind it."
            count={studies.length}
            cover={studies[0]}
          />
        </Reveal>
        <Reveal delay={0.1} fullHeight>
          <Door
            href="/case-studies/completed-projects"
            eyebrow="Projects"
            heading="What Got Built, And What Is Being Built."
            body="Conversions, HMOs, co-living and homes, each carrying its stage: consented, at tender, on site or complete."
            count={projects.length}
            cover={projects[0]}
          />
        </Reveal>
      </div>
    </section>
  </>
);
