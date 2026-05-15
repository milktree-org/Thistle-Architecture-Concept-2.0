"use client";

import React from 'react';
import { Reveal } from '../../components/animations/Reveal';

interface PricingAnchorProps {
  priceFrom: string;
  caption: string;
}

// "From £X" anchor band. Structured so a future tier table can replace the
// simple anchor by swapping this component out, with no change to the page.
export const PricingAnchor: React.FC<PricingAnchorProps> = ({ priceFrom, caption }) => (
  <section className="bg-thistle-white py-fl-section-sm px-fl-margin border-y border-thistle-black/[0.06]">
    <div className="max-w-[1360px] mx-auto text-center">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-3">From</p>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-fluid-display font-medium tracking-tighter text-thistle-black leading-none mb-fl-4">
          {priceFrom}
        </p>
      </Reveal>
      <Reveal delay={0.15}>
        <p className="text-fluid-base text-thistle-black/70 max-w-md mx-auto leading-relaxed">
          {caption}
        </p>
      </Reveal>
    </div>
  </section>
);
