import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { conversions, getConversion } from '@/data/conversionsData';
import { ConversionPage } from '@/views/ConversionPage';

export function generateStaticParams() {
  return conversions.map((c) => ({ type: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  const c = getConversion(type);
  return {
    title: c?.metaTitle ?? 'Conversion Feasibility | Thistle Architecture',
    description: c?.metaDescription ?? 'Data-driven feasibility for residential conversions across the UK.',
  };
}

export default async function Page({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const conversion = getConversion(type);
  if (!conversion) notFound();
  return <ConversionPage conversion={conversion} />;
}
