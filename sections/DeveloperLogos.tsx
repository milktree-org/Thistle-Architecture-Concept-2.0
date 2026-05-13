"use client";

import React from 'react';
import Image from 'next/image';
import { Reveal } from '../components/animations/Reveal';

// Developer / client logos — sourced from hmochecker.co.uk, shared partner set.
const developers = [
  { name: "Property & Poppadoms", src: "/logos/developers/poppadoms.jpeg", dark: true },
  { name: "HMO Academy", src: "/logos/developers/academy.png", dark: false },
  { name: "Brentor Group", src: "/logos/developers/brentor-group.jpeg", dark: true },
  { name: "Frame 4", src: "/logos/developers/frame-4.png", dark: true },
  { name: "DNB Homes", src: "/logos/developers/dnb-homes.webp", dark: false },
];

export const DeveloperLogos: React.FC = () => {
  return (
    <section className="bg-thistle-white py-fl-7 px-fl-margin border-b border-thistle-black/[0.06]">
      <div className="max-w-[1360px] mx-auto">
        <Reveal>
          <p className="text-center text-[11px] uppercase tracking-[0.25em] text-thistle-black/50 font-semibold mb-fl-5">
            Trusted by developers across the UK
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-fl-4 items-center">
            {developers.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-center h-20 rounded-xl overflow-hidden bg-white border border-thistle-black/[0.06] p-4"
              >
                <Image
                  src={d.src}
                  alt={d.name}
                  width={180}
                  height={60}
                  unoptimized
                  className="max-h-full w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
