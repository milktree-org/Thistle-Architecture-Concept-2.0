"use client";

import React, { useState } from 'react';
import { Reveal } from '../components/animations/Reveal';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FaqItem {
  question: string;
  answer: string;
}

const genericFaqs: FaqItem[] = [
  {
    question: "How much does a feasibility cost?",
    answer: "Fixed-fee pricing based on building size and complexity, no hourly rates, no scope creep. You know exactly what you're paying before we start. Most feasibilities range from a few hundred to a few thousand pounds, depending on scheme complexity.",
  },
  {
    question: "How fast do I get results?",
    answer: "Initial insight within one working day of submission. Full feasibility report, including layouts, risk register, and Go/No-Go recommendation, delivered within 5 working days. That's 83% faster than the traditional 2 to 6 week process.",
  },
  {
    question: "How accurate is the data analysis?",
    answer: "Our system cross-references 15+ authoritative data sources including planning portals, Land Registry, Environment Agency, and local authority records. Every automated analysis is then validated by a qualified designer.",
  },
  {
    question: "What if planning is refused?",
    answer: "Our feasibility identifies planning risk before you apply. We analyse prior approval history, policy alignment, and local constraints to flag issues early. If a scheme isn't viable, you'll know before you commit. That's the point of the Go/No-Go recommendation.",
  },
  {
    question: "What happens after I receive the feasibility?",
    answer: "You get a clear Go or No-Go. If it's a Go, the report includes everything you need to progress: GA plans, accommodation schedules, and a fee proposal for the full project. If it's a No-Go, you've saved weeks and potentially thousands on a non-viable scheme.",
  },
  {
    question: "Can I use the report to raise finance?",
    answer: "Yes. Reports include GDV projections, unit mixes, efficiency ratios, and risk assessments, exactly what banks, investors, and JV partners need to see. They're structured to support funding applications from day one.",
  },
  {
    question: "Do I need plans before ordering?",
    answer: "No. Just the address, basic building details, and your target unit mix. If you have floor plans, great. They speed things up. If not, we can work with what's available and source what we need.",
  },
];

interface FAQProps {
  tinted?: boolean;
  /** Sector-specific questions, per Ed's August 2026 final brief: "Replace
   *  repeated generic feasibility FAQs with sector-specific planning/design
   *  questions." Falls back to the generic list when a page hasn't set its
   *  own yet, so this never renders empty. */
  faqs?: FaqItem[];
}

export const FAQ: React.FC<FAQProps> = ({ tinted = false, faqs }) => {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState(0);
  const items = faqs && faqs.length > 0 ? faqs : genericFaqs;

  return (
    <section className={`py-fl-section px-fl-margin ${tinted ? 'bg-thistle-white' : 'bg-white'}`}>
      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-fl-8">
          {/* Left: Header */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-thistle-black/40 font-semibold mb-fl-5">FAQs</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-5">
                Answering Your Questions.
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-fluid-base text-thistle-black/80 leading-relaxed mb-fl-6 max-w-sm">
                Got more questions? Send us your enquiry and we'll get back to you within one working day.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Button variant="primary" icon={<ArrowUpRight size={16} />} onClick={() => router.push('/pricing#calculator')}>
                Get Your Fixed Fee
              </Button>
            </Reveal>
          </div>

          {/* Right: Accordion */}
          <div className="flex flex-col gap-fl-3">
            {items.map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div
                  className={`rounded-xl border transition-colors duration-300 ${
                    openIndex === i
                      ? 'border-thistle-black/[0.1] bg-white'
                      : 'border-thistle-black/[0.06] bg-transparent hover:border-thistle-black/[0.1]'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                    className="w-full flex items-center justify-between gap-fl-4 px-fl-5 py-fl-4 text-left group"
                  >
                    <span className={`text-fluid-sm font-medium tracking-tight transition-colors duration-300 ${
                      openIndex === i ? 'text-thistle-black' : 'text-thistle-black/70 group-hover:text-thistle-black'
                    }`}>
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === i ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                        openIndex === i
                          ? 'bg-thistle-black text-white'
                          : 'bg-thistle-black/[0.05] text-thistle-black/40'
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-fluid-base text-thistle-black/80 leading-relaxed px-fl-5 pb-fl-4">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
