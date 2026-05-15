"use client";

import React, { useState } from 'react';
import { ArrowUpRight, RotateCcw, CheckCircle2, AlertTriangle, XCircle, type LucideIcon } from 'lucide-react';
import { Reveal } from '../../components/animations/Reveal';
import { Button } from '../../components/ui/Button';
import { useFeasibility } from '../../components/feasibility/FeasibilityContext';

interface Question {
  key: string;
  prompt: string;
  options: { value: string; label: string }[];
}

const QUESTIONS: Question[] = [
  {
    key: 'useClass',
    prompt: "What is the building's current use class?",
    options: [
      { value: 'class-e', label: 'Class E (commercial, business, service)' },
      { value: 'other-commercial', label: 'Other commercial' },
      { value: 'residential', label: 'Already residential' },
      { value: 'other', label: 'Other or unsure' },
    ],
  },
  {
    key: 'commercialUse2y',
    prompt: "Has the building been in commercial use for the last 2 years?",
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unknown', label: 'Unknown' },
    ],
  },
  {
    key: 'vacant3m',
    prompt: "Has the building been vacant for at least 3 months?",
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unknown', label: 'Unknown' },
    ],
  },
  {
    key: 'floorSpace',
    prompt: "What is the approximate floor space being converted?",
    options: [
      { value: 'under-1500', label: 'Under 1,500 sqm' },
      { value: '1500-3000', label: '1,500 to 3,000 sqm' },
      { value: 'over-3000', label: 'Over 3,000 sqm' },
    ],
  },
  {
    key: 'article4',
    prompt: "Is there an Article 4 direction here that removes Class MA?",
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes' },
      { value: 'unknown', label: 'Unknown' },
    ],
  },
  {
    key: 'listedStatus',
    prompt: "Is the building listed or in a conservation area?",
    options: [
      { value: 'neither', label: 'Neither' },
      { value: 'conservation', label: 'Conservation area' },
      { value: 'listed', label: 'Listed building' },
    ],
  },
];

export type EligibilityVerdict = 'eligible' | 'borderline' | 'not-eligible';

// Pure verdict helper. Hard fails on Q1/Q4/Q5 close the route; any unknown
// or in-between answer surfaces a borderline; only an all-clear is eligible.
export function computeVerdict(answers: Record<string, string>): EligibilityVerdict {
  if (answers.useClass === 'residential' || answers.useClass === 'other') return 'not-eligible';
  if (answers.floorSpace === 'over-3000') return 'not-eligible';
  if (answers.article4 === 'yes') return 'not-eligible';

  if (
    answers.useClass === 'other-commercial' ||
    answers.commercialUse2y === 'unknown' || answers.commercialUse2y === 'no' ||
    answers.vacant3m === 'unknown' || answers.vacant3m === 'no' ||
    answers.floorSpace === '1500-3000' ||
    answers.article4 === 'unknown' ||
    answers.listedStatus !== 'neither'
  ) return 'borderline';

  return 'eligible';
}

interface VerdictCopy {
  headline: string;
  body: string;
  Icon: LucideIcon;
  bg: string;
  border: string;
  text: string;
}

const VERDICT_COPY: Record<EligibilityVerdict, VerdictCopy> = {
  eligible: {
    headline: 'Likely eligible for Class MA.',
    body: "Your answers do not trigger any of the hard-fail conditions. A full feasibility confirms it against live planning data and runs the prior-approval tests in detail.",
    Icon: CheckCircle2,
    bg: 'bg-thistle-green/[0.08]',
    border: 'border-thistle-green/30',
    text: 'text-thistle-green',
  },
  borderline: {
    headline: 'Borderline — a feasibility removes the doubt.',
    body: "You have at least one unknown or borderline answer. Class MA might still work, but the prior-approval tests need real data, not assumptions. A feasibility runs them for you.",
    Icon: AlertTriangle,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-600',
  },
  'not-eligible': {
    headline: 'Class MA is probably not the route.',
    body: "Something in your answers rules out Class MA permitted development. That does not mean the scheme is dead; full planning may still work. A feasibility tells you which route, if any, stacks up.",
    Icon: XCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-600',
  },
};

export const EligibilityChecker: React.FC = () => {
  const { openModal } = useFeasibility();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentStep = QUESTIONS.findIndex((q) => !answers[q.key]);
  const isDone = currentStep === -1;
  const totalSteps = QUESTIONS.length;
  const progress = isDone ? totalSteps : currentStep;

  const select = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const restart = () => setAnswers({});

  return (
    <section className="bg-thistle-white py-fl-section px-fl-margin">
      <div className="max-w-[800px] mx-auto">
        {!isDone && (
          <Reveal>
            <div className="bg-white rounded-2xl border border-thistle-black/[0.06] p-fl-7">
              <div className="flex items-center justify-between gap-fl-4 mb-fl-5">
                <span className="text-[11px] uppercase tracking-[0.2em] text-thistle-green font-semibold">
                  Question {progress + 1} of {totalSteps}
                </span>
                <div className="flex-1 max-w-[180px] h-1.5 bg-thistle-black/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-thistle-green transition-all duration-300"
                    style={{ width: `${(progress / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
              <h3 className="text-fluid-h4 font-medium tracking-tight leading-tight text-thistle-black mb-fl-6">
                {QUESTIONS[currentStep].prompt}
              </h3>
              <div className="flex flex-col gap-fl-3">
                {QUESTIONS[currentStep].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => select(QUESTIONS[currentStep].key, opt.value)}
                    className="text-left px-fl-5 py-fl-4 rounded-xl border border-thistle-black/[0.08] hover:border-thistle-green/40 hover:bg-thistle-green/[0.04] transition-all duration-200"
                  >
                    <span className="text-fluid-base text-thistle-black/80">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {isDone && (() => {
          const verdict = computeVerdict(answers);
          const copy = VERDICT_COPY[verdict];
          const Icon = copy.Icon;
          return (
            <Reveal>
              <div className={`rounded-2xl border ${copy.border} ${copy.bg} p-fl-7`}>
                <div className={`flex items-center gap-fl-3 mb-fl-5 ${copy.text}`}>
                  <Icon size={28} />
                  <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">Verdict</span>
                </div>
                <h3 className="text-fluid-h3 font-medium tracking-tight leading-tight text-thistle-black mb-fl-4">
                  {copy.headline}
                </h3>
                <p className="text-fluid-base text-thistle-black/80 leading-relaxed mb-fl-6 max-w-2xl">
                  {copy.body}
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-fl-4">
                  <Button variant="primary" icon={<ArrowUpRight size={16} />} onClick={openModal}>
                    Start Feasibility
                  </Button>
                  <button
                    onClick={restart}
                    className="inline-flex items-center gap-2 text-sm text-thistle-black/60 hover:text-thistle-black transition-colors font-medium tracking-tight"
                  >
                    <RotateCcw size={14} /> Start over
                  </button>
                </div>
              </div>
            </Reveal>
          );
        })()}
      </div>
    </section>
  );
};
