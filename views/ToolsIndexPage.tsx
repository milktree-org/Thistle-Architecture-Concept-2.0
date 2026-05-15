"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ListChecks, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/animations/Reveal';
import { Button } from '../components/ui/Button';
import { useFeasibility } from '../components/feasibility/FeasibilityContext';
import { tools } from '../data/toolsData';

const ICONS = {
  ListChecks,
  Calculator,
} as const;

export const ToolsIndexPage: React.FC = () => {
  const { openModal } = useFeasibility();

  return (
    <>
      <PageHero
        label="Free Tools"
        heading="Test A Building Before You Bid."
        description="Quick checks for the decisions developers make first. Free, no email required, every result links into a real feasibility."
      >
        <Button variant="primary" icon={<ArrowUpRight size={16} />} onClick={openModal}>
          Start Feasibility
        </Button>
      </PageHero>

      <section className="bg-thistle-white py-fl-section px-fl-margin">
        <div className="max-w-[1000px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-fl-5">
            {tools.map((tool, i) => {
              const Icon = ICONS[tool.iconName];
              return (
                <Reveal key={tool.slug} delay={i * 0.1}>
                  <Link href={tool.path} className="block group h-full">
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="bg-white rounded-2xl border border-thistle-black/[0.06] hover:border-thistle-green/30 hover:shadow-lg hover:shadow-thistle-green/5 p-fl-7 transition-all duration-300 h-full flex flex-col"
                    >
                      <div className="w-12 h-12 rounded-xl bg-thistle-green/10 flex items-center justify-center mb-fl-5">
                        <Icon size={22} className="text-thistle-green" />
                      </div>
                      <h3 className="text-fluid-h4 font-medium tracking-tight text-thistle-black mb-fl-3">{tool.label}</h3>
                      <p className="text-fluid-base text-thistle-black/80 leading-relaxed mb-fl-5 flex-1">{tool.summary}</p>
                      <span className="inline-flex items-center gap-2 text-fluid-sm text-thistle-black font-medium">
                        Try it <ArrowUpRight size={16} />
                      </span>
                    </motion.div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-fl-section px-fl-margin bg-white">
        <div className="max-w-[1360px] mx-auto text-center">
          <Reveal>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-5">
              Useful, But Not The Answer.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-fluid-base text-thistle-black/80 leading-relaxed max-w-md mx-auto mb-fl-6">
              The tools narrow the field. A feasibility tells you, with evidence, whether to bid.
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
