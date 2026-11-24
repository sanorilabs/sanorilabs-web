import { en } from "../content/en";
import { es } from "../content/es";
import type { Lang } from "../content/types";
import {
  content,
  expect,
  leafStrings,
  missingRoutes,
  siteRoutes,
  test,
} from "./site";

/**
 * Claves que pueden existir en un idioma y no en el otro, con su motivo.
 * - cases.*.summary: el resumen de una línea de cada caso solo existe en
 *   inglés (son las frases que diste para /en); en español no se pidió.
 */
const OPTIONAL = [/^cases\.[^.]+\.summary$/];

/** Rutas de todas las claves de un objeto: "hero.title", "hero.stats.0"... */
function keyPaths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => keyPaths(item, `${prefix}${index}.`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      keyPaths(item, `${prefix}${key}.`),
    );
  }
  return [prefix.slice(0, -1)];
}

const required = (paths: string[]) =>
  paths.filter((path) => !OPTIONAL.some((rule) => rule.test(path))).sort();

// TODO y undefined van en mayúsculas/minúsculas exactas: "todo" es una
// palabra normal en español.
const PLACEHOLDER =
  /\[pendiente\]|\[pending\]|\bTODO\b|[Ll]orem ipsum|\bundefined\b|\[object Object\]/;

/**
 * Textos que solo existen en un idioma. No cuentan los iguales en ambos ni
 * los que forman parte de un texto del otro idioma: "Next" (la flecha, en
 * inglés) está dentro de "Next.js", y "Español" dentro de "español, inglés".
 */
function onlyIn(lang: Lang): string[] {
  const other = leafStrings(content[lang === "es" ? "en" : "es"]).map((text) =>
    text.toLocaleLowerCase(),
  );
  return [...new Set(leafStrings(content[lang]))].filter(
    (text) =>
      text.trim().length >= 4 &&
      !other.some((otherText) =>
        otherText.includes(text.trim().toLocaleLowerCase()),
      ),
  );
}

/** ¿Aparece `text` como frase completa (no como parte de otra palabra)? */
function appears(text: string, pageText: string): boolean {
  const escaped = text
    .trim()
    .toLocaleLowerCase()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\s+/g, "\\s+");
  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "u").test(
    pageText,
  );
}

// 9. Textos: es.ts y en.ts completos, sin pendientes y sin mezclar idiomas.
test.describe("9. Textos", () => {
  // Sin animaciones: el efecto decode baraja letras mientras corre.
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("es.ts y en.ts tienen las mismas claves", () => {
    expect(required(keyPaths(en))).toEqual(required(keyPaths(es)));
  });

  test("ningún texto está vacío ni pendiente", () => {
    for (const lang of ["es", "en"] as Lang[]) {
      const bad = leafStrings(content[lang]).filter(
        (text) => text.trim() === "" || PLACEHOLDER.test(text),
      );
      expect(bad, `textos vacíos o pendientes en ${lang}.ts`).toEqual([]);
    }
  });

  const pages = [
    ...siteRoutes.map((route) => ({ lang: route.lang, path: route.path })),
    ...missingRoutes,
  ];

  for (const { lang, path } of pages) {
    test(`${path} está entero en ${lang}, sin textos pendientes`, async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      const visible = await page.locator("body").innerText();
      const title = await page.title();
      // Las páginas 404 no llevan description.
      const description = await page.evaluate(
        () =>
          document
            .querySelector('meta[name="description"]')
            ?.getAttribute("content") ?? "",
      );
      const everything = `${visible}\n${title}\n${description}`;
      expect(title.trim().length).toBeGreaterThan(0);

      expect(PLACEHOLDER.test(everything), "texto pendiente a la vista").toBe(
        false,
      );

      // Las etiquetas en mono se ven en mayúsculas: se compara sin distinguir.
      const lower = everything.toLocaleLowerCase();
      const foreign = onlyIn(lang === "es" ? "en" : "es").filter((text) =>
        appears(text, lower),
      );
      expect(foreign, `textos del otro idioma en ${path}`).toEqual([]);
    });
  }
});
