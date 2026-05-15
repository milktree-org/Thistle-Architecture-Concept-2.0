"use client";

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Reveal } from '../../components/animations/Reveal';
import { deliverables } from '../../data/howItWorksData';
import type { DeliverableHighlight } from '../../data/conversionsData';

interface HowThistleSolvesProps {
  typeLabel: string;
  highlights: DeliverableHighlight[];
}

// Type-specific deliverable highlights. For each highlight, render a card with
// the deliverable's canonical title and description (from howItWorksData) plus
// the per-type "for this type" framing line (from the conversion record).
export const HowThistleSolves: React.FC<HowThistleSolvesProps> = ({ typeLabel, highlights }) => (
  <section className="bg-white py-fl-section px-fl-margin">
    <div className="max-w-[1360px] mx-auto">
      <div className="text-center mb-fl-8 max-w-2xl mx-auto">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">How We Solve It</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
            Built For<br /><span className="text-thistle-green">{typeLabel}.</span>
          </h2>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-fl-4">
        {highlights.map((h, i) => {
          const deliverable = deliverables[h.deliverableIndex];
          if (!deliverable) return null;
          return (
            <Reveal key={i} delay={i * 0.08}>
              <div className="bg-thistle-white rounded-2xl border border-thistle-black/[0.06] p-fl-6 h-full flex flex-col">
                <div className="flex items-center gap-fl-3 mb-fl-4">
                  <div className="w-9 h-9 rounded-xl bg-thistle-green/10 flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-thistle-green" />
                  </div>
                  <h3 className="text-fluid-h6 font-medium tracking-tight text-thistle-black">{deliverable.title}</h3>
                </div>
                <p className="text-fluid-base text-thistle-black/80 leading-relaxed mb-fl-4">
                  {deliverable.desc}
                </p>
                <p className="text-fluid-sm text-thistle-black/55 leading-relaxed mt-auto pt-fl-4 border-t border-thistle-black/[0.06]">
                  {h.forThisType}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);
