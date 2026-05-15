"use client";

import React, { useState, useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../../components/animations/Reveal';
import { Button } from '../../components/ui/Button';
import { useFeasibility } from '../../components/feasibility/FeasibilityContext';

export type ViabilityBand = 'marginal' | 'viable' | 'strong';

export interface ViabilityInputs {
  purchasePrice: number;
  floorAreaSqm: number;
  unitCount: number;
  avgSalePerUnit: number;
  buildCostPerSqm: number;
}

export interface ViabilityResult {
  gdv: number;
  totalCost: number;
  marginPounds: number;
  marginPct: number;
  band: ViabilityBand;
}

// Pure helper: turns inputs into a result. Band thresholds: under 10% margin
// is marginal, 10 to 25% is viable, over 25% is strong.
export function computeViability(inputs: ViabilityInputs): ViabilityResult {
  const gdv = inputs.unitCount * inputs.avgSalePerUnit;
  const totalCost = inputs.purchasePrice + inputs.buildCostPerSqm * inputs.floorAreaSqm;
  const marginPounds = gdv - totalCost;
  const marginPct = totalCost > 0 ? (marginPounds / totalCost) * 100 : 0;
  const band: ViabilityBand = marginPct < 10 ? 'marginal' : marginPct < 25 ? 'viable' : 'strong';
  return { gdv, totalCost, marginPounds, marginPct, band };
}

const DEFAULTS: ViabilityInputs = {
  purchasePrice: 1_400_000,
  floorAreaSqm: 1_100,
  unitCount: 12,
  avgSalePerUnit: 290_000,
  buildCostPerSqm: 1_800,
};

const BAND_COPY: Record<ViabilityBand, { label: string; body: string; bg: string; text: string }> = {
  marginal: {
    label: 'Marginal',
    body: 'Margin under 10%. The deal is fragile, since small cost overruns or sale-price misses could wipe it. A feasibility runs comparables and a real risk register so you know what you are actually buying.',
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-600',
  },
  viable: {
    label: 'Viable',
    body: 'Margin between 10 and 25%. The deal looks workable on paper. A feasibility confirms the GDV against local comparables and pressure-tests the build cost.',
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-600',
  },
  strong: {
    label: 'Strong',
    body: 'Margin over 25%. The numbers look strong, which usually means either you have a real edge, or one of your inputs is optimistic. A feasibility tells you which.',
    bg: 'bg-thistle-green/[0.08] border-thistle-green/30',
    text: 'text-thistle-green',
  },
};

const formatGBP = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `£${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `£${(n / 1_000).toFixed(0)}k`;
  return `£${Math.round(n).toLocaleString('en-GB')}`;
};

interface NumberInputProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  step: number;
  onChange: (n: number) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, value, prefix, suffix, step, onChange }) => (
  <label className="block">
    <span className="block text-[10px] uppercase tracking-widest text-thistle-black/40 font-semibold mb-fl-2">{label}</span>
    <div className="flex items-center rounded-xl border border-thistle-black/[0.08] bg-white overflow-hidden focus-within:border-thistle-green/50 transition-colors">
      {prefix && <span className="pl-fl-4 text-thistle-black/40 text-sm">{prefix}</span>}
      <input
        type="number"
        value={value}
        step={step}
        min={0}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          onChange(Number.isFinite(n) ? n : 0);
        }}
        className="flex-1 py-fl-4 px-fl-4 bg-transparent text-fluid-base text-thistle-black focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {suffix && <span className="pr-fl-4 text-thistle-black/40 text-sm">{suffix}</span>}
    </div>
  </label>
);

const OutputRow: React.FC<{ label: string; value: string; accent?: boolean }> = ({ label, value, accent }) => (
  <div className="flex items-baseline justify-between gap-fl-4 pb-fl-3 border-b border-thistle-black/[0.05] last:border-b-0 last:pb-0">
    <span className="text-fluid-sm text-thistle-black/60">{label}</span>
    <span className={`text-fluid-h5 font-medium tracking-tight tabular-nums ${accent ? 'text-thistle-green' : 'text-thistle-black'}`}>
      {value}
    </span>
  </div>
);

export const GDVCalculator: React.FC = () => {
  const { openModal } = useFeasibility();
  const [inputs, setInputs] = useState<ViabilityInputs>(DEFAULTS);
  const result = useMemo(() => computeViability(inputs), [inputs]);
  const bandCopy = BAND_COPY[result.band];

  const update = (key: keyof ViabilityInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="bg-thistle-white py-fl-section px-fl-margin">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-fl-7">
          <Reveal>
            <div className="bg-white rounded-2xl border border-thistle-black/[0.06] p-fl-7">
              <h3 className="text-fluid-h5 font-medium tracking-tight text-thistle-black mb-fl-5">Your numbers</h3>
              <div className="flex flex-col gap-fl-5">
                <NumberInput label="Purchase price" value={inputs.purchasePrice} prefix="£" step={10000} onChange={(n) => update('purchasePrice', n)} />
                <NumberInput label="Floor area" value={inputs.floorAreaSqm} suffix="sqm" step={50} onChange={(n) => update('floorAreaSqm', n)} />
                <NumberInput label="Number of units" value={inputs.unitCount} step={1} onChange={(n) => update('unitCount', n)} />
                <NumberInput label="Average sale per unit" value={inputs.avgSalePerUnit} prefix="£" step={5000} onChange={(n) => update('avgSalePerUnit', n)} />
                <NumberInput label="Build cost per sqm" value={inputs.buildCostPerSqm} prefix="£" suffix="/ sqm" step={50} onChange={(n) => update('buildCostPerSqm', n)} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-fl-4 h-full">
              <div className="bg-white rounded-2xl border border-thistle-black/[0.06] p-fl-7">
                <h3 className="text-fluid-h5 font-medium tracking-tight text-thistle-black mb-fl-5">Projected outcome</h3>
                <div className="space-y-fl-4">
                  <OutputRow label="Projected GDV" value={formatGBP(result.gdv)} />
                  <OutputRow label="Total cost (purchase + build)" value={formatGBP(result.totalCost)} />
                  <OutputRow label="Margin" value={formatGBP(result.marginPounds)} />
                  <OutputRow label="Margin %" value={`${result.marginPct.toFixed(1)}%`} accent />
                </div>
              </div>

              <div className={`rounded-2xl border ${bandCopy.bg} p-fl-6`}>
                <span className={`block text-[10px] uppercase tracking-widest font-semibold mb-fl-3 ${bandCopy.text}`}>{bandCopy.label}</span>
                <p className="text-fluid-sm text-thistle-black/80 leading-relaxed mb-fl-5">
                  {bandCopy.body}
                </p>
                <Button variant="primary" icon={<ArrowUpRight size={16} />} onClick={openModal}>
                  Start Feasibility
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
