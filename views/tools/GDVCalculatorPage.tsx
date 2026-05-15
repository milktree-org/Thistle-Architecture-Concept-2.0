"use client";

import React from 'react';
import { ToolShell } from '../../components/ui/ToolShell';
import { GDVCalculator } from '../../sections/tools/GDVCalculator';
import { getToolBySlug } from '../../data/toolsData';

const tool = getToolBySlug('gdv-calculator');

export const GDVCalculatorPage: React.FC = () => {
  if (!tool) throw new Error('gdv-calculator tool missing from toolsData');
  return (
    <ToolShell
      tool={tool}
      heroHeading="Do The Numbers Stack Up?"
      heroDescription="A quick back-of-envelope viability check. Five inputs, live outputs, sensible defaults to start."
      disclaimer="Indicative numbers only. A real feasibility models comparables, voids, and risk."
    >
      <GDVCalculator />
    </ToolShell>
  );
};
