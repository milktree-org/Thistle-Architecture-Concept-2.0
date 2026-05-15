"use client";

import React from 'react';
import { Reveal } from '../../components/animations/Reveal';
import { sampleReportPages } from '../../data/feasibilityPackageData';

// A horizontal three-page gallery suggesting the real report artefact.
// Each "page" is a styled card with a faint content-line mock inside.
export const SampleReport: React.FC = () => (
  <section className="bg-thistle-white py-fl-section px-fl-margin">
    <div className="max-w-[1360px] mx-auto">
      <div className="text-center mb-fl-8 max-w-2xl mx-auto">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-thistle-green font-semibold mb-fl-4">What The Report Looks Like</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-fluid-h2 font-medium tracking-tight leading-tight text-thistle-black">
            A Real Document.<br /><span className="text-thistle-green">Not A Brochure.</span>
          </h2>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-fl-5">
        {sampleReportPages.map((page, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="aspect-[3/4] bg-white rounded-2xl border border-thistle-black/[0.06] p-fl-5 flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-thistle-green font-semibold">{page.label}</span>
              <h3 className="text-fluid-h6 font-medium tracking-tight text-thistle-black mt-fl-2 mb-fl-5">{page.title}</h3>
              <div className="flex-1 bg-thistle-white/50 rounded-lg p-fl-4 flex flex-col">
                <div className="h-2 w-1/3 bg-thistle-black/20 rounded mb-fl-3" />
                <div className="space-y-2 mb-fl-4">
                  <div className="h-1.5 bg-thistle-black/[0.12] rounded" />
                  <div className="h-1.5 bg-thistle-black/[0.12] rounded w-5/6" />
                  <div className="h-1.5 bg-thistle-black/[0.12] rounded w-4/6" />
                </div>
                <div className="h-2 w-1/4 bg-thistle-black/20 rounded mb-fl-3" />
                <div className="space-y-2">
                  <div className="h-1.5 bg-thistle-black/[0.12] rounded w-5/6" />
                  <div className="h-1.5 bg-thistle-black/[0.12] rounded w-3/6" />
                </div>
                <div className="mt-auto flex items-center justify-between pt-fl-3 border-t border-thistle-black/[0.08]">
                  <span className="text-[9px] uppercase tracking-wider text-thistle-black/30 font-semibold">Thistle Architecture</span>
                  <span className="text-[9px] text-thistle-black/30">{page.label.replace('Page ', 'p.')}</span>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
