"use client";

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Reveal } from '../../components/animations/Reveal';
import type { ConversionChallenge } from '../../data/conversionsData';

interface ChallengesProps {
  typeLabel: string;
  challenges: ConversionChallenge[];
}

// Type-specific challenges as a vertical list with a small warning indicator.
export const Challenges: React.FC<ChallengesProps> = ({ typeLabel, challenges }) => (
  <section className="bg-thistle-white py-fl-section px-fl-margin">
    <div className="max-w-[1000px] mx-auto">
      <div className="text-center mb-fl-8 max-w-2xl mx-auto">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">What Is Hard</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
            The Risks Unique To<br /><span className="text-thistle-green">{typeLabel}.</span>
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <ul className="rounded-2xl border border-thistle-black/[0.06] bg-white overflow-hidden">
          {challenges.map((c, i) => (
            <li key={i} className={`flex items-start gap-fl-4 px-fl-6 py-fl-5 ${i < challenges.length - 1 ? 'border-b border-thistle-black/[0.06]' : ''}`}>
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={16} className="text-amber-500" />
              </div>
              <div>
                <h3 className="text-fluid-h6 font-medium tracking-tight text-thistle-black mb-fl-2">{c.title}</h3>
                <p className="text-fluid-base text-thistle-black/70 leading-relaxed">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  </section>
);
