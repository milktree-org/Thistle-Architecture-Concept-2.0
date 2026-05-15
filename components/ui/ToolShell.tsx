"use client";

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PageHero } from './PageHero';
import { Reveal } from '../animations/Reveal';
import { Button } from './Button';
import { useFeasibility } from '../feasibility/FeasibilityContext';
import type { Tool } from '../../data/toolsData';

interface ToolShellProps {
  tool: Tool;
  heroHeading: string;
  heroDescription: string;
  disclaimer: string;
  children: React.ReactNode;
}

// Shared page shell for any tool. Wraps the PageHero, the tool body, a small
// disclaimer line, and a closing "Start Feasibility" CTA so every tool page
// has the same conversion frame.
export const ToolShell: React.FC<ToolShellProps> = ({ tool, heroHeading, heroDescription, disclaimer, children }) => {
  const { openModal } = useFeasibility();
  return (
    <>
      <PageHero
        label={tool.label}
        heading={heroHeading}
        description={heroDescription}
      />

      {children}

      <section className="bg-thistle-white px-fl-margin py-fl-7">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-fluid-sm text-thistle-black/55 leading-relaxed text-center">
            {disclaimer}
          </p>
        </div>
      </section>

      <section className="py-fl-section px-fl-margin bg-white">
        <div className="max-w-[1360px] mx-auto text-center">
          <Reveal>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-5">
              The Tool Is A Hint.<br /><span className="text-thistle-green">The Feasibility Is The Answer.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-fluid-base text-thistle-black/80 leading-relaxed max-w-md mx-auto mb-fl-6">
              Get a real, architect-led feasibility on the building in five days. Fixed fee, clear Go or No-Go.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Button variant="primary" size="lg" icon={<ArrowUpRight size={18} />} onClick={openModal}>
              Start Feasibility
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
};
