import type { Metadata } from 'next';
import { GDVCalculatorPage } from '@/views/tools/GDVCalculatorPage';
import { getToolBySlug } from '@/data/toolsData';

const tool = getToolBySlug('gdv-calculator');

export const metadata: Metadata = tool
  ? { title: tool.metaTitle, description: tool.metaDescription }
  : { title: 'GDV & Viability Calculator | Thistle Architecture' };

export default function Page() {
  return <GDVCalculatorPage />;
}
