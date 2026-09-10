import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CompletedProjectsPage } from '@/views/CompletedProjectsPage';
import client from '@/tina/__generated__/client';
import { getCompletedProjects } from '@/lib/caseStudies';

export async function generateMetadata(): Promise<Metadata> {
  // This was a static `metadata` export. It has to run now, because the search
  // listing is editable alongside the page copy and a static export cannot
  // await. The values in code stay as the fallback for a field an editor has
  // cleared, which keeps a blank box out of Google, and the canonical stays in
  // code because it is the route, not copy.
  //
  // metaTitle stays a plain string, not `{ absolute: ... }`: layout.tsx's
  // template appends "| Thistle Architecture", and this page has always relied
  // on that. The field description tells the editor to type the page name only,
  // for the same reason.
  const listing = await client.queries.listings({ relativePath: 'completed-projects.json' });
  const l = listing.data.listings;

  return {
    title: l?.metaTitle || 'Projects',
    description:
      l?.metaDescription ||
      'Conversions and schemes delivered through to completion across the Thistle Group, filterable by conversion type.',
    alternates: { canonical: '/case-studies/completed-projects' },
  };
}

export default async function Page() {
  // The raw query, variables and data are all handed down, not just the data:
  // useTina needs the query to re-run it against the editor's live values.
  // The cards come from the CMS now, not from data/caseStudiesData.ts, so a
  // study an editor adds shows up here rather than only at its own URL.
  const [listing, items] = await Promise.all([
    client.queries.listings({ relativePath: 'completed-projects.json' }),
    getCompletedProjects(),
  ]);

  return (
    <Suspense>
      <CompletedProjectsPage
        page={{ query: listing.query, variables: listing.variables, data: listing.data }}
        items={items}
      />
    </Suspense>
  );
}
