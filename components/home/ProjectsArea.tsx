import { getContent } from "@/content";
import { projects } from "@/content/projects";
import type { Lang } from "@/content/types";
import { projectKind, tileProps } from "@/lib/projects";
import { projectPath, routes } from "@/lib/routes";
import { LabGrid } from "./LabGrid";
import { WheelStage, type WheelItem } from "./WheelStage";

/** La misma URL que genera next/image, a 1080px: textura de la rueda. */
function coverSrc(cover: string): string {
  return `/_next/image?url=${encodeURIComponent(cover)}&w=1080&q=75`;
}

/**
 * Bloque de proyectos de la home. Siempre se renderizan las dos vistas y el
 * CSS muestra una: la grilla (base: celular, sin JavaScript, movimiento
 * reducido) o la rueda (escritorio). Ver globals.css y lib/view-mode.ts.
 */
export function ProjectsArea({ lang }: { lang: Lang }) {
  const t = getContent(lang);
  const anchors = routes[lang].anchors;

  const items: WheelItem[] = projects.map((project) => ({
    slug: project.slug,
    href: projectPath(lang, project.slug),
    type: project.type,
    code: project.code,
    kind: projectKind(lang, project),
    name: project.name,
    status: project.status,
    statusLabel: t.status[project.status],
    tile: tileProps(project),
    cover: coverSrc(project.cover),
  }));

  return (
    <div id={anchors.projects} className="projects-area mt-24 md:mt-32">
      <WheelStage
        items={items}
        projectsAnchor={anchors.projects}
        casesAnchor={anchors.cases}
        labels={{
          title: t.home.projectsTitle,
          exp: t.home.projectsTitle,
          cli: t.home.casesTitle,
          viewProject: t.ui.viewProject,
          viewAsGrid: t.ui.viewAsGrid,
          previous: t.ui.previous,
          next: t.ui.next,
        }}
      />
      <LabGrid lang={lang} />
    </div>
  );
}
