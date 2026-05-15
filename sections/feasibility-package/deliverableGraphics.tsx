"use client";

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { DeliverableGraphicKey } from '../../data/feasibilityPackageData';

// ─── Wrapper card for consistent sizing ──────────
const Card: React.FC<{ label: string; meta?: string; children: React.ReactNode }> = ({ label, meta, children }) => (
  <div className="aspect-square w-full bg-white rounded-2xl border border-thistle-black/[0.06] shadow-sm shadow-thistle-black/[0.03] p-fl-6 flex flex-col">
    <div className="flex items-center justify-between mb-fl-4">
      <span className="text-[10px] uppercase tracking-wider text-thistle-black/40 font-semibold">{label}</span>
      {meta && <span className="text-[10px] text-thistle-green font-medium">{meta}</span>}
    </div>
    <div className="flex-1 flex flex-col justify-center">{children}</div>
  </div>
);

// ─── GA Floor Plans: mini floor plan with 4 unit rectangles ──────────
const gaUnits = [
  { x: 14, w: 88, type: "1B" },
  { x: 106, w: 88, type: "2B" },
  { x: 198, w: 88, type: "1B" },
];

export const GAPlansGraphic: React.FC = () => (
  <Card label="GA floor plan" meta="Level 1">
    <svg viewBox="0 0 300 180" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <rect x="8" y="8" width="284" height="164" fill="white" stroke="#2F3B36" strokeWidth="1.5" rx="3" />
      <rect x="14" y="82" width="272" height="16" fill="#F5F4EF" stroke="#2F3B36" strokeOpacity="0.25" strokeWidth="0.4" />
      <text x="150" y="93" textAnchor="middle" fontSize="7" fill="#71776E" fontFamily="sans-serif" letterSpacing="0.5">CORRIDOR</text>
      {gaUnits.map((u, i) => (
        <g key={`t${i}`}>
          <rect x={u.x} y="14" width={u.w} height="66" fill="#8F9952" fillOpacity="0.18" stroke="#8F9952" strokeWidth="0.8" />
          <text x={u.x + u.w / 2} y="50" textAnchor="middle" fontSize="10" fill="#2F3B36" fontFamily="sans-serif">{u.type}</text>
        </g>
      ))}
      {gaUnits.map((u, i) => (
        <g key={`b${i}`}>
          <rect x={u.x} y="102" width={u.w} height="66" fill="#8F9952" fillOpacity="0.18" stroke="#8F9952" strokeWidth="0.8" />
          <text x={u.x + u.w / 2} y="138" textAnchor="middle" fontSize="10" fill="#2F3B36" fontFamily="sans-serif">{u.type}</text>
        </g>
      ))}
    </svg>
  </Card>
);

// ─── Schedule of Accommodation: small table ──────────
const scheduleRows = [
  { unit: "1.01", type: "1B", gia: "48 sqm" },
  { unit: "1.02", type: "2B", gia: "70 sqm" },
  { unit: "1.03", type: "1B", gia: "50 sqm" },
  { unit: "1.04", type: "2B", gia: "72 sqm" },
];

export const ScheduleGraphic: React.FC = () => (
  <Card label="Accommodation schedule" meta="NDSS compliant">
    <div className="rounded-lg overflow-hidden border border-thistle-black/[0.06]">
      <div className="grid grid-cols-3 px-3 py-2 bg-thistle-white/60 border-b border-thistle-black/[0.06]">
        <span className="text-[9px] uppercase tracking-wider text-thistle-black/40 font-semibold">Unit</span>
        <span className="text-[9px] uppercase tracking-wider text-thistle-black/40 font-semibold">Type</span>
        <span className="text-[9px] uppercase tracking-wider text-thistle-black/40 font-semibold text-right">GIA</span>
      </div>
      {scheduleRows.map((row, i) => (
        <div key={i} className={`grid grid-cols-3 px-3 py-2 text-xs ${i < scheduleRows.length - 1 ? 'border-b border-thistle-black/[0.04]' : ''}`}>
          <span className="text-thistle-black/70 font-mono">{row.unit}</span>
          <span className="text-thistle-black/70">{row.type}</span>
          <span className="text-thistle-black/70 text-right">{row.gia}</span>
        </div>
      ))}
    </div>
  </Card>
);

// ─── Constraints Analysis: mini constraints map ──────────
export const ConstraintsGraphic: React.FC = () => (
  <Card label="Constraints map" meta="3 flagged">
    <svg viewBox="0 0 300 180" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <path d="M 20 40 L 80 20 L 180 28 L 260 50 L 280 110 L 240 160 L 140 168 L 50 152 L 20 100 Z" fill="#F5F4EF" stroke="#2F3B36" strokeWidth="1" strokeOpacity="0.3" />
      <path d="M 60 60 L 130 50 L 150 100 L 100 130 L 60 110 Z" fill="#DAAEBB" fillOpacity="0.35" stroke="#DAAEBB" strokeWidth="1.2" strokeDasharray="4 3" />
      <path d="M 170 70 L 240 80 L 250 140 L 190 150 L 170 110 Z" fill="#8F9952" fillOpacity="0.25" stroke="#8F9952" strokeWidth="1.2" strokeDasharray="4 3" />
      <circle cx="140" cy="100" r="7" fill="#2F3B36" />
      <circle cx="140" cy="100" r="2.5" fill="white" />
      <text x="80" y="90" fontSize="9" fill="#2F3B36" fontFamily="sans-serif" opacity="0.65">Article 4</text>
      <text x="195" y="115" fontSize="9" fill="#2F3B36" fontFamily="sans-serif" opacity="0.65">Conservation</text>
    </svg>
  </Card>
);

// ─── Risk Register: list of 3 rows with severity indicators ──────────
const riskRows = [
  { name: "Daylight to lower units", severity: "med", cost: "£8k" },
  { name: "Class MA prior approval", severity: "low", cost: "£0" },
  { name: "Structural intervention floor 1", severity: "high", cost: "£42k" },
];
const severityColour = (s: string) => s === 'high' ? 'bg-red-400' : s === 'med' ? 'bg-amber-400' : 'bg-thistle-green';

export const RiskRegisterGraphic: React.FC = () => (
  <Card label="Risk register" meta="3 of 11">
    <div className="space-y-fl-3">
      {riskRows.map((row, i) => (
        <div key={i} className="flex items-center justify-between gap-fl-3 py-fl-2 border-b border-thistle-black/[0.06] last:border-b-0">
          <span className={`w-2 h-2 rounded-full ${severityColour(row.severity)} flex-shrink-0`} />
          <span className="flex-1 text-xs text-thistle-black/70 leading-snug">{row.name}</span>
          <span className="text-xs font-semibold text-thistle-black tabular-nums">{row.cost}</span>
        </div>
      ))}
    </div>
  </Card>
);

// ─── Go/No-Go Recommendation: a green "GO" stamp ──────────
export const GoNoGoGraphic: React.FC = () => (
  <Card label="Recommendation">
    <div className="flex-1 flex items-center justify-center">
      <div className="relative">
        <div className="w-36 h-36 rounded-full border-[6px] border-thistle-green flex flex-col items-center justify-center bg-thistle-green/[0.05] rotate-[-8deg]">
          <span className="text-3xl font-bold tracking-tight text-thistle-green leading-none">GO</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-thistle-green font-semibold mt-1">Approved</span>
        </div>
        <div className="absolute -bottom-2 right-2 flex items-center gap-1.5 bg-white rounded-full px-2 py-1 border border-thistle-black/[0.06] shadow-sm">
          <CheckCircle2 size={12} className="text-thistle-green" />
          <span className="text-[9px] uppercase tracking-wider text-thistle-black/60 font-semibold">Architect signed</span>
        </div>
      </div>
    </div>
  </Card>
);

// ─── Efficiency Metrics: net-to-gross + a small bar ──────────
export const EfficiencyGraphic: React.FC = () => (
  <Card label="Efficiency" meta="+24% margin">
    <div className="space-y-fl-4">
      <div>
        <div className="flex items-end justify-between mb-fl-2">
          <span className="text-[10px] uppercase tracking-wider text-thistle-black/40 font-semibold">Net-to-gross</span>
          <span className="text-fluid-h4 font-medium tracking-tight text-thistle-black leading-none">84%</span>
        </div>
        <div className="h-2 bg-thistle-black/[0.05] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-thistle-green" style={{ width: '84%' }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-fl-3 pt-fl-3 border-t border-thistle-black/[0.06]">
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-thistle-black/40 font-semibold">Projected GDV</span>
          <span className="text-sm font-semibold text-thistle-black">£3.2M</span>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-thistle-black/40 font-semibold">Margin</span>
          <span className="text-sm font-semibold text-thistle-green">+24%</span>
        </div>
      </div>
    </div>
  </Card>
);

// ─── Key-to-component map used by the page ──────────
export const deliverableGraphicMap: Record<DeliverableGraphicKey, React.FC> = {
  'ga-plans': GAPlansGraphic,
  schedule: ScheduleGraphic,
  constraints: ConstraintsGraphic,
  'risk-register': RiskRegisterGraphic,
  'go-nogo': GoNoGoGraphic,
  efficiency: EfficiencyGraphic,
};
