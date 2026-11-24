import type { Lang } from "../content/types";
import { routes } from "../lib/routes";
import {
  absolute,
  content,
  expect,
  missingRoutes,
  siteRoutes,
  test,
} from "./site";

// 1. Rutas: cada página responde 200 y trae lang, title, description y hreflang.
test.describe("1. Rutas", () => {
  for (const route of siteRoutes) {
    test(`${route.path} responde 200 con lang, title, description y hreflang`, async ({
      page,
    }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);

      const other: Lang = route.lang === "es" ? "en" : "es";
      await expect(page.locator("html")).toHaveAttribute("lang", route.lang);

      const title = await page.title();
      expect(title.trim().length).toBeGreaterThan(0);
      expect(title).toContain(content[route.lang].meta.siteName);

      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveCount(1);
      expect(
        ((await description.getAttribute("content")) ?? "").trim().length,
      ).toBeGreaterThan(20);

      const alternate = (hreflang: string) =>
        page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`);
      const esPath = route.lang === "es" ? route.path : route.altPath;

      await expect(alternate(route.lang)).toHaveAttribute(
        "href",
        absolute(route.path),
      );
      await expect(alternate(other)).toHaveAttribute(
        "href",
        absolute(route.altPath),
      );
      await expect(alternate("x-default")).toHaveAttribute(
        "href",
        absolute(esPath),
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        absolute(route.path),
      );
    });
  }

  for (const lang of ["es", "en"] as Lang[]) {
    test(`la home en ${lang} usa el title y la description del contenido`, async ({
      page,
    }) => {
      await page.goto(routes[lang].home);
      await expect(page).toHaveTitle(content[lang].meta.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        content[lang].meta.description,
      );
    });
  }

  for (const missing of missingRoutes) {
    test(`${missing.path} da 404 en ${missing.lang}`, async ({ page }) => {
      const response = await page.goto(missing.path);
      expect(response?.status()).toBe(404);

      const t = content[missing.lang];
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        t.notFound.title,
      );
      await expect(page.locator("html")).toHaveAttribute("lang", missing.lang);
      await expect(
        page.getByRole("link", { name: t.notFound.cta }),
      ).toHaveAttribute("href", routes[missing.lang].home);
    });
  }
});
