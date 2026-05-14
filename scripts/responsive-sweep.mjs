import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const ORIGIN = process.env.RESPONSIVE_ORIGIN || "http://localhost:3000";

const VIEWPORTS = [
  { name: "mobile-375",   width: 375,  height: 812,  deviceScaleFactor: 2, isMobile: true  },
  { name: "tablet-768",   width: 768,  height: 1024, deviceScaleFactor: 2, isMobile: false },
  { name: "laptop-1280",  width: 1280, height: 800,  deviceScaleFactor: 1, isMobile: false },
  { name: "desktop-1440", width: 1440, height: 900,  deviceScaleFactor: 1, isMobile: false },
  { name: "desktop-1920", width: 1920, height: 1080, deviceScaleFactor: 1, isMobile: false },
];

const ROUTES = [
  { slug: "home",                path: "/" },
  { slug: "how-it-works",        path: "/how-it-works" },
  { slug: "feasibility-package", path: "/feasibility-package" },
  { slug: "case-studies",        path: "/case-studies" },
  { slug: "case-study-detail",   path: "/case-studies/croydon-office-conversion" },
  { slug: "about",               path: "/about" },
  { slug: "blog",                path: "/blog" },
  { slug: "privacy",             path: "/privacy" },
  { slug: "terms",               path: "/terms" },
  { slug: "cookies",             path: "/cookies" },
];

async function run() {
  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    await mkdir(`screenshots/${vp.name}`, { recursive: true });
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
      isMobile: vp.isMobile,
    });
    const page = await ctx.newPage();
    for (const route of ROUTES) {
      try {
        await page.goto(`${ORIGIN}${route.path}`, { waitUntil: "networkidle", timeout: 30000 });
      } catch {
        console.warn(`SKIP ${vp.name} ${route.slug} — navigation failed`);
        continue;
      }
      await page.waitForTimeout(2500);
      const positions = [
        { name: "top",  y: 0 },
        { name: "mid",  y: 0.45 },
        { name: "deep", y: 0.9 },
      ];
      const docHeight = await page.evaluate(() => document.body.scrollHeight);
      const vpHeight = vp.height;
      for (const pos of positions) {
        const target = Math.max(0, Math.round((docHeight - vpHeight) * pos.y));
        await page.evaluate((y) => window.scrollTo(0, y), target);
        await page.waitForTimeout(600);
        await page.screenshot({
          path: `screenshots/${vp.name}/${route.slug}-${pos.name}.png`,
        });
      }
      console.log(`OK ${vp.name} ${route.slug}`);
    }
    await ctx.close();
  }
  await browser.close();
  console.log("Sweep complete. Open screenshots/ to review.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
