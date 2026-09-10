"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from '../components/animations/Reveal';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { feasibilityStudies, type CaseStudy } from '../data/caseStudiesData';

const displayCases = feasibilityStudies.slice(0, 3);

// Mini before/after unit visualisation
const UnitComparison: React.FC<{ before: string; after: string; noGo?: boolean }> = ({ before, after, noGo }) => (
  <div className="flex items-center gap-3 text-thistle-black">
    <div className="text-right">
      <div className="text-[9px] uppercase tracking-wider text-thistle-black/40 font-semibold mb-0.5">Before</div>
      <div className="text-base font-semibold leading-none">{before}</div>
      <div className="text-[9px] text-thistle-black/40 mt-0.5">units</div>
    </div>
    <ArrowRight size={14} className="text-thistle-black/30" />
    <div>
      <div className="text-[9px] uppercase tracking-wider text-thistle-green font-semibold mb-0.5">After</div>
      <div className={`text-base font-semibold leading-none ${noGo ? 'text-thistle-black/40' : 'text-thistle-green'}`}>{after}</div>
      <div className="text-[9px] text-thistle-black/40 mt-0.5">units</div>
    </div>
  </div>
);

/**
 * `stage` says which list the card sits in. In the Projects list every card,
 * including a study that also appears there (Axis House), carries its stage;
 * in the studies list a study carries its Go / No-Go / Options Tested chip.
 */
export const CaseCard: React.FC<{ item: CaseStudy; stage?: boolean }> = ({ item, stage }) => {
  const isNoGo = item.recommendation === "No-Go";
  const isGo = item.recommendation === "Go";
  return (
    <Link href={`/case-studies/${item.slug}`} className="block h-full">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-thistle-black/[0.06] hover:border-thistle-black/[0.12] hover:shadow-xl hover:shadow-thistle-black/[0.04] transition-all duration-500 h-full flex flex-col"
      >
        {/* Image */}
        <div className="aspect-[16/9] overflow-hidden relative">
          {/* This was a motion.img, which served the source file untouched.
              CaseCard is the card used on the homepage, the completed projects
              listing and the feasibility listing, so every one of those pages
              was shipping a full-size PNG per card: three-column grids of
              multi-megabyte sketches. The wrapper keeps the hover zoom, which
              is why this is not simply an Image on its own. */}
          <motion.div
            className="w-full h-full"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

          {/* Tag badge + recommendation */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-xl border border-white/10 text-[10px] uppercase tracking-widest text-white/85 font-medium">
              {item.tag}
            </span>
            {/* Every project carries its stage, not only the ones on site
                (Ed, 9 September 2026). Blank means Complete. */}
            {(stage || item.kind === 'project') && (
              <span className="px-3 py-1.5 rounded-full backdrop-blur-xl border text-[10px] uppercase tracking-widest font-semibold bg-black/35 border-white/20 text-white/90">
                {item.status ?? 'Complete'}
              </span>
            )}
            {!stage && item.kind !== 'project' && item.recommendation && (
              <span className={`px-3 py-1.5 rounded-full backdrop-blur-xl border text-[10px] uppercase tracking-widest font-semibold ${
                isNoGo
                  ? 'bg-red-500/20 border-red-300/30 text-red-100'
                  : isGo
                    ? 'bg-thistle-green/30 border-thistle-green/40 text-white'
                    : 'bg-black/35 border-white/20 text-white/90'
              }`}>
                {item.recommendation}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-fl-5 flex flex-col flex-1">
          <h3 className="text-fluid-h5 font-medium tracking-tight mb-fl-1 text-thistle-black">{item.title}</h3>
          <p className="text-[11px] text-thistle-black/40 uppercase tracking-wider mb-fl-4">
            {item.location}
            {item.provenance && <span className="normal-case tracking-normal"> · {item.provenance}</span>}
          </p>

          {/* Key facts */}
          <div className="grid grid-cols-3 gap-3 py-fl-4 border-y border-thistle-black/[0.06] mb-fl-4">
            {item.stats.slice(0, 3).map((stat, i) => (
              // min-w-0 lets the column shrink below its content, and break-words
              // wraps values like "Conservation Area" that are wider than the
              // 77px column a three-up grid leaves at 320px. Without both, the
              // value ran under the neighbouring column.
              <div key={i} className="min-w-0">
                <div className="text-[9px] uppercase tracking-wider text-thistle-black/40 font-semibold mb-1 break-words">{stat.label}</div>
                <div className="text-fluid-sm font-semibold text-thistle-black break-words">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Units before/after, only where documented */}
          {item.unitsBefore && item.unitsAfter && (
            <div className="mb-fl-4">
              <UnitComparison before={item.unitsBefore} after={item.unitsAfter} noGo={isNoGo} />
            </div>
          )}

          <p className="text-fluid-base text-thistle-black/80 leading-relaxed mt-auto">
            {item.desc}
          </p>

          <div className="flex items-center justify-between mt-fl-4 pt-fl-3 border-t border-thistle-black/[0.06]">
            <span className="text-[11px] uppercase tracking-wider text-thistle-black/40 font-semibold">Read case study</span>
            <div className="w-8 h-8 rounded-full border border-thistle-black/[0.1] flex items-center justify-center group-hover:bg-thistle-black group-hover:border-thistle-black transition-colors">
              <ArrowUpRight size={14} className="text-thistle-black/60 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export const CaseStudies: React.FC = () => {
  return (
    <section className="py-fl-section px-fl-margin bg-thistle-white">
      <div className="max-w-[1360px] mx-auto">
        {/* Header — centered like other sections */}
        <div className="text-center mb-fl-8 max-w-2xl mx-auto">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">Case Studies</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-fluid-h2 font-medium tracking-tight text-thistle-black">
              Proof, <span className="text-thistle-green">Not Inspiration.</span>
            </h2>
          </Reveal>
        </div>

        {/* Case Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-fl-5">
          {displayCases.map((item, i) => (
            <Reveal key={item.slug} delay={i * 0.1}>
              <CaseCard item={item} />
            </Reveal>
          ))}
        </div>

        {/* View All CTA */}
        <Reveal delay={0.4}>
          <div className="flex justify-center mt-fl-7">
            <Link href="/case-studies">
              <Button
                size="md"
                variant="primary"
                icon={<ArrowUpRight size={16} />}
              >
                View All Case Studies
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
