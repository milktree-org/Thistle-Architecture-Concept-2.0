/**
 * The example feasibility: every file we link to exists, and the email links to
 * all of them.
 *
 * Exists because the same document is named in three places (the card, the
 * route's Formspree form and the autoresponse text), and a rename that missed
 * one would send a prospect to a 404 they would never report.
 *
 *   npm run test:sample-report
 */
import { readFileSync, existsSync } from 'node:fs';
import { SAMPLE_REPORT_PATH, SAMPLE_REPORT_PARTS, SITE } from '../lib/sampleReport.ts';

let n = 0;
const ok = (label, cond) => { n++; if (!cond) { console.error(`✕ ${label}`); process.exit(1); } console.log(`✔ ${label}`); };

const forms = JSON.parse(readFileSync(new URL('../formspree.json', import.meta.url), 'utf8')).forms;
const auto = forms['sample-report'].actions.find((a) => a.type === 'autoresponse');

ok('the pack is published', existsSync(new URL('../public' + SAMPLE_REPORT_PATH, import.meta.url)));
ok('the email links to the pack', auto.message.includes(SITE + SAMPLE_REPORT_PATH));
for (const part of SAMPLE_REPORT_PARTS) {
  ok(`${part.label}: published`, existsSync(new URL('../public' + part.path, import.meta.url)));
  ok(`${part.label}: in the email`, auto.message.includes(SITE + part.path));
}
ok('the email does not overclaim on redaction', !/client details removed/i.test(auto.message));
ok('the lead still reaches the team', forms['sample-report'].actions.some((a) => a.type === 'email'));
console.log(`${n} checks passed`);
