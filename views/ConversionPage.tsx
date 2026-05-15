"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/animations/Reveal';
import { Button } from '../components/ui/Button';
import { useFeasibility } from '../components/feasibility/FeasibilityContext';
import { FAQ } from '../sections/FAQ';
import { Opportunity } from '../sections/conversions/Opportunity';
import { Challenges } from '../sections/conversions/Challenges';
import { HowThistleSolves } from '../sections/conversions/HowThistleSolves';
import { RelatedCaseStudy } from '../sections/conversions/RelatedCaseStudy';
import type { Conversion } from '../data/conversionsData';

interface ConversionPageProps {
  conversion: Conversion;
}

export const ConversionPage: React.FC<ConversionPageProps> = ({ conversion }) => {
  const { openModal } = useFeasibility();

  return (
    <>
      <PageHero
        label={conversion.label}
        heading={conversion.heroHeading}
        description={conversion.heroDescription}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-fl-4">
          <Button variant="primary" icon={<ArrowUpRight size={16} />} onClick={openModal}>
            Start Feasibility
          </Button>
          <Link href="/how-it-works" className="text-sm text-thistle-black/70 hover:text-thistle-black transition-colors font-medium tracking-tight">
            How it works &rarr;
          </Link>
        </div>
      </PageHero>

      <Opportunity copy={conversion.opportunityCopy} stats={conversion.opportunityStats} />

      <Challenges typeLabel={conversion.label} challenges={conversion.challenges} />

      <HowThistleSolves typeLabel={conversion.label} highlights={conversion.deliverableHighlights} />

      <RelatedCaseStudy slug={conversion.relatedCaseStudySlug} />

      {/* Closing CTA */}
      <section className="py-fl-section px-fl-margin bg-white">
        <div className="max-w-[1360px] mx-auto text-center">
          <Reveal>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-5">
              Test This Building.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-fluid-base text-thistle-black/80 leading-relaxed max-w-md mx-auto mb-fl-6">
              Submit your property and get a clear Go or No-Go in five days, for a fixed fee.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Button variant="primary" size="lg" icon={<ArrowUpRight size={18} />} onClick={openModal}>
              Start Feasibility
            </Button>
          </Reveal>
        </div>
      </section>

      <FAQ />
    </>
  );
};
