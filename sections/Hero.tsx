"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { ArrowUpRight, Building2, FileText, PenTool, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Reveal } from '../components/animations/Reveal';
import { useFeasibility } from '../components/feasibility/FeasibilityContext';

const metrics = [
  { value: "98.5%", label: "Planning success rate", detail: "Across all submitted schemes" },
  { value: "5 days", label: "Guaranteed turn around", detail: "From submission to clear recommendation" },
  { value: "86%", label: "Faster than traditional routes", detail: "5 days vs 2–6 week industry average" },
];

// 5-day timeline shown in the right-side card
const timeline = [
  { day: "Day 1", label: "Submit Details", icon: Send },
  { day: "Day 2", label: "Feasibility Assessment Report", icon: FileText },
  { day: "Day 4", label: "Sketch Scheme", icon: PenTool },
  { day: "Day 5", label: "Feasibility Assessment Meeting", icon: CheckCircle2, isFinal: true },
];

export const Hero: React.FC = () => {
  const { openModal } = useFeasibility();
  return (
    <section className="relative min-h-screen bg-thistle-white text-thistle-black overflow-hidden flex flex-col lg:pt-20">
      <div className="max-w-[1360px] mx-auto px-fl-margin flex flex-col lg:flex-row flex-1 w-full">

      {/* Left Column: Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center pt-fl-section pb-fl-7 lg:pt-0 relative z-10">
        <div className="max-w-xl">
          <Reveal>
            <div className="inline-flex flex-col gap-1 px-fl-4 py-fl-3 rounded-2xl bg-thistle-green/10 border border-thistle-green/30 w-fit mb-fl-6">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-thistle-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-thistle-green"></span>
                </span>
                <span className="text-sm font-semibold text-thistle-green tracking-tight">5-day turnaround</span>
              </div>
              <span className="text-[11px] text-thistle-green/80 leading-tight pl-[18px]">86% quicker than industry standard</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-fluid-h1 font-medium tracking-tighter leading-[1.05] mb-fl-5">
              From Building To Viable Conversion<br /><span className="text-thistle-green">In 5 Days.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-fluid-base text-thistle-black leading-relaxed font-light mb-fl-4 max-w-md">
              Thistle specialises in unlocking value from existing buildings, combining data analysis with developer-led architecture to test schemes quickly and accurately.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="text-fluid-base text-thistle-black leading-relaxed font-light mb-fl-7 max-w-md">
              Our feasibility system analyses planning, density, constraints, and layout potential, giving a clear Go/No-Go in days, not weeks.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-fl-4">
              <Button size="lg" variant="primary" icon={<ArrowUpRight size={18} />} onClick={openModal} className="!bg-thistle-pink !text-thistle-black !border-thistle-pink hover:!bg-thistle-pink/80 hover:!border-thistle-pink/80">
                Start Feasibility
              </Button>
              <Link href="/how-it-works" className="text-sm text-thistle-black/70 hover:text-thistle-black transition-colors font-medium tracking-tight">
                How it works &rarr;
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Right Column: System Visual */}
      <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-auto flex items-center justify-center py-fl-7 lg:py-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative w-full max-w-md"
        >
          {/* Feasibility system preview card */}
          <div className="bg-white rounded-2xl border border-thistle-black/[0.06] shadow-lg shadow-thistle-black/5 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-thistle-black/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-thistle-green" />
                <span className="text-xs font-semibold tracking-wide text-thistle-black/60 uppercase">Feasibility Report</span>
              </div>
              <div className="flex flex-col items-end leading-none">
                <span className="text-[9px] uppercase tracking-wider text-thistle-green font-semibold mb-0.5">Guaranteed</span>
                <span className="text-sm font-bold text-thistle-black">5 days</span>
              </div>
            </div>

            {/* Property info row */}
            <div className="px-6 py-4 border-b border-thistle-black/[0.04] flex items-center gap-fl-4">
              {/* Block of flats icon */}
              <div className="w-11 h-11 flex-shrink-0 rounded-xl bg-thistle-green/10 flex items-center justify-center">
                <Building2 size={20} className="text-thistle-green" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-thistle-black truncate">42 High Street, Croydon</span>
                <div className="flex gap-3 mt-1">
                  <span className="text-[10px] uppercase tracking-wider text-thistle-black/40 font-semibold">Class MA</span>
                  <span className="text-[10px] uppercase tracking-wider text-thistle-black/40 font-semibold">12 units</span>
                </div>
              </div>
            </div>

            {/* Architect intro */}
            <div className="px-6 py-4 border-b border-thistle-black/[0.04] flex items-center gap-fl-4">
              <Image
                src="/kaan.png"
                alt="Kaan, Design Lead"
                width={120}
                height={120}
                unoptimized
                priority
                className="w-16 h-16 rounded-full object-cover ring-2 ring-thistle-green/20 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-thistle-black leading-tight">Kaan</span>
                <span className="block text-[10px] uppercase tracking-wider text-thistle-green font-semibold mt-0.5">Your design lead</span>
                <span className="block text-[11px] text-thistle-black/60 leading-snug mt-1">Bachelor of Architecture (BArch). Leads every feasibility from sketch scheme to sign-off.</span>
              </div>
            </div>

            {/* 5-day timeline */}
            <div className="px-6 py-4 space-y-3">
              {timeline.map((item, i) => {
                const Icon = item.icon;
                const isFinal = !!item.isFinal;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
                    className={`flex items-center gap-3 py-2 ${isFinal ? '-mx-2 px-2 rounded-lg bg-thistle-green/10' : ''}`}
                  >
                    <div className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center ${
                      isFinal ? 'bg-thistle-green text-white' : 'bg-thistle-black/[0.03] text-thistle-black/50'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[10px] uppercase tracking-wider font-semibold text-thistle-green leading-none mb-0.5">{item.day}</span>
                      <span className={`block text-sm leading-tight ${isFinal ? 'text-thistle-black font-medium' : 'text-thistle-black/70'}`}>{item.label}</span>
                    </div>
                    {isFinal && (
                      <CheckCircle2 size={18} className="text-thistle-green flex-shrink-0" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

        </motion.div>
      </div>

      </div>

      {/* Metrics Strip — dark contrast (Approach A: inline) */}
      <div className="bg-thistle-black text-white">
        <div className="max-w-[1360px] mx-auto px-fl-margin py-fl-6">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {metrics.map((metric, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className={`flex flex-col items-center text-center px-fl-5 py-fl-3 ${
                  i > 0 ? 'md:border-l md:border-white/[0.1]' : ''
                }`}>
                  <span className="text-fluid-h3 font-semibold tracking-tight text-white block mb-1">
                    {metric.value}
                  </span>
                  <span className="text-sm font-medium text-white block mb-0.5">
                    {metric.label}
                  </span>
                  <span className="text-xs text-white/70">
                    {metric.detail}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
