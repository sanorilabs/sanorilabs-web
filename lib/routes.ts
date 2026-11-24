import type { Lang } from "@/content/types";

interface LangRoutes {
  home: string;
  about: string;
  journal: string;
  projectBase: string;
  anchors: { projects: string; cases: string; contact: string };
}

export const routes: Record<Lang, LangRoutes> = {
  es: {
    home: "/",
    about: "/sobre-mi",
    journal: "/bitacora",
    projectBase: "/proyectos",
    anchors: { projects: "proyectos", cases: "casos", contact: "contacto" },
  },
  en: {
    home: "/en",
    about: "/en/about",
    journal: "/en/journal",
    projectBase: "/en/projects",
    anchors: { projects: "projects", cases: "case-studies", contact: "contact" },
  },
};

export function projectPath(lang: Lang, slug: string): string {
  return `${routes[lang].projectBase}/${slug}`;
}

/** La misma página en el otro idioma. Si no hay equivalente, su home. */
export function alternatePath(pathname: string, from: Lang): string {
  const to: Lang = from === "es" ? "en" : "es";
  const source = routes[from];
  const target = routes[to];
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === source.about) return target.about;
  if (path === source.journal) return target.journal;
  if (path.startsWith(`${source.projectBase}/`)) {
    const slug = path.slice(source.projectBase.length + 1);
    if (slug && !slug.includes("/")) return projectPath(to, slug);
  }
  return target.home;
}
