"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/animations/Reveal';
import { Button } from '../components/ui/Button';
import { useFeasibility } from '../components/feasibility/FeasibilityContext';
import { FAQ } from '../sections/FAQ';
import { StepRow } from '../sections/how-it-works/StepRow';
import { stepGraphicMap, LayerMiniGraphic } from '../sections/how-it-works/stepGraphics';
import { howItWorksSteps, deliverables, layerBlurbs } from '../data/howItWorksData';
import { feasibilityLayers } from '../data/feasibilityLayers';

export const HowItWorksPage: React.FC = () => {
  const { openModal } = useFeasibility();

  return (
    <>
      <PageHero
        label="How It Works"
        heading="From Building To Go/No-Go, Step By Step."
        description="A structured, data-driven process that gives developers the confidence to bid, exchange, or walk away. In five days."
        variant="dark"
      >
        <Button
          variant="glass"
          icon={<ArrowUpRight size={16} />}
          onClick={openModal}
          className="!bg-thistle-green !text-black !border-thistle-green hover:!bg-thistle-green/80 hover:!border-thistle-green/80"
        >
          Start Feasibility
        </Button>
      </PageHero>

      {/* The 5-step narrative timeline */}
      <section className="bg-thistle-white py-fl-section px-fl-margin">
        <div className="max-w-[1360px] mx-auto">
          <div className="text-center mb-fl-section-sm max-w-2xl mx-auto">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">The 5-Step Process</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
                Every Step From Upload<br /><span className="text-thistle-green">To Clear Recommendation.</span>
              </h2>
            </Reveal>
          </div>

          <div className="space-y-fl-section-sm">
            {howItWorksSteps.map((step, i) => {
              const Graphic = stepGraphicMap[step.graphic];
              return (
                <div key={step.num}>
                  <StepRow step={step} reversed={i % 2 !== 0} graphicSlot={<Graphic />} />
                  {step.graphic === 'step2' && (
                    <Reveal delay={0.1}>
                      <div className="mt-fl-7">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-thistle-green font-semibold">
                          Inside the analysis: six data layers
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fl-4 mt-fl-4">
                          {feasibilityLayers.map((layer, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-thistle-black/[0.06] p-fl-5">
                              <LayerMiniGraphic index={idx} />
                              <span className="block text-[10px] uppercase tracking-wider text-thistle-green font-semibold mt-fl-3">{layer.eyebrow}</span>
                              <h4 className="text-fluid-h6 font-medium tracking-tight text-thistle-black mt-1">{layer.title}</h4>
                              <p className="text-fluid-sm text-thistle-black/60 leading-relaxed mt-fl-2">{layerBlurbs[idx]}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Reveal>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What you receive */}
      <section className="py-fl-section px-fl-margin bg-thistle-black text-white">
        <div className="max-w-[1360px] mx-auto">
          <div className="mb-fl-8">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-white/30 font-semibold mb-fl-5">What You Receive</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight">
                Everything In One Report.
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-fl-4">
            {deliverables.map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="p-fl-5 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-500 h-full"
                >
                  <h3 className="text-fluid-h6 font-medium tracking-tight mb-fl-2">{item.title}</h3>
                  <p className="text-fluid-base text-white/80 leading-relaxed">{item.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA band — dark with a gradient treatment standing in for the
          AI image background slot until generated imagery lands. The gradient
          keeps it visually distinct from the flat-dark deliverables section. */}
      <section className="relative py-fl-section px-fl-margin bg-thistle-black text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-thistle-green/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-thistle-pink/10 rounded-full blur-[110px]" />
        </div>
        <div className="max-w-[1360px] mx-auto text-center relative z-10">
          <Reveal>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight mb-fl-5">
              Ready To Start?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-fluid-base text-white/80 leading-relaxed max-w-md mx-auto mb-fl-6">
              Submit your property details and get a clear Go or No-Go in five days.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Button
              variant="glass"
              size="lg"
              icon={<ArrowUpRight size={18} />}
              onClick={openModal}
              className="!bg-thistle-green !text-black !border-thistle-green hover:!bg-thistle-green/80 hover:!border-thistle-green/80"
            >
              Start Feasibility
            </Button>
          </Reveal>
        </div>
      </section>

      <FAQ />
    </>
  );
};
