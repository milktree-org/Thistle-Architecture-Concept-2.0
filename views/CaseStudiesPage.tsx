"use client";

import React from 'react';
import Link from 'next/link';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/animations/Reveal';
import { Button } from '../components/ui/Button';
import { useFeasibility } from '../components/feasibility/FeasibilityContext';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, FileText, Database, PenTool, CheckCircle2, Building } from 'lucide-react';
import { caseStudies } from '../data/caseStudiesData';

export const CaseStudiesPage: React.FC = () => {
  const { openModal } = useFeasibility();
  const featured = caseStudies[0];
  const others = caseStudies.slice(1);

  const steps = [
    {
      num: "01",
      icon: FileText,
      label: "The Brief",
      body: featured.challenge,
    },
    {
      num: "02",
      icon: Database,
      label: "Automated Data Analysis",
      body: "Five years of local planning history, Article 4 directions, density saturation, and comparable schemes were pulled in automatically. The desk study flagged favourable Class MA precedent within 500m.",
    },
    {
      num: "03",
      icon: PenTool,
      label: "Architect-Led Review",
      body: featured.approach,
    },
    {
      num: "04",
      icon: CheckCircle2,
      label: "Feasibility Decision",
      body: `Recommendation: ${featured.recommendation}. With a viable layout, supportive precedent, and ${featured.gdvUpliftPct ?? "strong"} GDV uplift over purchase, the scheme met every threshold for the client's acquisition committee.`,
    },
    {
      num: "05",
      icon: Building,
      label: "The Outcome",
      body: featured.outcome,
    },
  ];

  return (
    <>
      <PageHero
        label="Case Studies"
        heading="How A Thistle Case Study Works."
        description="A worked example of how a feasibility moves from building to viable conversion, step by step. Below the walkthrough you'll find every other case we've published."
      />

      {/* Featured case header */}
      <section className="py-fl-section-sm px-fl-margin bg-thistle-white">
        <div className="max-w-[1360px] mx-auto">
          <Reveal>
            <div className="rounded-2xl overflow-hidden border border-thistle-black/[0.06] bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-[4/3] lg:aspect-auto overflow-hidden relative">
                  <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 text-[10px] uppercase tracking-widest text-white/80 font-medium">
                      Worked example
                    </span>
                  </div>
                </div>
                <div className="p-fl-7 flex flex-col justify-center">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-3">{featured.tag}</span>
                  <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-2">{featured.title}</h2>
                  <p className="text-fluid-sm text-thistle-black/50 uppercase tracking-wider mb-fl-5">{featured.location}</p>
                  <div className="grid grid-cols-3 gap-fl-4 pt-fl-4 border-t border-thistle-black/[0.06]">
                    {featured.stats.map((stat, j) => (
                      <div key={j}>
                        <span className="block text-fluid-h4 font-medium text-thistle-black tracking-tight leading-none">{stat.value}</span>
                        <span className="block text-[10px] uppercase tracking-widest text-thistle-black/40 mt-fl-1">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Step-by-step walkthrough */}
      <section className="py-fl-section px-fl-margin bg-white">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-fl-8">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">The Walkthrough</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
                Step By Step.
              </h2>
            </Reveal>
          </div>

          <div className="space-y-fl-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal key={i} delay={i * 0.06}>
                  <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-fl-5 items-start rounded-2xl border border-thistle-black/[0.06] bg-thistle-white p-fl-6">
                    <div className="flex md:flex-col items-center md:items-start gap-fl-3 md:w-32">
                      <div className="w-12 h-12 rounded-xl bg-thistle-green/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={20} className="text-thistle-green" />
                      </div>
                      <span className="text-xs font-bold tracking-widest text-thistle-black/30">{step.num}</span>
                    </div>
                    <div>
                      <h3 className="text-fluid-h5 font-medium tracking-tight text-thistle-black mb-fl-3">{step.label}</h3>
                      <p className="text-fluid-base text-thistle-black/80 leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.3}>
            <div className="flex justify-center mt-fl-8">
              <Link href={`/case-studies/${featured.slug}`}>
                <Button size="md" variant="primary" icon={<ArrowUpRight size={16} />}>
                  Read the full case study
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Other case studies */}
      {others.length > 0 && (
        <section className="py-fl-section px-fl-margin bg-thistle-white border-t border-thistle-black/[0.06]">
          <div className="max-w-[1360px] mx-auto">
            <div className="text-center mb-fl-8">
              <Reveal>
                <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">More Case Studies</p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
                  Every Other Project We&apos;ve Published.
                </h2>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-fl-5">
              {others.map((item, i) => (
                <Reveal key={item.slug} delay={i * 0.08}>
                  <Link href={`/case-studies/${item.slug}`} className="block h-full">
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.4 }}
                      className="group rounded-2xl overflow-hidden bg-white border border-thistle-black/[0.06] hover:border-thistle-black/[0.12] hover:shadow-xl hover:shadow-thistle-black/[0.04] transition-all duration-500 h-full flex flex-col"
                    >
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 text-[10px] uppercase tracking-widest text-white/80 font-medium">
                            {item.tag}
                          </span>
                        </div>
                      </div>
                      <div className="p-fl-5 flex flex-col flex-1">
                        <h3 className="text-fluid-h5 font-medium tracking-tight text-thistle-black mb-fl-1">{item.title}</h3>
                        <p className="text-[11px] text-thistle-black/40 uppercase tracking-wider mb-fl-4">{item.location}</p>
                        <p className="text-fluid-sm text-thistle-black/70 leading-relaxed mt-auto">{item.desc}</p>
                        <div className="flex items-center justify-between mt-fl-4 pt-fl-3 border-t border-thistle-black/[0.06]">
                          <span className="text-[11px] uppercase tracking-wider text-thistle-black/40 font-semibold">Read case study</span>
                          <ArrowRight size={14} className="text-thistle-black/40 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Band */}
      <section className="py-fl-section-sm px-fl-margin bg-thistle-black text-white">
        <div className="max-w-[1360px] mx-auto text-center">
          <Reveal>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight mb-fl-5">
              Have A Building In Mind?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-fluid-base text-white/80 leading-relaxed max-w-md mx-auto mb-fl-6">
              Submit your property details and find out if it&apos;s viable.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Button variant="glass" size="lg" icon={<ArrowUpRight size={18} />} onClick={openModal} className="!bg-thistle-green !text-black !border-thistle-green hover:!bg-thistle-green/80 hover:!border-thistle-green/80">
              Start Feasibility
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
};
