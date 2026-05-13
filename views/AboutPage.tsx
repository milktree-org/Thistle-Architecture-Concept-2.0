"use client";

import React from 'react';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/animations/Reveal';
import { Button } from '../components/ui/Button';
import { useFeasibility } from '../components/feasibility/FeasibilityContext';
import { ArrowUpRight, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

const team = [
  {
    name: "Sarah Jenkins",
    role: "Head of Architecture",
    credential: "BArch · Ex-Foster + Partners",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800&h=1000",
  },
  {
    name: "David Ross",
    role: "Planning Director",
    credential: "15 Years Commercial",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800&h=1000",
  },
  {
    name: "Elena Kova",
    role: "Feasibility Lead",
    credential: "Specialist in Class MA",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800&h=1000",
  },
  {
    name: "James Thorne",
    role: "Technical Lead",
    credential: "Building Regs Expert",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800&h=1000",
  },
];

export const AboutPage: React.FC = () => {
  const { openModal } = useFeasibility();

  return (
    <>
      <PageHero
        label="About"
        heading="Meet The Architects Behind Your Scheme."
        description="A small team of architects who work for developers. We do the feasibility, sketch schemes, and policy work that turn an existing building into a viable conversion."
      />

      {/* Team — the hero of the page */}
      <section className="py-fl-section px-fl-margin bg-thistle-white">
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-fl-5">
            {team.map((member, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="group rounded-2xl overflow-hidden bg-white border border-thistle-black/[0.06] hover:border-thistle-black/[0.12] hover:shadow-xl hover:shadow-thistle-black/[0.04] transition-all duration-500"
                >
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <motion.img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                        <Linkedin size={15} className="text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-fl-5">
                    <h3 className="text-fluid-h5 font-medium tracking-tight text-thistle-black">{member.name}</h3>
                    <p className="text-fluid-sm text-thistle-black/55 mt-fl-1">{member.role}</p>
                    <p className="text-[11px] uppercase tracking-wider text-thistle-green font-semibold mt-fl-3">{member.credential}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Short approach statement */}
      <section className="py-fl-section px-fl-margin bg-white">
        <div className="max-w-[800px] mx-auto text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">How We Work</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-5">
              Architects, Working For Developers.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-fluid-base text-thistle-black/80 leading-relaxed">
              Most architects design first and worry about commercial viability later. We do it the other way round. Every scheme starts with the numbers, the planning policy, and the building, so the developers we work with know whether a deal stacks up before they commit. The same person who runs your feasibility is the architect you keep working with through to planning.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-fl-section-sm px-fl-margin bg-thistle-black text-white">
        <div className="max-w-[1360px] mx-auto text-center">
          <Reveal>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight mb-fl-5">
              Work With Us.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-fluid-base text-white/80 leading-relaxed max-w-md mx-auto mb-fl-6">
              Submit your building and we&apos;ll tell you what&apos;s possible, for a fixed fee.
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
