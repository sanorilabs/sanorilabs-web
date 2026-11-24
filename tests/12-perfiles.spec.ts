import { links } from "../content/links";
import { person } from "../content/person";
import { projects } from "../content/projects";
import type { Lang } from "../content/types";
import { projectPath, routes } from "../lib/routes";
import { content, expect, test } from "./site";

/** Los tres perfiles tal como los pediste. */
const GITHUB = "https://github.com/sebonorai";
const LINKEDIN = "https://www.linkedin.com/in/sebastianoriegao";
const INSTAGRAM = "https://www.instagram.com/sanorilabs/";

// 12. Perfiles: GitHub y LinkedIn a la vista, y los tres en los datos
// estructurados, en español y en inglés.
test.describe("12. Perfiles", () => {
  // Sin animaciones, para leer la página tal cual sale del servidor.
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("content/ tiene las URL exactas", () => {
    expect(links.github).toBe(GITHUB);
    expect(links.linkedin).toBe(LINKEDIN);
    expect(person.sameAs).toEqual([GITHUB, LINKEDIN, INSTAGRAM]);
  });

  for (const lang of ["es", "en"] as Lang[]) {
    const t = content[lang];
    const pages = [
      routes[lang].home,
      projectPath(lang, projects[0].slug),
      routes[lang].about,
    ];

    for (const path of pages) {
      test(`${path}: footer con GitHub y LinkedIn (icono, texto y aria-label)`, async ({
        page,
      }) => {
        await page.goto(path);
        const footer = page.locator("footer");

        for (const [href, text, label] of [
          [GITHUB, "GitHub", t.profiles.github],
          [LINKEDIN, "LinkedIn", t.profiles.linkedin],
        ]) {
          const link = footer.locator(`a[href="${href}"]`);
          await expect(link).toBeVisible();
          await expect(link).toHaveText(text);
          await expect(link).toHaveAttribute("aria-label", label);
          await expect(link).toHaveAttribute("target", "_blank");
          await expect(link).toHaveAttribute("rel", /noopener/);
          await expect(link.locator("svg")).toBeVisible();
        }
      });

      test(`${path}: el menú lleva "GitHub ↗" justo antes de ES/EN`, async ({
        page,
      }) => {
        await page.goto(path);
        const items = page.locator("header nav").first().locator("li");
        const count = await items.count();

        const github = items.nth(count - 2).locator("a");
        await expect(github).toBeVisible();
        await expect(github).toHaveAttribute("href", GITHUB);
        await expect(github).toHaveText("GitHub ↗");
        await expect(github).toHaveAttribute("target", "_blank");

        // El último elemento del menú sigue siendo el cambio de idioma.
        await expect(items.nth(count - 1).locator("a[hreflang]")).toBeVisible();
      });

      test(`${path}: datos estructurados de tipo Person`, async ({ page }) => {
        await page.goto(path);
        const scripts = page.locator('script[type="application/ld+json"]');
        await expect(scripts).toHaveCount(1);
        const data = JSON.parse((await scripts.textContent()) ?? "{}");

        expect(data["@context"]).toBe("https://schema.org");
        expect(data["@type"]).toBe("Person");
        expect(data.name).toBe("Sebastián Noriega");
        expect(data.jobTitle).toBe("Software engineering student & founder");
        expect(data.alumniOf.name).toBe("Tecnológico de Monterrey");
        expect(data.url).toBe("https://sanorilabs.com");
        expect(data.sameAs).toEqual([GITHUB, LINKEDIN, INSTAGRAM]);
      });
    }

    test(`${routes[lang].about}: botones GitHub y LinkedIn junto al contacto`, async ({
      page,
    }) => {
      await page.goto(routes[lang].about);
      const contact = page.locator(`#${routes[lang].anchors.contact}`);

      for (const [href, name] of [
        [GITHUB, "GitHub"],
        [LINKEDIN, "LinkedIn"],
      ]) {
        const button = contact.getByRole("link", { name });
        await expect(button).toBeVisible();
        await expect(button).toHaveAttribute("href", href);
        await expect(button).toHaveAttribute("target", "_blank");
        // Son botones, no enlaces de texto: tienen borde y alto de botón.
        await expect(button).toHaveCSS("border-top-width", "1px");
        expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
    });
  }
});
