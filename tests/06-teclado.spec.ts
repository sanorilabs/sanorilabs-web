import { content, expect, missingRoutes, siteRoutes, test } from "./site";

interface FocusStep {
  /** Índice del elemento entre los clicables de la página; -1 si no es uno. */
  index: number;
  label: string;
  /** Hay un contorno de foco dibujado. */
  outlined: boolean;
  /** El elemento (y lo que lo contiene) es visible y está en pantalla. */
  shown: boolean;
}

// 6. Teclado: todo lo clicable recibe foco, el foco se ve y el salto funciona.
test.describe("6. Teclado", () => {
  const pages = [
    ...siteRoutes.map((route) => ({ lang: route.lang, path: route.path })),
    ...missingRoutes,
  ];

  for (const { lang, path } of pages) {
    test(`${path}: Tab recorre todo lo clicable con el foco visible`, async ({
      page,
    }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      // Numera todo lo que se puede activar y está a la vista.
      const labels = await page.evaluate(() => {
        const selector =
          "a[href], button:not([disabled]), summary, input, select, textarea, [tabindex]:not([tabindex='-1'])";
        const items = Array.from(
          document.querySelectorAll<HTMLElement>(selector),
        ).filter((el) =>
          el.checkVisibility({ visibilityProperty: true, opacityProperty: false }),
        );
        items.forEach((el, index) => {
          el.dataset.tabIndexTest = String(index);
        });
        return items.map(
          (el) =>
            (el.getAttribute("aria-label") || el.textContent || el.tagName)
              .trim()
              .slice(0, 40) || el.tagName,
        );
      });
      expect(labels.length).toBeGreaterThan(3);

      const steps: FocusStep[] = [];
      for (let i = 0; i < labels.length + 5; i++) {
        await page.keyboard.press("Tab");
        const step = await page.evaluate(async (): Promise<FocusStep | null> => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;

          // Un bloque que aún no entraba en pantalla aparece al recibir foco:
          // se le da un momento antes de comprobar que se ve.
          const visible = () => {
            let opacity = 1;
            for (let node: HTMLElement | null = el; node; node = node.parentElement) {
              opacity *= Number(getComputedStyle(node).opacity);
            }
            const box = el.getBoundingClientRect();
            return (
              opacity > 0.9 &&
              box.width > 0 &&
              box.height > 0 &&
              box.bottom > 0 &&
              box.top < window.innerHeight &&
              box.right > 0 &&
              box.left < window.innerWidth
            );
          };
          const limit = performance.now() + 2500;
          while (!visible() && performance.now() < limit) {
            await new Promise((resolve) => setTimeout(resolve, 50));
          }

          const style = getComputedStyle(el);
          return {
            index: Number(el.dataset.tabIndexTest ?? -1),
            label: (el.getAttribute("aria-label") || el.textContent || el.tagName)
              .trim()
              .slice(0, 40),
            outlined:
              style.outlineStyle !== "none" &&
              parseFloat(style.outlineWidth) >= 1,
            shown: visible(),
          };
        });
        // El foco salió de la página (barra del navegador): fin del recorrido.
        if (!step) break;
        if (steps.some((previous) => previous.index === step.index)) break;
        steps.push(step);
      }

      // El primer Tab cae en "Saltar al contenido" y se ve.
      expect(steps[0]?.label).toBe(content[lang].nav.skip);

      const reached = new Set(steps.map((step) => step.index));
      const missed = labels.filter((_, index) => !reached.has(index));
      expect(missed, "elementos clicables sin foco").toEqual([]);

      const invisible = steps
        .filter((step) => !step.outlined || !step.shown)
        .map((step) => step.label);
      expect(invisible, "elementos con el foco sin verse").toEqual([]);
    });

    test(`${path}: "Saltar al contenido" lleva el foco al contenido`, async ({
      page,
    }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      await page.keyboard.press("Tab");
      const skip = page.getByRole("link", { name: content[lang].nav.skip });
      await expect(skip).toBeFocused();
      await expect(skip).toBeInViewport();

      await page.keyboard.press("Enter");
      await page.keyboard.press("Tab");

      const insideMain = await page.evaluate(() => {
        const el = document.activeElement;
        const main = document.querySelector("main");
        return !!el && !!main && el !== main && main.contains(el);
      });
      expect(insideMain).toBe(true);
    });
  }
});
