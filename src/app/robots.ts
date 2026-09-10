import type { MetadataRoute } from 'next';

// The password gate served a robots.txt of "Disallow: /" while the site was
// held back. Removing the gate removes that too, so this replaces it with an
// explicit permission rather than leaving no robots.txt at all: the switch from
// blocked to open should be deliberate and visible, not an absence.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /admin, the CMS editor, is deliberately NOT disallowed here any more.
      // It was, and Search Console reported it on 6 September 2026 as
      // "Indexed, though blocked by robots.txt": Google had found the URL,
      // could not crawl it, and indexed it blind. A robots block hides the
      // content but not the address. The fix is the opposite: let it be
      // crawled and serve a noindex header (next.config.ts), which Google can
      // only obey if it is allowed to fetch the page.
    },
    sitemap: 'https://www.thistlearchitecture.co.uk/sitemap.xml',
  };
}
