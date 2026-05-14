"use client";

import React from 'react';
import { Reveal } from '../../components/animations/Reveal';
import type { HowItWorksStep } from '../../data/howItWorksData';

interface StepRowProps {
  step: HowItWorksStep;
  reversed: boolean;
  graphicSlot: React.ReactNode;
  delay?: number;
}

// One alternating full-width narrative row. Matches the homepage Feasibility
// Engine's row structure: content on one side, graphic on the other, sides
// swapping on every other row at the lg breakpoint.
export const StepRow: React.FC<StepRowProps> = ({ step, reversed, graphicSlot, delay = 0 }) => (
  <Reveal delay={delay}>
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-fl-8 items-center ${reversed ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <div className={reversed ? 'lg:pl-fl-5' : ''}>
        <span className="text-[11px] uppercase tracking-[0.2em] text-thistle-green font-semibold">
          Step {step.num} · {step.durationLabel}
        </span>
        <h3 className="text-fluid-h3 font-medium tracking-tight leading-tight text-thistle-black mt-fl-3 mb-fl-4">
          {step.title}
        </h3>
        <p className="text-fluid-base text-thistle-black/80 leading-relaxed max-w-md mb-fl-4">
          {step.lead}
        </p>
        <p className="text-fluid-sm text-thistle-black/50 leading-relaxed max-w-md">
          {step.detail}
        </p>
      </div>
      <div className={`w-full ${reversed ? '' : 'lg:order-2'}`}>
        {graphicSlot}
      </div>
    </div>
  </Reveal>
);
