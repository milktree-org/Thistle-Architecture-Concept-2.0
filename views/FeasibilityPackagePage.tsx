"use client";

import React, { useState } from 'react';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/animations/Reveal';
import { Button } from '../components/ui/Button';
import { useFeasibility } from '../components/feasibility/FeasibilityContext';
import { ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ } from '../sections/FAQ';

const deliverables = [
  {
    num: "01",
    title: "Free 15-Minute Expert Session",
    desc: "A focused conversation with a senior architect before we begin — to understand your objectives, confirm assumptions, and scope the study correctly.",
  },
  {
    num: "02",
    title: "Full Feasibility Report",
    desc: "A comprehensive document covering planning constraints, structural considerations, unit mix options, financial viability, and risk — everything you need to make a confident acquisition decision.",
  },
  {
    num: "03",
    title: "Architectural Sketch Schemes",
    desc: "2 to 3 layout options drawn by a qualified architect, showing how the building can be configured. Each scheme is tested against space standards, planning constraints, and commercial viability.",
  },
  {
    num: "04",
    title: "1-Hour Architect Meeting",
    desc: "A structured walkthrough of the report with the architect who produced it — so you can ask questions, probe assumptions, and leave with complete clarity on the recommendation.",
  },
  {
    num: "05",
    title: "Financial Analysis",
    desc: "GDV projections, build cost benchmarks, margin analysis, and return on cost modelling — calibrated against comparable sales and local market data.",
  },
  {
    num: "06",
    title: "Fee Proposal & Project Roadmap",
    desc: "If the site is viable, you receive a fixed-fee proposal for the full architectural scope — with a clear programme showing exactly what happens next and when.",
  },
];

const dataChecks = [
  "Planning portal history & prior decisions",
  "Local plan constraints & allocations",
  "Class MA / Article 4 Direction exposure",
  "Environment Agency flood zones",
  "Conservation area & listed building checks",
  "HMO density & licensing thresholds",
  "Daylight & sunlight (BRE methodology)",
  "Noise mapping & environmental constraints",
  "Structural & services suitability",
  "NDSS space standard compliance",
  "GDV & build cost modelling",
  "Risk register with cost implications",
];

const process = [
  {
    num: "01",
    title: "Submit property details",
    desc: "Upload floor plans, address, and your target unit mix. Takes around 10 minutes.",
  },
  {
    num: "02",
    title: "Automated desk study",
    desc: "We cross-reference 15+ data sources — planning policy, flood risk, Article 4, daylight, and more.",
  },
  {
    num: "03",
    title: "Architect review",
    desc: "A senior architect reviews the data, produces sketch layouts, and validates commercial assumptions.",
  },
  {
    num: "04",
    title: "Feasibility delivered",
    desc: "Your full report, sketch schemes, financial analysis, and architect meeting — all delivered together.",
  },
];

const conversionTypes = {
  commercial: {
    label: "Commercial Conversions",
    intro: "Turn commercial buildings into viable residential schemes.",
    considerations: [
      { title: "Class MA", desc: "Converting commercial to residential under permitted development — assessing prior approval requirements and conditions." },
      { title: "Class O", desc: "Office-to-residential conversions with specific criteria around natural light, amenity space, and transport links." },
      { title: "Full Planning", desc: "Where permitted development doesn't apply — building a case from first principles through the planning system." },
      { title: "Change of Use", desc: "Navigating use class changes, mixed-use schemes, and the interaction between commercial and residential policy." },
    ],
    analysis: [
      "Class MA & Article 4 exposure",
      "Planning history & precedent",
      "Structural suitability",
      "Unit mix optimisation",
      "Financial viability",
      "Infrastructure & services",
    ],
  },
  hmo: {
    label: "HMOs",
    intro: "HMO feasibility that handles the complexity.",
    considerations: [
      { title: "HMO Licensing", desc: "Mandatory and additional licensing thresholds, room size requirements, and local authority conditions." },
      { title: "Article 4 & Density", desc: "Identifying Article 4 directions and saturation levels that could block or complicate HMO consent." },
      { title: "Room Standards", desc: "NDSS compliance, minimum room sizes, amenity ratios, and accessibility requirements for each unit type." },
      { title: "Planning Consent", desc: "Determining whether prior approval, full planning, or lawful development certificates are the best route." },
    ],
    analysis: [
      "Licensing assessment",
      "Density & saturation mapping",
      "Room schedule",
      "Planning route analysis",
      "Financial modelling",
      "Risk register",
    ],
  },
  residential: {
    label: "High-End Residential",
    intro: "Feasibility built for premium residential projects.",
    considerations: [
      { title: "Spatial Quality", desc: "Premium developments require exceptional space planning — optimising layouts for light, aspect, and liveability." },
      { title: "Planning Strategy", desc: "Heritage constraints, conservation areas, and design-sensitive sites need a carefully constructed planning narrative." },
      { title: "Market Calibration", desc: "Unit mix decisions driven by local demand data, comparable sales analysis, and target buyer profiles." },
      { title: "Daylight & Sunlight", desc: "BRE methodology assessments ensuring compliance and protecting the quality of the living environment." },
    ],
    analysis: [
      "Conservation & heritage",
      "Planning policy context",
      "Daylight & sunlight (BRE)",
      "Unit mix & market positioning",
      "GDV & financial analysis",
      "Architectural sketch schemes",
    ],
  },
};

type ConversionType = keyof typeof conversionTypes;

export const FeasibilityPackagePage: React.FC = () => {
  const { openModal } = useFeasibility();
  const [activeType, setActiveType] = useState<ConversionType>('commercial');
  const activeData = conversionTypes[activeType];

  return (
    <>
      <PageHero
        label="Feasibility Package"
        heading="Complete Clarity Before You Commit."
        description="A structured feasibility study combining automated data analysis with architect-led design review — delivered with a clear Go/No-Go recommendation."
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

      {/* What's Included */}
      <section className="py-fl-section px-fl-margin bg-thistle-white">
        <div className="max-w-[1360px] mx-auto">
          <div className="mb-fl-8">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-thistle-black/40 font-semibold mb-fl-5">What's Included</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
                Six Deliverables. One Fixed Fee.
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-fl-4">
            {deliverables.map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-thistle-black/[0.08] rounded-xl p-fl-6 h-full flex flex-col group hover:border-thistle-black/[0.15] hover:shadow-lg hover:shadow-thistle-black/[0.04] transition-all duration-500"
                >
                  <div className="flex items-center justify-between mb-fl-5">
                    <span className="text-xs font-bold tracking-widest text-thistle-green">{item.num}</span>
                  </div>
                  <h3 className="text-fluid-h6 font-medium tracking-tight text-thistle-black mb-fl-3">{item.title}</h3>
                  <p className="text-sm text-thistle-black/55 leading-relaxed flex-1">{item.desc}</p>
                  <div className="w-8 h-[2px] bg-thistle-black/10 mt-fl-5 group-hover:bg-thistle-green/50 group-hover:w-12 transition-all duration-500" />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What We Cover — Tabbed sections for Commercial / HMO / Residential */}
      <section className="py-fl-section px-fl-margin bg-thistle-black text-white">
        <div className="max-w-[1360px] mx-auto">
          <div className="mb-fl-8">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-white/30 font-semibold mb-fl-5">What We Cover</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight mb-fl-6">
                Feasibility Across Every Sector.
              </h2>
            </Reveal>

            {/* Tab Switcher */}
            <Reveal delay={0.2}>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(conversionTypes) as ConversionType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-tight transition-all duration-300 ${
                      activeType === type
                        ? 'bg-thistle-green text-thistle-black'
                        : 'bg-white/[0.06] text-white/50 hover:bg-white/[0.10] hover:text-white/80 border border-white/[0.08]'
                    }`}
                  >
                    {conversionTypes[type].label}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeType}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {/* Intro */}
              <p className="text-fluid-lg text-white/80 leading-relaxed mb-fl-7 max-w-2xl">
                {activeData.intro}
              </p>

              {/* Considerations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-fl-4 mb-fl-8">
                {activeData.considerations.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/[0.05] border border-white/[0.10] rounded-xl p-fl-6 hover:border-thistle-green/30 transition-colors duration-500"
                  >
                    <h3 className="text-fluid-h6 font-medium tracking-tight mb-fl-3">{item.title}</h3>
                    <p className="text-sm text-white/55 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Analysis Items */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-fl-3">
                {activeData.analysis.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-thistle-green flex-shrink-0" />
                    <span className="text-sm text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Process */}
      <section className="py-fl-section px-fl-margin bg-thistle-white">
        <div className="max-w-[1360px] mx-auto">
          <div className="mb-fl-8">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-thistle-black/40 font-semibold mb-fl-5">The Process</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
                Four Steps. Complete Clarity.
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-fl-4">
            {process.map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-thistle-black/[0.08] rounded-xl p-fl-6 h-full flex flex-col group hover:border-thistle-black/[0.15] hover:shadow-lg hover:shadow-thistle-black/[0.04] transition-all duration-500"
                >
                  <div className="flex items-center justify-between mb-fl-5">
                    <span className="text-xs font-bold tracking-widest text-thistle-pink">{step.num}</span>
                  </div>
                  <h3 className="text-fluid-h6 font-medium tracking-tight text-thistle-black mb-fl-3">{step.title}</h3>
                  <p className="text-sm text-thistle-black/55 leading-relaxed flex-1">{step.desc}</p>
                  <div className="w-8 h-[2px] bg-thistle-black/10 mt-fl-5 group-hover:bg-thistle-pink/40 group-hover:w-12 transition-all duration-500" />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Data Checks */}
      <section className="py-fl-section px-fl-margin bg-thistle-white">
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-fl-8 items-start">
            <div>
              <Reveal>
                <p className="text-xs uppercase tracking-[0.2em] text-thistle-black/40 font-semibold mb-fl-5">What We Check</p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-5">
                  15+ Data Sources. Every Time.
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-fluid-base text-thistle-black/80 leading-relaxed">
                  Every feasibility is built on a structured desk study that cross-references planning policy, environmental data, and market intelligence. This is the foundation that makes our Go/No-Go recommendations reliable.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dataChecks.map((check, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-thistle-green/15 flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#8F9952" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-sm text-thistle-black/80">{check}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-fl-section-sm px-fl-margin bg-thistle-black text-white">
        <div className="max-w-[1360px] mx-auto text-center">
          <Reveal>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight mb-fl-5">
              Get Your Feasibility Report.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-fluid-base text-white/80 leading-relaxed max-w-md mx-auto mb-fl-6">
              Start with a free 15-minute expert session. Submit your property details and we'll get back to you within 24 hours.
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
