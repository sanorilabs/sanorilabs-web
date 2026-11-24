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

/**
 * Lo que oye un lector de pantalla: el árbol de accesibilidad como texto.
 * Las letras de dentro de una casilla Sn son dibujo y no deben aparecer
 * pegadas ("00LABSSnSanori", "01LABSSnCasora").
 */
const TILE_LETTERS = /LABS\s*Sn|\d\d\s*LABS|CLI-\d\d\s*LABS/;

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

  test.describe("la casilla Sn no se lee letra por letra", () => {
    for (const path of paths) {
      test(path, async ({ page }) => {
        await page.goto(path);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

        const spoken = await page.locator("body").ariaSnapshot();
        expect(spoken).not.toMatch(TILE_LETTERS);

        // Cada casilla es decorativa (aria-hidden) o una imagen con nombre.
        const tiles = await page
          .locator('svg[viewBox="0 0 100 100"]')
          .evaluateAll((nodes) =>
            nodes.map((node) => ({
              hidden:
                node.getAttribute("aria-hidden") === "true" ||
                !!node.closest('[aria-hidden="true"]'),
              role: node.getAttribute("role"),
              label: node.getAttribute("aria-label"),
            })),
          );
        expect(tiles.length).toBeGreaterThan(0);
        for (const tile of tiles) {
          if (tile.hidden) continue;
          expect(tile.role).toBe("img");
          expect(tile.label).toMatch(/^Sn \S+, \S/);
        }
      });
    }

    test("el loader no deja texto en el HTML", async ({ page }) => {
      await page.goto("/");
      const loader = page.locator(".site-loader");
      await expect(loader).toHaveCount(1);
      expect((await loader.evaluate((node) => node.textContent)) ?? "").toBe("");
    });
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
