"use client";

import React from 'react';
import { Reveal } from '../../components/animations/Reveal';
import { timelineDays } from '../../data/feasibilityPackageData';

// Horizontal five-day timeline. On mobile each day stacks vertically; at md+
// they sit in a five-column row with a faint connector line behind the dots.
export const TimelineBand: React.FC = () => (
  <section className="bg-white py-fl-section px-fl-margin">
    <div className="max-w-[1360px] mx-auto">
      <div className="text-center mb-fl-8 max-w-2xl mx-auto">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">The Five Days</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
            Submit Monday.<br /><span className="text-thistle-green">Decide Friday.</span>
          </h2>
        </Reveal>
      </div>

      <div className="relative">
        <div className="hidden md:block absolute top-5 left-[10%] right-[10%] h-px bg-thistle-black/[0.1]" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-fl-5 relative">
          {timelineDays.map((day, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="flex flex-col items-center text-center px-fl-3">
                <div className="w-10 h-10 rounded-full bg-thistle-green text-white flex items-center justify-center text-sm font-semibold mb-fl-4 relative z-10">
                  {i + 1}
                </div>
                <span className="block text-[10px] uppercase tracking-widest text-thistle-green font-semibold mb-fl-2">{day.day}</span>
                <h4 className="text-fluid-h6 font-medium tracking-tight text-thistle-black mb-fl-2">{day.label}</h4>
                <p className="text-fluid-sm text-thistle-black/60 leading-relaxed">{day.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);
