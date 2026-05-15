"use client";

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/animations/Reveal';
import { Button } from '../components/ui/Button';
import { useFeasibility } from '../components/feasibility/FeasibilityContext';
import { deliverables } from '../data/howItWorksData';
import {
  pricingFrom,
  pricingCaption,
  deliverableDetail,
} from '../data/feasibilityPackageData';
import { PricingAnchor } from '../sections/feasibility-package/PricingAnchor';
import { DeliverableRow } from '../sections/feasibility-package/DeliverableRow';
import { deliverableGraphicMap } from '../sections/feasibility-package/deliverableGraphics';
import { SampleReport } from '../sections/feasibility-package/SampleReport';
import { TimelineBand } from '../sections/feasibility-package/TimelineBand';
import { ScopeClarity } from '../sections/feasibility-package/ScopeClarity';
import { PackageFAQ } from '../sections/feasibility-package/PackageFAQ';

export const FeasibilityPackagePage: React.FC = () => {
  const { openModal } = useFeasibility();

  return (
    <>
      <PageHero
        label="Feasibility Package"
        heading="Everything In Five Days, For A Fixed Fee."
        description="One package. One price. One clear Go or No-Go on whether your building is worth taking forward."
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

      <PricingAnchor priceFrom={pricingFrom} caption={pricingCaption} />

      {/* The six deliverables, expanded */}
      <section className="bg-white py-fl-section px-fl-margin">
        <div className="max-w-[1360px] mx-auto">
          <div className="text-center mb-fl-section-sm max-w-2xl mx-auto">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">What You Get</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
                Six Deliverables.<br /><span className="text-thistle-green">One Decision.</span>
              </h2>
            </Reveal>
          </div>

          <div className="space-y-fl-section-sm">
            {deliverables.map((deliverable, i) => {
              const detail = deliverableDetail[i];
              const Graphic = deliverableGraphicMap[detail.graphic];
              const num = String(i + 1).padStart(2, '0');
              return (
                <DeliverableRow
                  key={num}
                  num={num}
                  deliverable={deliverable}
                  detail={detail}
                  reversed={i % 2 !== 0}
                  graphicSlot={<Graphic />}
                />
              );
            })}
          </div>
        </div>
      </section>

      <SampleReport />

      <TimelineBand />

      <ScopeClarity />

      {/* Closing CTA */}
      <section className="py-fl-section px-fl-margin bg-white">
        <div className="max-w-[1360px] mx-auto text-center">
          <Reveal>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-5">
              Ready When You Are.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-fluid-base text-thistle-black/80 leading-relaxed max-w-md mx-auto mb-fl-6">
              Submit your building, get a clear answer in five days, for a fixed fee.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Button variant="primary" size="lg" icon={<ArrowUpRight size={18} />} onClick={openModal}>
              Start Feasibility
            </Button>
          </Reveal>
        </div>
      </section>

      <PackageFAQ />
    </>
  );
};
