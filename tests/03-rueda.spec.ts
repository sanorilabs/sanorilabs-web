import type { Locator, Page } from "@playwright/test";
import { projects } from "../content/projects";
import { wheel } from "../lib/motion";
import { projectPath } from "../lib/routes";
import { collectScripts, content, expect, hasThree, test } from "./site";

const t = content.es;

/** Nombre del proyecto que la rueda muestra en el centro. */
const activeName = (page: Page) =>
  page.locator(".wheel-stage li:not([aria-hidden]) h3");

/** Deja la rueda fija bajo el menú, en su primer proyecto, y lista para usar. */
async function openWheel(page: Page) {
  await page.goto("/");
  await expect(page.locator(".wheel-stage canvas")).toBeVisible({
    timeout: 15_000,
  });
  await page.evaluate(() => {
    const stage = document.querySelector<HTMLElement>(".wheel-stage")!;
    window.scrollTo(0, stage.getBoundingClientRect().top + window.scrollY - 64);
  });
  await expect(activeName(page)).toHaveText(projects[0].name);
  // El salto anterior se hizo por código. El scroll suave tarda un instante
  // en enterarse; una persona nunca gira la rueda en ese mismo instante.
  await page.waitForTimeout(400);
}

/**
 * Clic con el ratón en el centro del elemento, como lo hace una persona.
 * locator.click() no sirve dentro de la rueda: cuando Playwright reintenta
 * un clic mueve la página para "centrar" el elemento, y como la rueda está
 * fija en pantalla ese empujón la cambia de proyecto. Nadie puede hacer eso
 * con un ratón.
 */
async function clickAt(page: Page, target: Locator) {
  await expect(target).toBeVisible();
  const box = (await target.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

// 3. Escritorio: la rueda de proyectos.
test.describe("3. Rueda (escritorio)", () => {
  test("la rueda carga, con three.js y en lugar de la grilla", async ({
    page,
  }) => {
    const scripts = collectScripts(page);
    await openWheel(page);

    await expect(page.locator(".wheel-stage")).toBeVisible();
    await expect(page.locator(".lab-grid")).toBeHidden();
    expect(hasThree(await scripts())).toBe(true);
    await expect(page.locator(".wheel-stage")).toContainText("01 / 04");
  });

  test("gira con el scroll", async ({ page }) => {
    await openWheel(page);
    const box = (await page.locator(".wheel-stage canvas").boundingBox())!;
    await page.mouse.move(box.x + 200, box.y + 150);

    // Cada proyecto ocupa wheel.stepVh % del alto de la ventana.
    const step = Math.round(
      (page.viewportSize()!.height * wheel.stepVh) / 100,
    );
    await page.mouse.wheel(0, step);
    await expect(activeName(page)).toHaveText(projects[1].name);

    await page.mouse.wheel(0, step * 2);
    await expect(activeName(page)).toHaveText(projects[3].name);

    await page.mouse.wheel(0, -step);
    await expect(activeName(page)).toHaveText(projects[2].name);
  });

  test("gira al arrastrar", async ({ page }) => {
    await openWheel(page);
    const box = (await page.locator(".wheel-stage canvas").boundingBox())!;
    const x = box.x + 420;
    const y = box.y + 120;

    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 320, y, { steps: 16 });
    await page.mouse.up();

    await expect(activeName(page)).toHaveText(projects[1].name);
  });

  test("las flechas cambian de proyecto", async ({ page }) => {
    await openWheel(page);
    const previous = page.getByRole("button", { name: t.ui.previous });
    const next = page.getByRole("button", { name: t.ui.next });

    await expect(previous).toBeDisabled();
    await clickAt(page, next);
    await expect(activeName(page)).toHaveText(projects[1].name);
    await clickAt(page, previous);
    await expect(activeName(page)).toHaveText(projects[0].name);
  });

  for (const [index, project] of projects.entries()) {
    test(`"Ver proyecto" lleva a ${project.name}`, async ({ page }) => {
      await openWheel(page);
      const next = page.getByRole("button", { name: t.ui.next });
      for (let i = 0; i < index; i++) {
        await clickAt(page, next);
        await expect(activeName(page)).toHaveText(projects[i + 1].name);
      }
      // Deja que la rueda termine de asentarse antes de entrar al proyecto.
      await expect(page.locator(".wheel-stage")).toContainText(
        `${String(index + 1).padStart(2, "0")} / 04`,
      );

      await clickAt(
        page,
        page
          .locator(".wheel-stage li:not([aria-hidden])")
          .getByRole("link", { name: t.ui.viewProject }),
      );

      await expect(page).toHaveURL(projectPath("es", project.slug));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        project.name,
      );
    });
  }

  test('"Ver proyecto" lleva flecha en la rueda y en la grilla', async ({
    page,
  }) => {
    await openWheel(page);
    const label = `${t.ui.viewProject} →`;

    await expect(
      page.locator(".wheel-stage li:not([aria-hidden]) a"),
    ).toHaveText(label);

    await clickAt(page, page.getByRole("button", { name: t.ui.viewAsGrid }));
    const cells = page.locator(".lab-grid li");
    await expect(cells).toHaveCount(projects.length);
    for (const cell of await cells.all()) {
      await expect(cell).toContainText(label);
    }
  });

  test("el fondo toma un tinte suave del color de cada proyecto", async ({
    page,
  }) => {
    await openWheel(page);
    const stage = page.locator(".wheel-stage .sticky");
    const next = page.getByRole("button", { name: t.ui.next });
    const paper = "rgb(242, 241, 236)";
    const seen = new Set<string>();

    for (const [index, project] of projects.entries()) {
      if (index > 0) {
        await clickAt(page, next);
        await expect(activeName(page)).toHaveText(project.name);
      }
      // Deja terminar la transición del tinte antes de leer el color.
      await page.waitForTimeout(wheel.tintMs + 200);
      const background = await stage.evaluate(
        (node) => getComputedStyle(node).backgroundColor,
      );
      expect(background).not.toBe(paper);

      // Es un tinte, no el color pleno: cada canal queda cerca del papel.
      const channels = background.match(/[\d.]+/g)!.slice(0, 3).map(Number);
      const srgb = background.startsWith("color(srgb")
        ? channels.map((value) => value * 255)
        : channels;
      [242, 241, 236].forEach((base, i) => {
        expect(Math.abs(srgb[i] - base)).toBeLessThanOrEqual(30);
      });
      seen.add(background);
    }
    // Cada proyecto deja su propio tinte.
    expect(seen.size).toBe(projects.length);
  });

  test('"Ver como grilla" y "Ver como rueda" alternan las vistas', async ({
    page,
  }) => {
    await openWheel(page);

    await clickAt(page, page.getByRole("button", { name: t.ui.viewAsGrid }));
    await expect(page.locator(".lab-grid")).toBeVisible();
    await expect(page.locator(".wheel-stage")).toBeHidden();

    // La elección se recuerda al recargar.
    await page.reload();
    await expect(page.locator(".lab-grid")).toBeVisible();
    await expect(page.locator(".wheel-stage")).toBeHidden();

    await page.getByRole("button", { name: t.ui.viewAsWheel }).click();
    await expect(page.locator(".wheel-stage")).toBeVisible();
    await expect(page.locator(".lab-grid")).toBeHidden();
    await expect(page.locator(".wheel-stage canvas")).toBeVisible({
      timeout: 15_000,
    });
  });
});
