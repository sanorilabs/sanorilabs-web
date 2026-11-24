// Capturas de la home en escritorio (1440×900) para revisar cambios de diseño:
// el hero, la rueda en cada proyecto y la vista de grilla.
//
//   npm run build && npm run start -- -p 3100     (en otra terminal)
//   node scripts/capture-home.mjs [carpeta de salida]
//
// Variables: SHOTS_BASE (por defecto http://localhost:3100), SHOTS_PATH ("/").
import { mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { chromium } from "@playwright/test";

const BASE = process.env.SHOTS_BASE ?? "http://localhost:3100";
const PATH = process.env.SHOTS_PATH ?? "/";
const OUT = resolve(process.argv[2] ?? "capturas-home");

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
  channel: "chrome",
  args: ["--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
// Sin loader: la sesión se marca como ya visitada.
await page.addInitScript(() => window.sessionStorage.setItem("sn-loader", "1"));
await page.goto(BASE + PATH);
await page.waitForLoadState("networkidle");
await page.waitForTimeout(1200);

const shot = async (name) => {
  await page.screenshot({ path: join(OUT, `${name}.png`) });
  console.log(`${name}.png`);
};

await shot("1-hero");

// Hero con el ratón sobre el abanico.
const fan = page.locator(".hero-fan");
if (await fan.isVisible()) {
  const box = await fan.boundingBox();
  await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.6);
  await page.waitForTimeout(800);
  await shot("2-hero-abanico");
  await page.mouse.move(10, 400);
}

// La rueda, proyecto por proyecto.
const stage = page.locator(".wheel-stage");
if (await stage.isVisible()) {
  await page.locator(".wheel-stage canvas").waitFor({ timeout: 20_000 });
  const count = await page.locator(".wheel-stage ul > li").count();
  for (let index = 0; index < count; index++) {
    await page.evaluate((i) => {
      const wrap = document.querySelector(".wheel-stage");
      const sticky = wrap.querySelector(".sticky");
      const start = wrap.getBoundingClientRect().top + window.scrollY - 64;
      const step = (wrap.offsetHeight - sticky.offsetHeight) / (wrap.querySelectorAll("ul > li").length - 1);
      window.scrollTo(0, start + i * step);
    }, index);
    await page.waitForTimeout(2200);
    await shot(`${3 + index}-rueda-${index + 1}`);
  }

  // Vista de grilla.
  await page.locator(".wheel-stage .view-toggle").click();
  await page.waitForTimeout(1500);
  await shot(`${3 + count}-grilla`);
}

await browser.close();
