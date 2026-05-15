import type { Metadata } from 'next';
import { ToolsIndexPage } from '@/views/ToolsIndexPage';

export const metadata: Metadata = {
  title: 'Free Tools | Thistle Architecture',
  description: 'Free conversion-feasibility tools: a Class MA eligibility checker and a GDV viability calculator. Quick checks for property developers.',
};

export default function Page() {
  return <ToolsIndexPage />;
}
