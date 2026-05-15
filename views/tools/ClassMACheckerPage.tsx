"use client";

import React from 'react';
import { ToolShell } from '../../components/ui/ToolShell';
import { EligibilityChecker } from '../../sections/tools/EligibilityChecker';
import { getToolBySlug } from '../../data/toolsData';

const tool = getToolBySlug('class-ma-checker');

export const ClassMACheckerPage: React.FC = () => {
  if (!tool) throw new Error('class-ma-checker tool missing from toolsData');
  return (
    <ToolShell
      tool={tool}
      heroHeading="Class MA: Does Your Building Qualify?"
      heroDescription="Six quick questions to screen your building against the main Class MA prior-approval tests. Around two minutes."
      disclaimer="This screener is a quick check, not a planning determination. A full feasibility is the final word."
    >
      <EligibilityChecker />
    </ToolShell>
  );
};
