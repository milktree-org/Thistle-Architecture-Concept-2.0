"use client";

import React from 'react';
import { X } from 'lucide-react';
import { Reveal } from '../../components/animations/Reveal';
import { notIncluded } from '../../data/feasibilityPackageData';

// The "what is not included" list. Sets honest expectations on a fixed-fee
// productised package: items outside the scope are named plainly.
export const ScopeClarity: React.FC = () => (
  <section className="bg-thistle-white py-fl-section px-fl-margin">
    <div className="max-w-[1000px] mx-auto">
      <div className="text-center mb-fl-8 max-w-2xl mx-auto">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">Scope</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-4">
            What&apos;s Not Included.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-fluid-base text-thistle-black/70 leading-relaxed">
            Honest scope from the start. These items sit outside the fixed feasibility fee. We can quote separately if any are needed.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <ul className="rounded-2xl border border-thistle-black/[0.06] bg-white overflow-hidden">
          {notIncluded.map((item, i) => (
            <li key={i} className={`flex items-start gap-fl-4 px-fl-5 py-fl-4 ${i < notIncluded.length - 1 ? 'border-b border-thistle-black/[0.06]' : ''}`}>
              <div className="w-6 h-6 rounded-full bg-thistle-black/[0.05] flex items-center justify-center flex-shrink-0 mt-0.5">
                <X size={12} className="text-thistle-black/40" />
              </div>
              <span className="text-fluid-base text-thistle-black/80 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  </section>
);
