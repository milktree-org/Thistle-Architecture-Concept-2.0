import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { conversions, getConversion } from '@/data/conversionsData';
import { ConversionPage } from '@/views/ConversionPage';

export function generateStaticParams() {
  return conversions.map((c) => ({ type: c.slug }));
}

export function generateMetadata({ params }: { params: { type: string } }): Metadata {
  const c = getConversion(params.type);
  return {
    title: c?.metaTitle ?? 'Conversion Feasibility | Thistle Architecture',
    description: c?.metaDescription ?? 'Data-driven feasibility for residential conversions across the UK.',
  };
}

export default function Page({ params }: { params: { type: string } }) {
  const conversion = getConversion(params.type);
  if (!conversion) notFound();
  return <ConversionPage conversion={conversion} />;
}
