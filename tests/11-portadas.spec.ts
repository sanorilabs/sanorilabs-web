import { projects } from "../content/projects";
import type { Lang } from "../content/types";
import { projectPath, routes } from "../lib/routes";
import { absolute, content, expect, test } from "./site";

const altFor = (lang: Lang, name: string) =>
  content[lang].ui.coverAlt.replace("{name}", name);

// 11. Portadas: reales, con texto alternativo, y una imagen OG por proyecto.
test.describe("11. Portadas", () => {
  test("cada proyecto tiene color, logo, portada e imagen para compartir", async ({
    request,
  }) => {
    for (const project of projects) {
      expect(project.brand.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      for (const [file, type] of [
        [project.brand.logo, /image\/(png|svg)/],
        [project.cover, /image\/webp/],
        [project.og, /image\/jpeg/],
      ] as const) {
        const response = await request.get(file);
        expect(response.status(), file).toBe(200);
        expect(response.headers()["content-type"], file).toMatch(type);
      }
    }
  });

  for (const lang of ["es", "en"] as Lang[]) {
    test(`el hero de escritorio muestra las 4 portadas en abanico (${lang})`, async ({
      page,
    }) => {
      await page.goto(routes[lang].home);
      const fan = page.locator(".hero-fan");
      await expect(fan).toBeVisible();

      for (const project of projects) {
        const image = fan.getByAltText(altFor(lang, project.name));
        await expect(image).toBeVisible();
        await expect
          .poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth))
          .toBeGreaterThan(0);
      }

      // Al pasar el ratón las portadas se separan.
      const last = fan.locator(".hero-fan-card").last();
      const before = (await last.boundingBox())!;
      await fan.hover();
      await expect
        .poll(async () => (await last.boundingBox())!.x)
        .toBeGreaterThan(before.x + 4);
    });

    test(`la grilla usa las portadas con texto alternativo (${lang})`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(routes[lang].home);
      for (const project of projects) {
        await expect(
          page.locator(".lab-grid").getByAltText(altFor(lang, project.name)),
        ).toBeVisible();
      }
    });

    for (const project of projects) {
      test(`${projectPath(lang, project.slug)}: portada con alt e imagen OG propia`, async ({
        page,
      }) => {
        await page.goto(projectPath(lang, project.slug));
        const alt = altFor(lang, project.name);

        const cover = page.locator("main").getByAltText(alt);
        await expect(cover).toBeVisible();
        await expect(cover).toHaveAttribute("src", /\.webp/);

        await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
          "content",
          absolute(project.og),
        );
        await expect(
          page.locator('meta[property="og:image:alt"]'),
        ).toHaveAttribute("content", alt);
        await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
          "content",
          absolute(project.og),
        );
      });
    }
  }
});
