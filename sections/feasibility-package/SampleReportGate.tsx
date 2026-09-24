"use client";

import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { pruneEmpty } from '../../lib/tina';
import { SAMPLE_REPORT_PATH } from '../../lib/sampleReport';

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Now a fallback rather than this card's only copy: the same three strings live
// in content/feasibility/package.json, seeded byte-for-byte from here.
//
// Only these three are editable. The placeholder, the button's two states, the
// error line and the whole success message are the mechanic rather than copy —
// a reworded button state is a broken button, and the success text has to keep
// matching what the form has just done.
const FALLBACK = {
  heading: 'Read a real report first.',
  body: 'Enter your email and we will send you a full feasibility from a real project, with the client details removed. Fifteen pages: the overview, the planning research, the space standards and the sketch layout.',
  privacyNote: 'No spam. Just the report and one follow-up.',
};

interface SampleReportGateProps {
  heading?: string;
  body?: string;
  privacyNote?: string;
  /** CMS field ids for the three editable strings. */
  tina?: Partial<Record<'heading' | 'body' | 'privacyNote', string>>;
}

// Email-gated download of the example feasibility.
//
// History, because this has moved twice. It first revealed a download whose
// file was the real St John's report, with the client's address on every page,
// so it came down with the other per-study documents. It then captured the
// address and handed off to a person, because no redacted example existed.
// Ed sent one on 23 September 2026 (Claremont Road, client details out), so it
// is a download again.
//
// Both at once, deliberately: the link appears on screen the moment the form is
// submitted, and Formspree's autoresponse emails the same link. On screen
// because nobody should wait on an email for something they just asked for; by
// email because that is what makes the address worth giving, and it puts the
// document somewhere they can find it next week.
export const SampleReportGate: React.FC<SampleReportGateProps> = ({ heading, body, privacyNote, tina }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  // pruneEmpty: a field the editor has cleared arrives as '' and would blank the
  // card, so an empty field leaves the standing copy in place.
  const copy = { ...FALLBACK, ...pruneEmpty({ heading, body, privacyNote }) };

  const submit = async () => {
    if (!emailOk(email)) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'sample-report', email }),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-fl-7 bg-white rounded-2xl border border-thistle-black/[0.06] p-fl-6 text-center">
      {status === 'done' ? (
        <>
          <p className="text-fluid-base text-thistle-black mb-fl-2">Here it is.</p>
          <p className="text-fluid-sm text-thistle-black/55 leading-relaxed mb-fl-4">
            A copy is on its way to your inbox as well, so you have it to hand later.
          </p>
          {/* target and rel: the PDF opens in its own tab rather than taking the
              page away, and noopener is the rule for any target="_blank". */}
          <a
            href={SAMPLE_REPORT_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium px-6 py-3 rounded-full bg-thistle-green text-thistle-black hover:bg-thistle-green/80 transition-colors"
          >
            Open the example feasibility
            <ArrowUpRight size={15} />
          </a>
        </>
      ) : (
        <>
          <h3 className="text-fluid-h5 font-medium tracking-tight text-thistle-black mb-fl-2" data-tina-field={tina?.heading}>{copy.heading}</h3>
          <p className="text-fluid-sm text-thistle-black/60 leading-relaxed mb-fl-5" data-tina-field={tina?.body}>
            {copy.body}
          </p>
          <div className="flex flex-col sm:flex-row gap-fl-3">
            <input
              type="email"
              placeholder="you@company.co.uk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              className="flex-1 border border-thistle-black/10 rounded-full px-5 py-3 text-sm bg-thistle-white/50 focus:border-thistle-green focus:ring-1 focus:ring-thistle-green/20 outline-none transition-colors placeholder:text-thistle-black/25"
            />
            <button
              onClick={submit}
              disabled={!emailOk(email) || status === 'submitting'}
              className="inline-flex items-center justify-center gap-1.5 text-sm font-medium px-6 py-3 rounded-full bg-thistle-green text-thistle-black hover:bg-thistle-green/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Sending…' : 'Send me the example'}
              <ArrowUpRight size={15} />
            </button>
          </div>
          {status === 'error' && (
            <p className="text-xs text-red-700 mt-fl-3">Something went wrong. Please try again.</p>
          )}
          <p className="text-[11px] text-thistle-black/40 mt-fl-3" data-tina-field={tina?.privacyNote}>{copy.privacyNote}</p>
        </>
      )}
    </div>
  );
};
