"use client";

import React from 'react';
import Image from 'next/image';
import { Reveal } from '../components/animations/Reveal';
import { InlineCTA } from '../components/ui/InlineCTA';

// Data partner logos — 10 from hmochecker shared partner set, 5 sourced separately.
const sources = [
  { name: "Ordnance Survey", src: "/logos/data/ordnance-survey.png" },
  { name: "HM Land Registry", src: "/logos/data/hm-land-registry.png" },
  { name: "Environment Agency", src: "/logos/data/environment-agency.png" },
  { name: "Rightmove", src: "/logos/data/rightmove.png" },
  { name: "Historic England", src: "/logos/data/historic-england.png" },
  { name: "Royal Mail", src: "/logos/data/royal-mail.png" },
  { name: "Companies House", src: "/logos/data/companies-house.png" },
  { name: "National Grid", src: "/logos/data/national-grid.png" },
  { name: "Ministry of Housing, Communities & Local Government", src: "/logos/data/mhclg.png" },
  { name: "London Datastore", src: "/logos/data/london-datastore.png" },
  { name: "Planning Portal", src: "/logos/data/planning-portal.png" },
  { name: "Office for National Statistics", src: "/logos/data/ons.svg" },
  { name: "Natural England", src: "/logos/data/natural-england.png" },
  { name: "EPC Register", src: "/logos/data/epc-register.svg" },
  { name: "Local Government Association", src: "/logos/data/local-authorities.png" },
];

export const DataSources: React.FC = () => {
  return (
    <section className="bg-thistle-white py-fl-section px-fl-margin">
      <div className="max-w-[1360px] mx-auto">
        <div className="text-center mb-fl-8 max-w-2xl mx-auto">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-3">Data provenance</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black mb-fl-4">
              Powered By 15+ Authoritative Data Sources.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-fluid-sm text-thistle-black/55 leading-relaxed">
              Every analysis cross-references the UK&apos;s most trusted planning, property and environmental databases. More data means fewer surprises at every stage.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-fl-3">
            {sources.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-center h-24 rounded-xl bg-white border border-thistle-black/[0.06] hover:border-thistle-green/25 transition-colors p-fl-4"
              >
                <Image
                  src={s.src}
                  alt={s.name}
                  width={200}
                  height={70}
                  unoptimized
                  className="max-h-full w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-fl-7">
            <InlineCTA label="Start your feasibility" />
          </div>
        </Reveal>
      </div>
    </section>
  );
};
