import { projects } from "../content/projects";
import { projectPath } from "../lib/routes";
import {
  collectScripts,
  content,
  expect,
  hasThree,
  scrollThrough,
  test,
} from "./site";

// 4. prefers-reduced-motion: sin loader, sin three.js y press check ya palomeado.
test.describe("4. Movimiento reducido", () => {
  // Primera visita real (sin saltarse el loader) y con la preferencia activa.
  test.use({ skipLoader: false, contextOptions: { reducedMotion: "reduce" } });

  test("la home no muestra loader ni descarga three.js", async ({ page }) => {
    const scripts = collectScripts(page);
    await page.goto("/", { waitUntil: "commit" });

    const html = page.locator("html");
    await expect(page.locator(".site-loader")).toBeHidden();
    await page.waitForLoadState("load");
    await expect(html).not.toHaveAttribute("data-loader", /.*/);
    await expect(html).not.toHaveAttribute("data-motion", /.*/);

    await scrollThrough(page);
    await page.waitForTimeout(2500);

    await expect(page.locator(".lab-grid")).toBeVisible();
    await expect(page.locator(".wheel-stage")).toBeHidden();
    await expect(page.locator("canvas")).toHaveCount(0);
    expect(hasThree(await scripts())).toBe(false);

    // Nada espera a animarse: el título y las tarjetas están a la vista.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".reveal-line")).toHaveCount(0);
  });

  for (const project of projects.filter((item) => item.type === "cli")) {
    test(`el press check de ${project.name} aparece ya palomeado`, async ({
      page,
    }) => {
      await page.goto(projectPath("es", project.slug));
      const steps = content.es.cases[project.slug].steps;
      const items = page.locator(".press-check li");
      await expect(items).toHaveCount(steps.length);

      const total = String(steps.length).padStart(2, "0");
      await expect(page.locator(".press-check > p")).toHaveText(
        `${total} / ${total}`,
      );

      for (let i = 0; i < steps.length; i++) {
        const item = items.nth(i);
        await expect(item).toContainText(steps[i]);
        // Caja llena de tinta y palomita dibujada, sin haber hecho scroll.
        await expect(item.locator(".press-box")).toHaveCSS(
          "background-color",
          "rgb(17, 17, 17)",
        );
        await expect(item.locator(".press-tick")).toHaveCSS(
          "stroke-dashoffset",
          "0px",
        );
      }
    });
  }
});
