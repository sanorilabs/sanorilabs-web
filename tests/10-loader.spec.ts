import { routes } from "../lib/routes";
import { expect, test } from "./site";

declare global {
  interface Window {
    __loaderTimes?: { shown: number | null; hidden: number | null };
  }
}

// 10. Loader: solo en la primera carga de la sesión y máximo 1.5 s.
test.describe("10. Loader", () => {
  // Estos tests necesitan una sesión nueva de verdad.
  test.use({ skipLoader: false });

  test("aparece en la primera carga y desaparece en máximo 1.5 s", async ({
    page,
  }) => {
    // Cronómetro dentro de la página: anota cuándo se ve y cuándo deja de verse.
    await page.addInitScript(() => {
      const times: { shown: number | null; hidden: number | null } = {
        shown: null,
        hidden: null,
      };
      window.__loaderTimes = times;
      const watch = () => {
        const loader = document.querySelector(".site-loader");
        if (loader) {
          const style = getComputedStyle(loader);
          const visible =
            style.display !== "none" && style.visibility !== "hidden";
          if (visible && times.shown === null) times.shown = performance.now();
          if (!visible && times.shown !== null && times.hidden === null) {
            times.hidden = performance.now();
            return;
          }
        }
        requestAnimationFrame(watch);
      };
      requestAnimationFrame(watch);
    });

    await page.goto("/", { waitUntil: "commit" });
    const loader = page.locator(".site-loader");
    await expect(loader).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-loader", "on");

    await expect(loader).toBeHidden({ timeout: 4000 });
    const times = await page.evaluate(() => window.__loaderTimes!);
    expect(times.shown).not.toBeNull();
    expect(times.hidden).not.toBeNull();
    expect(times.hidden! - times.shown!).toBeLessThanOrEqual(1500);

    // Al quitarse deja la página a la vista.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("no vuelve a aparecer en la misma sesión", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".site-loader")).toBeHidden({ timeout: 4000 });

    for (const path of [routes.es.about, routes.es.home, routes.en.home]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      // El script del loader corre antes que esto: si fuera a salir, la
      // marca ya estaría puesta.
      await expect(page.locator("html")).not.toHaveAttribute("data-loader", /.*/);
      await expect(page.locator(".site-loader")).toBeHidden();
    }

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).not.toHaveAttribute("data-loader", /.*/);
  });

  test("bajo el loader, el título del hero ya está pintado desde el HTML", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "commit" });
    await expect(page.locator(".site-loader")).toBeVisible();

    // Nada lo oculta a la espera de animarse: ni opacidad ni visibility.
    const title = page.getByRole("heading", { level: 1 });
    await expect(title).toHaveCSS("visibility", "visible");
    await expect(title).toHaveCSS("opacity", "1");
    await expect(title).toHaveText(/\S/);
  });

  test("una sesión nueva vuelve a verlo", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/", { waitUntil: "commit" });
    await expect(page.locator(".site-loader")).toBeVisible();
    await context.close();
  });
});

// Sin loader (cualquier carga después de la primera de la sesión).
test.describe("10. Loader · carga normal", () => {
  test("el título del hero se queda quieto: no se oculta para volver a entrar", async ({
    page,
  }) => {
    await page.goto("/");
    const title = page.getByRole("heading", { level: 1 });
    await expect(title).toBeVisible();
    await expect(title).toHaveCSS("opacity", "1");

    // Con el JavaScript ya cargado sigue siendo el mismo texto del HTML,
    // sin partirse en líneas para animarse.
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);
    await expect(title.locator(".reveal-line")).toHaveCount(0);
    await expect(title).toBeVisible();
  });
});
