import Link from "next/link";
import type { ReactNode } from "react";
import { SnTile } from "@/components/brand/SnTile";
import { Decode } from "@/components/motion/Decode";
import { Reveal } from "@/components/motion/Reveal";
import { RevealLines } from "@/components/motion/RevealLines";
import { CoverTransition } from "@/components/project/CoverTransition";
import { ProjectCover } from "@/components/project/ProjectCover";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ViewProjectLabel } from "@/components/ui/ViewProjectLabel";
import { getContent } from "@/content";
import { projects, type ProjectMeta } from "@/content/projects";
import type { Lang } from "@/content/types";
import { projectKind, projectSummary, tileProps } from "@/lib/projects";
import { projectPath, routes } from "@/lib/routes";
import { ViewToggle } from "./ViewToggle";

function ProjectCell({
  project,
  lang,
  index,
}: {
  project: ProjectMeta;
  lang: Lang;
  index: number;
}) {
  const t = getContent(lang);
  const summary = projectSummary(lang, project);
  const kind = projectKind(lang, project);

  return (
    <Reveal
      as="li"
      index={index}
      className="group relative flex flex-col border-b border-r border-grid bg-white"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-grid px-5 py-3">
        <p className="label">
          <span className="font-medium">
            <Decode>{project.code}</Decode>
          </span>
          {kind && <span className="text-muted"> · {kind}</span>}
        </p>
        <StatusBadge status={project.status} lang={lang} />
      </div>

      <CoverTransition slug={project.slug} source="grid">
        <ProjectCover
          project={project}
          sizes="(min-width: 768px) 560px, 100vw"
        />
      </CoverTransition>

      <div className="flex flex-1 gap-5 border-t border-grid p-5">
        <SnTile
          {...tileProps(project)}
          size={72}
          decorative
          className="shrink-0"
        />
        <div className="flex flex-1 flex-col">
          <h3 className="text-2xl">
            <Link
              href={projectPath(lang, project.slug)}
              prefetch={true}
              className="after:absolute after:inset-0"
            >
              {project.name}
            </Link>
          </h3>
          {summary && <p className="mt-2 text-muted">{summary}</p>}
          <p aria-hidden="true" className="label mt-auto pt-4 text-cobalt">
            <ViewProjectLabel text={t.ui.viewProject} />
          </p>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-cobalt transition-transform duration-300 group-focus-within:scale-x-100 group-hover:scale-x-100"
      />
    </Reveal>
  );
}

interface GroupProps {
  /** Ancla de la sección, si la tiene. */
  id?: string;
  /** Botón a la derecha de la etiqueta (cambiar de vista). */
  action?: ReactNode;
  /** false = primera sección del bloque: sin margen superior propio. */
  spaced?: boolean;
  code: string;
  title: string;
  intro: string;
  items: ProjectMeta[];
  lang: Lang;
}

function Group({
  id,
  action,
  spaced = true,
  code,
  title,
  intro,
  items,
  lang,
}: GroupProps) {
  return (
    <section
      id={id}
      className={`container-site ${spaced ? "mt-24 md:mt-32" : ""}`}
    >
      <div className="flex min-h-9 items-center justify-between gap-4">
        <p className="label font-medium text-cobalt">
          <Decode>{code}</Decode>
        </p>
        {action}
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-12 md:items-end">
        <div className="md:col-span-5">
          <RevealLines className="text-4xl md:text-5xl">{title}</RevealLines>
        </div>
        <Reveal
          as="p"
          index={1}
          className="text-lg text-muted md:col-span-6 md:col-start-7"
        >
          {intro}
        </Reveal>
      </div>

      <ul className="mt-10 grid border-l border-t border-grid md:grid-cols-2">
        {items.map((project, index) => (
          <ProjectCell
            key={project.slug}
            project={project}
            lang={lang}
            index={index}
          />
        ))}
      </ul>
    </section>
  );
}

/**
 * Lab grid: los cuatro proyectos en una retícula de líneas de 1px.
 * Es la vista base de la home (sin JavaScript, celular, movimiento reducido).
 */
export function LabGrid({ lang }: { lang: Lang }) {
  const t = getContent(lang);
  const anchors = routes[lang].anchors;

  return (
    <div className="lab-grid">
      <Group
        spaced={false}
        action={
          <ViewToggle
            to="wheel"
            label={t.ui.viewAsWheel}
            anchor={anchors.projects}
          />
        }
        code="EXP"
        title={t.home.projectsTitle}
        intro={t.home.projectsIntro}
        items={projects.filter((project) => project.type === "exp")}
        lang={lang}
      />
      <Group
        id={anchors.cases}
        code="CLI"
        title={t.home.casesTitle}
        intro={t.home.casesIntro}
        items={projects.filter((project) => project.type === "cli")}
        lang={lang}
      />
    </div>
  );
}
