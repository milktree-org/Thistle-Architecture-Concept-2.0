"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../../components/animations/Reveal';
import { caseStudies } from '../../data/caseStudiesData';

interface RelatedCaseStudyProps {
  slug?: string;
}

// A single case-study feature card looked up by slug. Returns null when the
// slug is missing or does not match any case so the page degrades cleanly.
export const RelatedCaseStudy: React.FC<RelatedCaseStudyProps> = ({ slug }) => {
  if (!slug) return null;
  const item = caseStudies.find((c) => c.slug === slug);
  if (!item) return null;

  return (
    <section className="bg-thistle-white py-fl-section px-fl-margin">
      <div className="max-w-[1360px] mx-auto">
        <div className="text-center mb-fl-8 max-w-2xl mx-auto">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">A Real Project</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
              We Have Done This Before.
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <Link href={`/case-studies/${item.slug}`} className="block">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden bg-white border border-thistle-black/[0.06] hover:border-thistle-black/[0.12] hover:shadow-xl hover:shadow-thistle-black/[0.04] transition-all duration-500"
            >
              <div className="aspect-[4/3] lg:aspect-auto overflow-hidden relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 text-[10px] uppercase tracking-widest text-white/80 font-medium">
                    {item.tag}
                  </span>
                </div>
              </div>
              <div className="p-fl-7 flex flex-col justify-center">
                <h3 className="text-fluid-h3 font-medium tracking-tight text-thistle-black mb-fl-2">{item.title}</h3>
                <p className="text-fluid-sm text-thistle-black/50 uppercase tracking-wider mb-fl-5">{item.location}</p>
                <p className="text-fluid-base text-thistle-black/80 leading-relaxed mb-fl-5">{item.desc}</p>
                <span className="inline-flex items-center gap-2 text-fluid-sm text-thistle-black font-medium">
                  Read the full case study <ArrowUpRight size={16} />
                </span>
              </div>
            </motion.div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};
