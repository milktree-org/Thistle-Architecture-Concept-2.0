"use client";

import React from 'react';
import { Reveal } from '../../components/animations/Reveal';
import type { Deliverable } from '../../data/howItWorksData';
import type { DeliverableDetail } from '../../data/feasibilityPackageData';

interface DeliverableRowProps {
  num: string;
  deliverable: Deliverable;
  detail: DeliverableDetail;
  reversed: boolean;
  graphicSlot: React.ReactNode;
  delay?: number;
}

// One alternating expanded deliverable row. Mirrors the homepage Feasibility
// Engine and How It Works StepRow patterns: content on one side, sample
// visual on the other, sides swapping at the lg breakpoint when reversed.
export const DeliverableRow: React.FC<DeliverableRowProps> = ({ num, deliverable, detail, reversed, graphicSlot, delay = 0 }) => (
  <Reveal delay={delay}>
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-fl-8 items-center ${reversed ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <div className={reversed ? 'lg:pl-fl-5' : ''}>
        <span className="text-[11px] uppercase tracking-[0.2em] text-thistle-green font-semibold">
          Deliverable {num}
        </span>
        <h3 className="text-fluid-h3 font-medium tracking-tight leading-tight text-thistle-black mt-fl-3 mb-fl-4">
          {deliverable.title}
        </h3>
        <p className="text-fluid-base text-thistle-black/80 leading-relaxed max-w-md mb-fl-4">
          {deliverable.desc}
        </p>
        <p className="text-fluid-sm text-thistle-black/55 leading-relaxed max-w-md">
          {detail.why}
        </p>
      </div>
      <div className={`w-full ${reversed ? '' : 'lg:order-2'}`}>
        {graphicSlot}
      </div>
    </div>
  </Reveal>
);
