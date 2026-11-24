import { links } from "../content/links";
import { projects } from "../content/projects";
import type { Rich } from "../content/types";
import { projectPath, routes } from "../lib/routes";
import { content, expect, leafStrings, siteRoutes, test } from "./site";

const richText = (parts: Rich) =>
  parts.map((part) => (typeof part === "string" ? part : part.hl)).join("");

// 5. Sin JavaScript: todo el contenido se ve y los enlaces funcionan.
test.describe("5. Sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const route of siteRoutes) {
    test(`${route.path} muestra todo su contenido`, async ({ page }) => {
      await page.goto(route.path);
      const t = content[route.lang];
      const main = page.locator("main");

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      // Nada de lo que solo existe con JavaScript ocupa la pantalla.
      await expect(page.locator(".site-loader")).toBeHidden();
      await expect(page.locator(".wheel-stage")).toBeHidden();

      let expected: string[] = [];
      if (route.kind === "home") {
        expected = [
          t.hero.label,
          t.hero.title,
          t.hero.subtitle,
          ...t.hero.stats,
          t.home.projectsTitle,
          t.home.projectsIntro,
          t.home.casesTitle,
          t.home.casesIntro,
          ...projects.map((project) => project.name),
          ...leafStrings(t.services),
        ];
      } else if (route.kind === "about") {
        expected = [
          t.about.title,
          ...t.about.paragraphs.map(richText),
          ...t.about.panel.flatMap((item) => [item.label, item.value]),
          t.contact.title,
          links.email,
        ];
      } else {
        const project = projects.find((item) => item.slug === route.slug)!;
        expected = [
          project.name,
          project.code,
          t.status[project.status],
          ...leafStrings(
            project.type === "exp"
              ? t.projects[project.slug]
              : t.cases[project.slug],
          ),
        ];
      }

      for (const text of expected) {
        await expect(
          main.getByText(text).filter({ visible: true }).first(),
        ).toBeVisible();
      }
    });
  }

  for (const lang of ["es", "en"] as const) {
    test(`los enlaces de la grilla funcionan en ${lang}`, async ({ page }) => {
      for (const project of projects) {
        await page.goto(routes[lang].home);
        const link = page.locator(
          `.lab-grid a[href="${projectPath(lang, project.slug)}"]`,
        );
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL(projectPath(lang, project.slug));
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
          project.name,
        );
      }
    });
  }

  test("el menú y el cambio de idioma funcionan", async ({ page }) => {
    await page.goto("/");
    await page
      .locator("header nav")
      .first()
      .getByRole("link", { name: content.es.nav.about })
      .click();
    await expect(page).toHaveURL(routes.es.about);

    await page.locator("header a[hreflang='en']").first().click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});
