import { chromium } from "playwright";

const ORIGIN = process.env.RESPONSIVE_ORIGIN || "http://localhost:3000";
const ROUTE = process.env.ROUTE || "/";

const VPS = [
  { name: "mobile-375",   w: 375,  h: 812 },
  { name: "laptop-1280",  w: 1280, h: 800 },
  { name: "desktop-1440", w: 1440, h: 900 },
  { name: "desktop-1920", w: 1920, h: 1080 },
];

async function run() {
  const browser = await chromium.launch();
  for (const v of VPS) {
    const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h } });
    const page = await ctx.newPage();
    await page.goto(`${ORIGIN}${ROUTE}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const data = await page.evaluate(() => {
      const rect = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: Math.round(r.top), bottom: Math.round(r.bottom), width: Math.round(r.width) };
      };
      return {
        vpH: window.innerHeight,
        bodyScrollW: document.body.scrollWidth,
        bodyClientW: document.body.clientWidth,
        firstSection: rect("section:first-of-type"),
        // Add the selectors you care about for the route under test.
      };
    });
    console.log(v.name, JSON.stringify(data));
    await ctx.close();
  }
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
