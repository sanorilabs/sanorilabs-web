import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, missingRoutes, scrollThrough, siteRoutes, test } from "./site";

/** Corre axe con todas sus reglas y devuelve las violaciones, legibles. */
async function violations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations.map((violation) => ({
    regla: violation.id,
    impacto: violation.impact,
    ayuda: violation.help,
    nodos: violation.nodes.map((node) => node.target.join(" ")).slice(0, 5),
  }));
}

const paths = [
  ...siteRoutes.map((route) => route.path),
  ...missingRoutes.map((route) => route.path),
];

// 7. Accesibilidad: axe sin violaciones en todas las rutas, en ES y EN.
test.describe("7. Accesibilidad (axe)", () => {
  // Con movimiento reducido toda la página está quieta y a la vista: axe
  // revisa el contenido completo.
  test.describe("página completa, sin animaciones", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    for (const path of paths) {
      test(path, async ({ page }) => {
        await page.goto(path);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        expect(await violations(page)).toEqual([]);
      });
    }
  });

  // Y tal como la ve la mayoría: con animaciones y, en la home, con la rueda.
  test.describe("con animaciones y rueda", () => {
    for (const path of paths) {
      test(path, async ({ page }) => {
        await page.goto(path);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await scrollThrough(page);
        // Deja terminar las animaciones de entrada antes de revisar.
        await page.waitForTimeout(1800);
        expect(await violations(page)).toEqual([]);
      });
    }
  });
});
