"use client";

import React from 'react';
import { Upload, CheckCircle2, Phone, Video, History, ScrollText, Crosshair, LayoutGrid, PoundSterling, Ruler } from 'lucide-react';
import type { StepGraphicKey } from '../../data/howItWorksData';

// ─── Step 01: upload portal mock ──────────
export const Step1Graphic: React.FC = () => (
  <div className="aspect-square w-full bg-white rounded-2xl border border-thistle-black/[0.06] shadow-sm shadow-thistle-black/[0.03] p-fl-6 flex flex-col justify-center">
    <div className="flex items-center justify-between mb-fl-4">
      <span className="text-[10px] uppercase tracking-wider text-thistle-black/40 font-semibold">New property</span>
      <span className="text-[10px] text-thistle-green font-medium">Step 1 of 5</span>
    </div>
    <div className="space-y-fl-3">
      <div>
        <span className="block text-[10px] text-thistle-black/40 mb-1">Address</span>
        <div className="h-9 rounded-lg border border-thistle-black/[0.08] bg-thistle-white/50 flex items-center px-3">
          <span className="text-xs text-thistle-black/70">42 High Street, Croydon</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-fl-3">
        <div>
          <span className="block text-[10px] text-thistle-black/40 mb-1">Floors</span>
          <div className="h-9 rounded-lg border border-thistle-black/[0.08] bg-thistle-white/50 flex items-center px-3"><span className="text-xs text-thistle-black/70">3</span></div>
        </div>
        <div>
          <span className="block text-[10px] text-thistle-black/40 mb-1">Current use</span>
          <div className="h-9 rounded-lg border border-thistle-black/[0.08] bg-thistle-white/50 flex items-center px-3"><span className="text-xs text-thistle-black/70">Office</span></div>
        </div>
      </div>
    </div>
    <div className="mt-fl-4 rounded-lg border border-dashed border-thistle-green/40 bg-thistle-green/[0.05] py-fl-4 flex flex-col items-center gap-1">
      <Upload size={18} className="text-thistle-green" />
      <span className="text-[10px] text-thistle-black/50">Drop floor plans, or we source them</span>
    </div>
  </div>
);

// ─── Step 02: data engine desk study mock ──────────
const step2Sources = [
  "Planning portal history",
  "Local & national policy",
  "Constraints & flood risk",
  "Comparable schemes",
  "Density & licensing",
];

export const Step2Graphic: React.FC = () => (
  <div className="aspect-square w-full bg-white rounded-2xl border border-thistle-black/[0.06] shadow-sm shadow-thistle-black/[0.03] p-fl-6 flex flex-col justify-center">
    <div className="flex items-center justify-between mb-fl-4">
      <span className="text-[10px] uppercase tracking-wider text-thistle-black/40 font-semibold">Desk study</span>
      <span className="text-[10px] text-thistle-green font-medium">Running</span>
    </div>
    <div className="space-y-fl-1">
      {step2Sources.map((src, i) => (
        <div key={i} className="flex items-center gap-2.5 py-1.5">
          <CheckCircle2 size={14} className="text-thistle-green flex-shrink-0" />
          <span className="text-xs text-thistle-black/70">{src}</span>
        </div>
      ))}
    </div>
    <div className="mt-fl-4 pt-fl-3 border-t border-thistle-black/[0.06]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] text-thistle-black/40">Sources cross-referenced</span>
        <span className="text-xs font-semibold text-thistle-green">15+</span>
      </div>
      <div className="h-1.5 bg-thistle-black/[0.05] rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-thistle-green" style={{ width: "88%" }} />
      </div>
    </div>
  </div>
);

// ─── Step 04: sketch scheme floor plan ──────────
const step4Top = [
  { x: 14, w: 92, type: "1B" },
  { x: 110, w: 92, type: "2B" },
  { x: 206, w: 100, type: "1B" },
];
const step4Bottom = [
  { x: 14, w: 100, type: "2B" },
  { x: 118, w: 92, type: "1B" },
  { x: 214, w: 92, type: "2B" },
];

export const Step4Graphic: React.FC = () => (
  <div className="aspect-square w-full bg-white rounded-2xl border border-thistle-black/[0.06] shadow-sm shadow-thistle-black/[0.03] p-fl-6 flex flex-col">
    <div className="flex items-center justify-between mb-fl-4">
      <span className="text-[10px] uppercase tracking-wider text-thistle-black/40 font-semibold">Sketch scheme</span>
      <span className="text-[10px] text-thistle-black/50">6 units · Level 2</span>
    </div>
    <div className="flex-1 bg-thistle-white/50 rounded-xl p-fl-4 flex items-center">
      <svg viewBox="0 0 320 200" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <rect x="8" y="8" width="304" height="184" fill="white" stroke="#2F3B36" strokeWidth="1.5" rx="3" />
        <rect x="14" y="92" width="292" height="16" fill="#F5F4EF" stroke="#2F3B36" strokeOpacity="0.25" strokeWidth="0.4" />
        <text x="160" y="103" textAnchor="middle" fontSize="7" fill="#71776E" fontFamily="sans-serif" letterSpacing="0.5">CORRIDOR</text>
        {step4Top.map((u, i) => (
          <g key={`t${i}`}>
            <rect x={u.x} y="14" width={u.w} height="74" fill="#8F9952" fillOpacity="0.18" stroke="#8F9952" strokeWidth="0.8" />
            <text x={u.x + u.w / 2} y="54" textAnchor="middle" fontSize="10" fill="#2F3B36" fontFamily="sans-serif">{u.type}</text>
          </g>
        ))}
        {step4Bottom.map((u, i) => (
          <g key={`b${i}`}>
            <rect x={u.x} y="112" width={u.w} height="74" fill="#8F9952" fillOpacity="0.18" stroke="#8F9952" strokeWidth="0.8" />
            <text x={u.x + u.w / 2} y="152" textAnchor="middle" fontSize="10" fill="#2F3B36" fontFamily="sans-serif">{u.type}</text>
          </g>
        ))}
      </svg>
    </div>
    <div className="mt-fl-3 grid grid-cols-3 gap-2 text-[10px]">
      <div><span className="block text-thistle-black/40 uppercase tracking-wider font-semibold text-[9px]">1-bed</span><span className="text-sm font-semibold text-thistle-black">3</span></div>
      <div><span className="block text-thistle-black/40 uppercase tracking-wider font-semibold text-[9px]">2-bed</span><span className="text-sm font-semibold text-thistle-black">3</span></div>
      <div><span className="block text-thistle-black/40 uppercase tracking-wider font-semibold text-[9px]">Efficiency</span><span className="text-sm font-semibold text-thistle-green">84%</span></div>
    </div>
  </div>
);

// ─── AI-image placeholder treatment (Steps 03 and 05) ──────────
// Brand-tinted gradient panel with the step icon. Replaced by generated
// imagery in a later follow-up pass once the API key and image style are set.
const ImagePlaceholder: React.FC<{ icon: React.ReactNode; caption: string }> = ({ icon, caption }) => (
  <div className="aspect-square w-full rounded-2xl border border-thistle-black/[0.06] bg-gradient-to-br from-thistle-green/15 via-thistle-white to-thistle-pink/15 flex flex-col items-center justify-center gap-fl-3">
    <div className="w-14 h-14 rounded-2xl bg-white/70 backdrop-blur flex items-center justify-center text-thistle-green">
      {icon}
    </div>
    <span className="text-[10px] uppercase tracking-[0.2em] text-thistle-black/40 font-semibold">{caption}</span>
  </div>
);

export const JodiCallPlaceholder: React.FC = () => (
  <ImagePlaceholder icon={<Phone size={24} />} caption="Project data gathering" />
);

export const FinalMeetingPlaceholder: React.FC = () => (
  <ImagePlaceholder icon={<Video size={24} />} caption="Feasibility review" />
);

// ─── Compact mini-graphic for the six nested layer cards ──────────
const layerIcons = [History, ScrollText, Crosshair, LayoutGrid, PoundSterling, Ruler];

export const LayerMiniGraphic: React.FC<{ index: number }> = ({ index }) => {
  const Icon = layerIcons[index] ?? History;
  return (
    <div className="h-16 rounded-xl bg-thistle-green/[0.08] flex items-center justify-center">
      <Icon size={22} className="text-thistle-green" />
    </div>
  );
};

// ─── Key-to-component map used by the page ──────────
export const stepGraphicMap: Record<StepGraphicKey, React.FC> = {
  step1: Step1Graphic,
  step2: Step2Graphic,
  "jodi-call": JodiCallPlaceholder,
  step4: Step4Graphic,
  "final-meeting": FinalMeetingPlaceholder,
};
