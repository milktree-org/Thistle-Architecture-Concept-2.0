import type { Metadata } from 'next';
import { ClassMACheckerPage } from '@/views/tools/ClassMACheckerPage';
import { getToolBySlug } from '@/data/toolsData';

const tool = getToolBySlug('class-ma-checker');

export const metadata: Metadata = tool
  ? { title: tool.metaTitle, description: tool.metaDescription }
  : { title: 'Class MA Eligibility Checker | Thistle Architecture' };

export default function Page() {
  return <ClassMACheckerPage />;
}
