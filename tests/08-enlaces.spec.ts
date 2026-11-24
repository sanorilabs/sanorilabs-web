import { links, quoteHref } from "../content/links";
import { projects } from "../content/projects";
import { projectPath, routes } from "../lib/routes";
import { expect, siteRoutes, test } from "./site";

/** Las URL externas tal como las pediste, proyecto por proyecto. */
const EXTERNAL: Record<string, string[]> = {
  casora: [
    "https://casoramx.com",
    "https://apps.apple.com/mx/app/id6810853902",
    "https://play.google.com/store/apps/details?id=com.casoramx.app",
  ],
  nola: ["https://www.nolamx.com/"],
  "pl-grupo-comercial": ["https://plgrupocomercial.com.mx"],
  permil: ["https://permil.com.mx"],
};
const EMAIL = "mailto:sanorilabs@gmail.com";

// 8. Enlaces: los internos responden y los externos tienen la URL exacta.
test.describe("8. Enlaces", () => {
  // Sin animaciones, para leer la página tal cual sale del servidor.
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("todos los enlaces internos responden y sus anclas existen", async ({
    page,
    request,
  }) => {
    const found = new Map<string, string>();

    for (const route of siteRoutes) {
      await page.goto(route.path);
      const hrefs = await page
        .locator("a[href]")
        .evaluateAll((anchors) =>
          anchors.map((anchor) => (anchor as HTMLAnchorElement).href),
        );
      for (const href of hrefs) {
        const url = new URL(href);
        if (url.origin !== new URL(page.url()).origin) continue;
        found.set(url.pathname + url.hash, route.path);
      }
    }
    expect(found.size).toBeGreaterThan(12);

    const broken: string[] = [];
    for (const [target, from] of found) {
      const [path, hash] = target.split("#");
      const response = await request.get(path);
      if (response.status() !== 200) {
        broken.push(`${target} (desde ${from}): ${response.status()}`);
        continue;
      }
      if (!hash) continue;
      const html = await response.text();
      const hasTarget =
        html.includes(`id="${hash}"`) || html.includes(`data-anchor="${hash}"`);
      if (!hasTarget) broken.push(`${target} (desde ${from}): falta el ancla`);
    }
    expect(broken).toEqual([]);
  });

  test("content/projects.ts tiene las URL externas exactas", () => {
    for (const project of projects) {
      expect(project.links.map((link) => link.href)).toEqual(
        EXTERNAL[project.slug],
      );
    }
    expect(`mailto:${links.email}`).toBe(EMAIL);
  });

  for (const lang of ["es", "en"] as const) {
    for (const project of projects) {
      test(`${projectPath(lang, project.slug)} enlaza a sus URL externas`, async ({
        page,
      }) => {
        await page.goto(projectPath(lang, project.slug));
        const external = page.locator('main a[href^="http"]');
        const hrefs = await external.evaluateAll((anchors) =>
          anchors.map((anchor) => anchor.getAttribute("href")),
        );
        expect(hrefs).toEqual(EXTERNAL[project.slug]);

        // Se abren en otra pestaña, sin dar acceso a esta.
        for (const link of await external.all()) {
          await expect(link).toHaveAttribute("target", "_blank");
          await expect(link).toHaveAttribute("rel", /noopener/);
        }
      });
    }

    test(`el correo y "cotiza" son correctos en ${lang}`, async ({ page }) => {
      await page.goto(routes[lang].about);
      await expect(page.locator('main a[href^="mailto:"]')).toHaveAttribute(
        "href",
        EMAIL,
      );

      // Sin número de WhatsApp en content/links.ts, "cotiza" va al correo.
      expect(quoteHref()).toBe(EMAIL);
      await page.goto(routes[lang].home);
      await expect(
        page.locator('main a[href^="mailto:"], main a[href*="wa.me"]'),
      ).toHaveAttribute("href", quoteHref());
    });
  }
});
