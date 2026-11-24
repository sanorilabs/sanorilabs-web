import { test as base, expect, type Page } from "@playwright/test";
import { en } from "../content/en";
import { es } from "../content/es";
import { projects } from "../content/projects";
import type { Content, Lang } from "../content/types";
import { loader } from "../lib/motion";
import { projectPath, routes } from "../lib/routes";

/** Dominio de producción: el que usan canonical, hreflang y sitemap. */
export const SITE = "https://sanorilabs.com";

export const content: Record<Lang, Content> = { es, en };

export interface SiteRoute {
  lang: Lang;
  path: string;
  /** La misma página en el otro idioma. */
  altPath: string;
  kind: "home" | "project" | "about";
  /** Solo en páginas de proyecto. */
  slug?: string;
}

/** Las 12 páginas públicas del sitio, en español e inglés. */
export const siteRoutes: SiteRoute[] = (["es", "en"] as Lang[]).flatMap(
  (lang) => {
    const other: Lang = lang === "es" ? "en" : "es";
    return [
      {
        lang,
        path: routes[lang].home,
        altPath: routes[other].home,
        kind: "home" as const,
      },
      ...projects.map((project) => ({
        lang,
        path: projectPath(lang, project.slug),
        altPath: projectPath(other, project.slug),
        kind: "project" as const,
        slug: project.slug,
      })),
      {
        lang,
        path: routes[lang].about,
        altPath: routes[other].about,
        kind: "about" as const,
      },
    ];
  },
);

/** URLs que no existen, con el idioma en que debe salir su 404. */
export const missingRoutes: { lang: Lang; path: string }[] = [
  { lang: "es", path: "/no-existe" },
  { lang: "es", path: "/proyectos/no-existe" },
  { lang: "en", path: "/en/does-not-exist" },
  { lang: "en", path: "/en/projects/does-not-exist" },
];

export const absolute = (path: string) => `${SITE}${path === "/" ? "" : path}`;

/** Todos los textos (hojas) de un objeto de contenido. */
export function leafStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(leafStrings);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(leafStrings);
  }
  return [];
}

/**
 * `test` del sitio. Por defecto salta el loader (marca la sesión como ya
 * visitada) para que cada test empiece con la página lista; los tests del
 * loader lo piden con test.use({ skipLoader: false }).
 */
export const test = base.extend<{ skipLoader: boolean }>({
  skipLoader: [true, { option: true }],
  page: async ({ page, skipLoader }, provide) => {
    if (skipLoader) {
      await page.addInitScript((key) => {
        try {
          window.sessionStorage.setItem(key, "1");
        } catch {
          // Sin almacenamiento no hay loader de todos modos.
        }
      }, loader.sessionKey);
    }
    await provide(page);
  },
});

export { expect };

/** Guarda el texto de cada script que descarga la página. */
export function collectScripts(page: Page): () => Promise<string[]> {
  const bodies: Promise<string>[] = [];
  page.on("response", (response) => {
    if (response.request().resourceType() === "script") {
      bodies.push(response.text().catch(() => ""));
    }
  });
  return () => Promise.all(bodies);
}

/** true si alguno de los scripts descargados es three.js. */
export const hasThree = (scripts: string[]) =>
  scripts.some((body) => body.includes("WebGLRenderer"));

/** Recorre la página de arriba abajo para disparar todo lo que carga al scroll. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
}
