import { projects } from "../content/projects";
import { projectPath, routes } from "../lib/routes";
import {
  collectScripts,
  content,
  expect,
  hasThree,
  missingRoutes,
  scrollThrough,
  siteRoutes,
  test,
} from "./site";

// 2. Celular (iPhone 14 y Pixel 7). Este archivo corre en esos dos proyectos.
test.describe("2. Celular", () => {
  test("la home muestra la grilla y no descarga three.js", async ({ page }) => {
    const scripts = collectScripts(page);
    await page.goto("/");
    await scrollThrough(page);
    // Margen para todo lo que el sitio carga "cuando el navegador esté libre".
    await page.waitForTimeout(2500);

    await expect(page.locator(".lab-grid")).toBeVisible();
    await expect(page.locator(".wheel-stage")).toBeHidden();
    await expect(page.locator("canvas")).toHaveCount(0);
    expect(hasThree(await scripts())).toBe(false);

    for (const project of projects) {
      await expect(
        page.locator(`.lab-grid a[href="${projectPath("es", project.slug)}"]`),
      ).toBeVisible();
    }
  });

  test("el menú se abre y se cierra", async ({ page }) => {
    await page.goto("/");
    const menu = page.locator("header details");
    const button = menu.locator("summary");
    const aboutLink = menu.getByRole("link", { name: content.es.nav.about });

    await expect(button).toBeVisible();
    await expect(aboutLink).toBeHidden();

    await button.click();
    await expect(menu).toHaveAttribute("open", "");
    await expect(aboutLink).toBeVisible();

    await button.click();
    await expect(menu).not.toHaveAttribute("open", "");
    await expect(aboutLink).toBeHidden();

    // Elegir un enlace navega y deja el menú cerrado.
    await button.click();
    await aboutLink.click();
    await expect(page).toHaveURL(routes.es.about);
    await expect(menu).not.toHaveAttribute("open", "");
  });

  const paths = [
    ...siteRoutes.map((route) => route.path),
    ...missingRoutes.map((route) => route.path),
  ];

  for (const path of paths) {
    test(`${path} no tiene scroll horizontal`, async ({ page }) => {
      await page.goto(path);
      await scrollThrough(page);
      const overflow = await page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth - root.clientWidth;
      });
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
