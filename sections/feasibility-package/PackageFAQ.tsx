"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../../components/animations/Reveal';
import { Button } from '../../components/ui/Button';
import { useFeasibility } from '../../components/feasibility/FeasibilityContext';
import { packageFaqs } from '../../data/feasibilityPackageData';

// Package-specific accordion FAQ. Same UX as the general site FAQ, different
// content focused on the package itself (fee, revisions, VAT, scope changes).
export const PackageFAQ: React.FC = () => {
  const { openModal } = useFeasibility();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-fl-section px-fl-margin bg-thistle-white">
      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-fl-8">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-thistle-black/40 font-semibold mb-fl-5">Package FAQs</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-5">
                The Practical Questions.
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-fluid-base text-thistle-black/80 leading-relaxed mb-fl-6 max-w-sm">
                Fee, scope, VAT, what happens on a No-Go. The things that matter once you are ready to instruct.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Button variant="primary" icon={<ArrowUpRight size={16} />} onClick={openModal}>
                Start Feasibility
              </Button>
            </Reveal>
          </div>

          <div className="flex flex-col gap-fl-3">
            {packageFaqs.map((faq, i) => (
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
