import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Every redirect below uses `statusCode: 301` rather than `permanent: true`.
  // They do the same job: `permanent: true` emits a 308, and Google has treated
  // 308 as equivalent to 301 for years. The difference is that a 308 forbids
  // changing the method, so a POST stays a POST, where a 301 lets clients
  // downgrade it to GET.
  //
  // These are all old Wix URLs being pointed at their new homes, and everything
  // hitting them is a GET from a bookmark, an inbound link or a search result.
  // Neither status is wrong. 301 is stated explicitly because it is what the
  // SEO audit asked for and what crawl tools expect to see, so this stops the
  // same row reappearing on the next report.
  async redirects() {
    return [
      // Item 110, September 2026: high-end residential is extensions, remodels
      // and new homes, not a conversion, so it moved out of /conversions/. The
      // page itself is still rendered by /conversions/[type] via the rewrite
      // below; only the public address changed. See conversionPath() in
      // data/conversionsData.ts, which every internal link goes through.
      {
        source: '/conversions/high-end-residential',
        destination: '/expertise/high-end-residential',
        statusCode: 301,
      },
      // Removed 2026-07-17: both were stock placeholders with no material
      // behind them. They were live, so send anyone holding the URL to the
      // projects hub rather than a 404.
      // Bishopstoke came back 2026-07-29 once Ed's Drive folder produced the
      // photography, so the old slug now points at the real page rather than
      // the hub.
      {
        source: '/case-studies/bishopstoke',
        destination: '/case-studies/bishopstoke-road',
        statusCode: 301,
      },
      {
        source: '/case-studies/forest-home',
        destination: '/case-studies/completed-projects',
        statusCode: 301,
      },
      // Old live-site journal URLs (root-level on Wix) map to /blog.
      {
        source: '/journal',
        destination: '/blog',
        statusCode: 301,
      },
      // Item 93. The article was published at a URL saying 2023, under a title
      // saying 2024, in June 2024. The year is out of the slug entirely now, so
      // it cannot fall out of step again, and the old URL 301s here.
      {
        source: '/blog/how-much-does-it-cost-to-self-build-in-2023',
        destination: '/blog/how-much-does-it-cost-to-self-build',
        statusCode: 301,
      },
      // The rest of the Wix top-level nav. Added 2026-08-05, after the domain
      // moved off Wix and these four started returning 404 on the real domain:
      // any inbound link, bookmark or search result pointing at them was dead.
      {
        source: '/works',
        destination: '/case-studies/completed-projects',
        statusCode: 301,
      },
      {
        source: '/studio',
        destination: '/about',
        statusCode: 301,
      },
      {
        // Wix's only project page. It is Bereweeke Avenue, which we already
        // publish, so send it to the real case study rather than a hub.
        source: '/winchesterproject',
        destination: '/case-studies/bereweeke-avenue',
        statusCode: 301,
      },
      // /contact used to redirect to /feasibility-package, on the reasoning that
      // the booking was the equivalent entry point. That call was reversed on
      // 2026-08-11: a contact page is standard practice, and not everyone
      // arriving is ready to book a feasibility study. The page now exists at
      // /contact, so the redirect is gone.
      // Wix serves every post at BOTH /slug and /post/slug, and all 13 return
      // 200 on the live site today. The root-level ones are redirected below;
      // this catches the /post/ form, which was missed and would have 404'd
      // every inbound link and search result using that pattern.
      {
        source: '/post/:slug',
        destination: '/blog/:slug',
        statusCode: 301,
      },
      // Scarlett's rebrand article was briefed with a root-level URL. The post
      // lives at /blog/ like every other article, so her suggested URL 301s to
      // it, matching how all the old root-level Wix slugs are handled.
      {
        source: '/hmo-designers-thistle-architecture-rebrand',
        destination: '/blog/hmo-designers-thistle-architecture-rebrand',
        statusCode: 301,
      },
      {
        source: '/class-ma-prior-approval-what-you-need-to-know',
        destination: '/blog/class-ma-prior-approval-what-you-need-to-know',
        statusCode: 301,
      },
      {
        source: '/buying-vs-building-a-home-in-the-uk',
        destination: '/blog/buying-vs-building-a-home-in-the-uk',
        statusCode: 301,
      },
      {
        source: '/self-building-an-eco-home-in-the-uk',
        destination: '/blog/self-building-an-eco-home-in-the-uk',
        statusCode: 301,
      },
      {
        source: '/brick-vs-stone-vs-concrete-masonry-in-self-build-homes',
        destination: '/blog/brick-vs-stone-vs-concrete-masonry-in-self-build-homes',
        statusCode: 301,
      },
      {
        source: '/class-q-barn-conversions',
        destination: '/blog/class-q-barn-conversions',
        statusCode: 301,
      },
      {
        source: '/10-pros-and-cons-of-masonry-for-self-build-houses',
        destination: '/blog/10-pros-and-cons-of-masonry-for-self-build-houses',
        statusCode: 301,
      },
      {
        source: '/self-build-icfs-construction',
        destination: '/blog/self-build-icfs-construction',
        statusCode: 301,
      },
      {
        source: '/self-build-timber-frame-house',
        destination: '/blog/self-build-timber-frame-house',
        statusCode: 301,
      },
      {
        source: '/self-build-sips-construction',
        destination: '/blog/self-build-sips-construction',
        statusCode: 301,
      },
      {
        source: '/how-much-does-it-cost-to-self-build-in-2023',
        destination: '/blog/how-much-does-it-cost-to-self-build',
        statusCode: 301,
      },
      {
        source: '/how-to-fund-a-self-build-home',
        destination: '/blog/how-to-fund-a-self-build-home',
        statusCode: 301,
      },
      {
        source: '/top-10-considerations-when-it-comes-to-self-building',
        destination: '/blog/top-10-considerations-when-it-comes-to-self-building',
        statusCode: 301,
      },
      {
        source: '/how-to-find-the-right-self-build-architect',
        destination: '/blog/how-to-find-the-right-self-build-architect',
        statusCode: 301,
      },
      // Found 2026-08-17 by pulling the old site's URL list out of the Wayback
      // Machine, rather than trusting the Wix nav. These eight were live and
      // returning 200 on Wix, were never in the redirect map, and had been
      // 404ing since the domain moved.
      //
      // The first six are project pages. Wix named them after the order they
      // were created ("2nd-project") or after the page they were duplicated
      // from ("copy-of-school-house"), so the slug says nothing useful about
      // the content. Each destination below was matched on the archived page's
      // own title and body text, not on its slug:
      //   /2nd-project                 was "HACKNEY HOUSE"
      //   /3rd-project                 was "SCHOOL HOUSE"
      //   /4th-project                 was "FOREST HOUSE"
      //   /copy-of-bereweeke-avenue    was "WINCHESTER HOUSE, CONCEPT"
      //   /copy-of-historic-commercial was "BEAUCHAMP HOUSE"
      //   /copy-of-school-house        was "UPPER HIGH STREET", i.e. 5 Upper
      //                                High Street, Winchester = Monument House
      {
        source: '/2nd-project',
        destination: '/case-studies/corner-house-hackney',
        statusCode: 301,
      },
      {
        source: '/3rd-project',
        destination: '/case-studies/school-house-south-downs',
        statusCode: 301,
      },
      {
        source: '/4th-project',
        destination: '/case-studies/forest-house-lymington',
        statusCode: 301,
      },
      {
        source: '/copy-of-bereweeke-avenue',
        destination: '/case-studies/bereweeke-avenue',
        statusCode: 301,
      },
      {
        source: '/copy-of-historic-commercial',
        destination: '/case-studies/beauchamp-house',
        statusCode: 301,
      },
      {
        source: '/copy-of-school-house',
        destination: '/case-studies/monument-house',
        statusCode: 301,
      },
      // Wix system pages for its gallery lightbox. No content of their own, but
      // they answered 200 and so were indexable. Sent to the projects hub,
      // which is the nearest thing to what someone clicking a gallery wanted.
      {
        source: '/fullscreen-page-1',
        destination: '/case-studies/completed-projects',
        statusCode: 301,
      },
      {
        source: '/fullscreen-page-2',
        destination: '/case-studies/completed-projects',
        statusCode: 301,
      },
      // Recovered 2026-08-17 from Wix's own URL Redirect Manager, read out of the
      // Wix dashboard. Wix was serving 301s for these 16 URLs right up to the
      // migration, and every one of them was lost when the domain moved. All
      // but /blog were confirmed 404 on the live site before this was written.
      //
      // These are older than the Wayback list: they are URLs from an even
      // earlier version of the site, which Wix was already redirecting. That is
      // why a crawl of the Wix site never surfaced them, and why guessing did
      // not either.
      //
      // Wix pointed most of them at other Wix URLs (/studio, /works,
      // /winchesterproject), so the destinations below are the resolved end of
      // each chain rather than a second hop.
      //
      // /blog is deliberately absent. On Wix it redirected to /journal; on this
      // site /blog is the real page, so it must serve directly. Adding it here
      // would create a loop with the /journal redirect above.
      {
        source: '/1st-project',
        destination: '/case-studies/bereweeke-avenue',
        statusCode: 301,
      },
      {
        source: '/about-us',
        destination: '/about',
        statusCode: 301,
      },
      {
        // Wix sent this to the homepage because it had no cookie policy page.
        // This site does, so it goes to the real thing.
        source: '/cookie-policy',
        destination: '/cookies',
        statusCode: 301,
      },
      {
        source: '/featured-projects',
        destination: '/case-studies/completed-projects',
        statusCode: 301,
      },
      {
        // Wix sent this to /studio, its about page, for want of anywhere
        // better. This site has an actual process section, and /how-it-works
        // already points at it, so this matches that rather than Wix.
        source: '/our-process',
        destination: '/feasibility-package#how-it-works',
        statusCode: 301,
      },
      {
        // Wix had this as a group redirect for /post/*. The /post/:slug form is
        // already handled above and lands on the real article, which is better
        // than Wix managed, so this only needs to catch the bare /post.
        source: '/post',
        destination: '/blog',
        statusCode: 301,
      },
      {
        // Wix chained this to /2nd-project, which was "HACKNEY HOUSE".
        source: '/project/courtyard-house',
        destination: '/case-studies/corner-house-hackney',
        statusCode: 301,
      },
      {
        // Wix sent this to the homepage because the project page was gone. We
        // publish a Queens Road case study, so it goes there instead.
        // WORTH ED CONFIRMING this is the same Queens Road.
        source: '/project/queens-road',
        destination: '/case-studies/queens-road',
        statusCode: 301,
      },
      // The remaining four Wix project pages have no equivalent on this site.
      // Wix sent them to the homepage; the projects hub is the closer match for
      // someone who clicked through expecting a project.
      {
        source: '/project/interior-design',
        destination: '/case-studies/completed-projects',
        statusCode: 301,
      },
      {
        source: '/project/terrace-end-house',
        destination: '/case-studies/completed-projects',
        statusCode: 301,
      },
      {
        source: '/project/wharf-house',
        destination: '/case-studies/completed-projects',
        statusCode: 301,
      },
      {
        source: '/project/zinc-house',
        destination: '/case-studies/completed-projects',
        statusCode: 301,
      },
      // Wix pointed the /what-we-do tree at /studio, its about page. This site
      // separates who we are from what we sell, so these go to the service.
      {
        source: '/what-we-do',
        destination: '/feasibility-package',
        statusCode: 301,
      },
      {
        source: '/what-we-do/residential-architecture',
        destination: '/conversions/high-end-residential',
        statusCode: 301,
      },
      {
        source: '/what-we-do/self-build-architecture',
        destination: '/feasibility-package',
        statusCode: 301,
      },
      {
        source: '/how-it-works',
        destination: '/feasibility-package#how-it-works',
        statusCode: 301,
      },
      {
        source: '/tools',
        destination: '/tools/class-ma-checker',
        statusCode: 301,
      },
      {
        source: '/conversions/office-to-resi-class-ma',
        destination: '/conversions/commercial-to-residential',
        statusCode: 301,
      },
      {
        source: '/commercial-conversions',
        destination: '/feasibility-package',
        statusCode: 301,
      },
      {
        source: '/hmos',
        destination: '/feasibility-package',
        statusCode: 301,
      },
      {
        source: '/high-end-residential',
        destination: '/feasibility-package',
        statusCode: 301,
      },
    ];
  },

  // The CMS editor is a static SPA that `tinacms build` emits to
  // public/admin/index.html. Without this rewrite /admin is a 404, because
  // there is no such route in the app directory.
  //
  // Rewrites run after redirects in Next's pipeline, and none of the 50
  // redirect sources above is /admin or a prefix of it, so there is no
  // interaction between the two.
  async rewrites() {
    return [
      { source: '/admin', destination: '/admin/index.html' },
      // The public address of the high-end residential page. Redirects run
      // first and only on the incoming URL, so this internal destination is not
      // bounced back by the redirect above.
      { source: '/expertise/high-end-residential', destination: '/conversions/high-end-residential' },
    ];
  },

  // /admin is the CMS editor. See src/app/robots.ts for why it is crawlable
  // and noindexed rather than blocked.
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/admin',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },

  images: {
    // Media is repo-based (see tina/config.ts): editors upload into
    // public/images/uploads and what gets committed is a relative
    // '/images/uploads/...' path. But while the editor is open, TinaCloud
    // serves the file it just accepted from its own CDN, and the live preview
    // renders that absolute URL before the save round-trips. next/image
    // rejects any host that is not listed here, so without this entry an
    // editor sees a broken image every time they upload one.
    //
    // This is the only reason assets.tina.io is allowed. Committed content
    // should never point at it.
    remotePatterns: [{ protocol: 'https', hostname: 'assets.tina.io' }],
  },
};

export default nextConfig;
