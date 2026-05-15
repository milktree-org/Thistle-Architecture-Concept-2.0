"use client";

import React from 'react';
import { Reveal } from '../../components/animations/Reveal';
import type { ConversionStat } from '../../data/conversionsData';

interface OpportunityProps {
  copy: string;
  stats: ConversionStat[];
}

// The opportunity section: short framing copy plus three stat cards.
export const Opportunity: React.FC<OpportunityProps> = ({ copy, stats }) => (
  <section className="bg-white py-fl-section px-fl-margin">
    <div className="max-w-[1000px] mx-auto">
      <div className="text-center mb-fl-8 max-w-2xl mx-auto">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">The Opportunity</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-fluid-base text-thistle-black/80 leading-relaxed">
            {copy}
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-fl-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-thistle-white rounded-2xl border border-thistle-black/[0.06] p-fl-6 text-center">
              <span className="block text-[10px] uppercase tracking-widest text-thistle-green font-semibold mb-fl-3">{s.label}</span>
              <span className="block text-fluid-h3 font-medium tracking-tight text-thistle-black leading-none">{s.value}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);
