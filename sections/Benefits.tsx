"use client";

import React from 'react';
import { Reveal } from '../components/animations/Reveal';
import { Clock, PoundSterling, Compass, type LucideIcon } from 'lucide-react';
import { InlineCTA } from '../components/ui/InlineCTA';

interface Pillar {
  icon: LucideIcon;
  title: string;
  body: string;
}

const pillars: Pillar[] = [
  {
    icon: Clock,
    title: "Time",
    body: "A guaranteed feasibility in 5 days, not 5 weeks. We compress the slow upfront stage so you can move on a deal while it's still on the table.",
  },
  {
    icon: PoundSterling,
    title: "Fair Entry Cost",
    body: "A fixed, accessible fee for the full feasibility. No retainers, no scope creep, and no commitment to a long architectural appointment before you know the scheme stacks up.",
  },
  {
    icon: Compass,
    title: "Clarity",
    body: "Every report ends with a clear Go or No-Go, backed by data, layouts, and an architect's review. You leave with a decision, not a maybe.",
  },
];

const PillarCard: React.FC<{ pillar: Pillar }> = ({ pillar }) => {
  const Icon = pillar.icon;
  return (
    <div className="group h-72 [perspective:1200px]">
      <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl bg-white border border-thistle-black/[0.06] p-fl-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-thistle-green/10 flex items-center justify-center mb-fl-5">
            <Icon size={28} className="text-thistle-green" />
          </div>
          <h3 className="text-fluid-h3 font-medium tracking-tight text-thistle-black mb-fl-3">{pillar.title}</h3>
          <span className="text-[10px] uppercase tracking-[0.2em] text-thistle-black/40 font-semibold">Hover to learn more</span>
        </div>
        {/* Back */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-thistle-green text-white p-fl-6 flex flex-col justify-center">
          <h3 className="text-fluid-h5 font-medium tracking-tight mb-fl-4">{pillar.title}</h3>
          <p className="text-fluid-base leading-relaxed text-white/90">{pillar.body}</p>
        </div>
      </div>
    </div>
  );
};

export const Benefits: React.FC = () => {
  return (
    <section className="bg-thistle-white py-fl-section px-fl-margin">
      <div className="max-w-[1360px] mx-auto">
        {/* Header */}
        <div className="text-center mb-fl-8 max-w-2xl mx-auto">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">The Three Pillars</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-4">
              The Three Pillars Of<br /><span className="text-thistle-green">Developer Success.</span>
            </h2>
          </Reveal>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-fl-4 mb-fl-7">
          {pillars.map((p, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <PillarCard pillar={p} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4}>
          <InlineCTA label="Book your feasibility today" />
        </Reveal>
      </div>
    </section>
  );
};
