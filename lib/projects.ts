import { getContent } from "@/content";
import type { ProjectMeta } from "@/content/projects";
import type { Lang } from "@/content/types";

/** Props de la casilla: número para proyectos propios, código para clientes. */
export function tileProps(project: ProjectMeta) {
  return project.type === "exp"
    ? { number: project.tileNumber, label: project.tileLabel }
    : { code: project.code, label: project.tileLabel };
}

/** Frase corta del proyecto. Puede no existir (casos en español). */
export function projectSummary(
  lang: Lang,
  project: ProjectMeta,
): string | undefined {
  const t = getContent(lang);
  return project.type === "exp"
    ? t.projects[project.slug].lead
    : t.cases[project.slug].summary;
}

/** Giro del cliente. Solo casos. */
export function projectKind(
  lang: Lang,
  project: ProjectMeta,
): string | undefined {
  return project.type === "cli"
    ? getContent(lang).cases[project.slug].kind
    : undefined;
}

/** Descripción para buscadores y para compartir. */
export function projectDescription(lang: Lang, project: ProjectMeta): string {
  const t = getContent(lang);
  if (project.type === "exp") return t.projects[project.slug].lead;
  const text = t.cases[project.slug];
  return text.summary ?? text.client;
}

/** Texto alternativo de la portada de un proyecto. */
export function coverAlt(lang: Lang, project: ProjectMeta): string {
  return getContent(lang).ui.coverAlt.replace("{name}", project.name);
}

/**
 * Una línea para presentar el proyecto en la rueda. Los casos en español no
 * tienen resumen propio (`summary`), así que usan su resultado.
 */
export function projectTeaser(lang: Lang, project: ProjectMeta): string {
  const t = getContent(lang);
  if (project.type === "exp") return t.projects[project.slug].lead;
  const text = t.cases[project.slug];
  return text.summary ?? text.result;
}
