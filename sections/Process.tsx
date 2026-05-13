"use client";

import React from 'react';
import { Reveal } from '../components/animations/Reveal';
import { motion } from 'framer-motion';
import { Upload, Cpu, Phone, PenTool, Video } from 'lucide-react';
import { InlineCTA } from '../components/ui/InlineCTA';

const steps = [
  {
    num: "01",
    title: "Upload Property Details",
    desc: "Share your property's address with a few basic details: size, floor count, and current use. Takes under two minutes.",
    icon: Upload,
  },
  {
    num: "02",
    title: "Automated Analysis",
    desc: "Our system checks planning history, site constraints, density data, and comparable schemes in your local area.",
    icon: Cpu,
  },
  {
    num: "03",
    title: "Project Data Gathering Session",
    desc: "An instant call with Jodi, our property expert, to gather the details we need and walk through your goals for the site.",
    icon: Phone,
  },
  {
    num: "04",
    title: "Sketch Scheme Stage",
    desc: "One of our architects will carry out the sketch scheme analysis to determine the best possible layout based on your brief, local comparables, local and national constraints, and the best commercial outcome.",
    icon: PenTool,
  },
  {
    num: "05",
    title: "Final Meeting",
    desc: "You'll be sent a video call link after uploading your information. We'll review the completed feasibility together after 5 days.",
    icon: Video,
  }
];

export const Process: React.FC = () => {
  return (
    <section className="bg-thistle-white py-fl-section px-fl-margin overflow-hidden">
      <div className="max-w-[1360px] mx-auto">
        {/* Header */}
        <div className="text-center mb-fl-8">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">Our 5 Step Process</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
              From Upload to Full Project Clarity.<br />
              <span className="text-thistle-green">In 5 Days.</span>
            </h2>
          </Reveal>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-fl-4 mb-fl-7">
          {steps.map((step, i) => {
            const isFinal = i === steps.length - 1;
            return (
              <Reveal key={i} delay={i * 0.1} className={isFinal ? 'md:col-span-2' : ''}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className={`relative rounded-xl p-fl-6 h-full flex flex-col group transition-all duration-300 ${
                    isFinal
                      ? 'bg-thistle-green/10 border border-thistle-green/30 hover:border-thistle-green/50 hover:shadow-lg hover:shadow-thistle-green/10'
                      : 'bg-white border border-thistle-black/[0.06] hover:border-thistle-green/30 hover:shadow-lg hover:shadow-thistle-green/5'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-fl-5">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      isFinal
                        ? 'bg-thistle-green text-white'
                        : 'bg-thistle-green/10 text-thistle-green group-hover:bg-thistle-green/20'
                    }`}>
                      <step.icon size={20} />
                    </div>
                    <span className={`text-xs font-bold tracking-widest ${isFinal ? 'text-thistle-green' : 'text-thistle-black/30'}`}>{step.num}</span>
                  </div>

                  <h3 className="text-fluid-h5 font-medium mb-fl-3 tracking-tight text-thistle-black">{step.title}</h3>
                  <p className="text-fluid-base text-thistle-black/80 leading-relaxed">{step.desc}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.5}>
          <InlineCTA label="Start your feasibility" />
        </Reveal>
      </div>
    </section>
  );
};
