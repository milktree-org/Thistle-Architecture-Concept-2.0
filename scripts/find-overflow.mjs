import { chromium } from "playwright";

const ORIGIN = process.env.RESPONSIVE_ORIGIN || "http://localhost:3000";
const ROUTE = process.env.ROUTE || "/";
const VP_WIDTH = parseInt(process.env.VP_WIDTH || "375", 10);
const VP_HEIGHT = parseInt(process.env.VP_HEIGHT || "812", 10);

async function run() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: VP_WIDTH, height: VP_HEIGHT },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await ctx.newPage();
  await page.goto(`${ORIGIN}${ROUTE}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const offenders = await page.evaluate((vpW) => {
    const overs = [];
    for (const el of document.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.right > vpW + 1 && r.width > 0) {
        overs.push({
          tag: el.tagName.toLowerCase(),
          cls: el.className?.toString?.()?.slice(0, 120) || "",
          right: Math.round(r.right),
          width: Math.round(r.width),
        });
      }
    }
    return overs.sort((a, b) => a.width - b.width).slice(0, 30);
  }, VP_WIDTH);
  console.log(JSON.stringify(offenders, null, 2));
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
