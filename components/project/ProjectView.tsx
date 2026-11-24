import Link from "next/link";
import type { ReactNode } from "react";
import { SnTile } from "@/components/brand/SnTile";
import { Decode } from "@/components/motion/Decode";
import { Reveal } from "@/components/motion/Reveal";
import { RevealLines } from "@/components/motion/RevealLines";
import { Rule } from "@/components/motion/Rule";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SpecList } from "@/components/ui/SpecList";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getContent } from "@/content";
import { getNextProject, type ProjectMeta } from "@/content/projects";
import type { Lang } from "@/content/types";
import { projectKind, projectSummary, tileProps } from "@/lib/projects";
import { projectPath } from "@/lib/routes";
import { CoverTransition } from "./CoverTransition";
import { PressCheck } from "./PressCheck";
import { ProjectCover } from "./ProjectCover";

function TextBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="pb-6">
      <Rule />
      <h2 className="label mt-6 text-muted">
        <Decode>{label}</Decode>
      </h2>
      <div className="mt-3 text-lg">{children}</div>
    </section>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-grid underline-offset-4 hover:text-cobalt hover:decoration-cobalt"
    >
      {children}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

/** Página de un proyecto propio (EXP) o de un caso de estudio (CLI). */
export function ProjectView({
  lang,
  project,
}: {
  lang: Lang;
  project: ProjectMeta;
}) {
  const t = getContent(lang);
  const summary = projectSummary(lang, project);
  const kind = projectKind(lang, project);
  const next = getNextProject(project.slug);

  let body: ReactNode = null;
  let aside: ReactNode;

  if (project.type === "exp") {
    const text = t.projects[project.slug];
    if (text.blocks.length > 0) {
      body = text.blocks.map((block) => (
        <TextBlock key={block.label} label={block.label}>
          <p>{block.text}</p>
        </TextBlock>
      ));
    }
    aside = (
      <SpecList
        layout={text.blocks.length > 0 ? "stacked" : "rows"}
        items={[
          ...text.specs,
          {
            label: t.ui.links,
            value: (
              <ul className="space-y-1">
                {project.links.map((link) => (
                  <li key={link.href}>
                    <ExternalLink href={link.href}>
                      {link.label ?? t.ui.viewSite}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            ),
          },
        ]}
      />
    );
  } else {
    const text = t.cases[project.slug];
    body = (
      <>
        <TextBlock label={t.caseLabels.client}>
          <p>{text.client}</p>
        </TextBlock>
        <TextBlock label={t.caseLabels.challenge}>
          <p>{text.challenge}</p>
        </TextBlock>
        <TextBlock label={t.caseLabels.done}>
          <PressCheck items={text.steps} />
        </TextBlock>
        <TextBlock label={t.caseLabels.result}>
          <p>{text.result}</p>
        </TextBlock>
      </>
    );
    aside = (
      <>
        <SpecList
          layout="stacked"
          items={[{ label: t.caseLabels.stack, value: text.stack }]}
        />
        <div className="mt-6">
          <ButtonLink href={project.links[0].href}>
            {t.ui.viewSite} ↗
          </ButtonLink>
        </div>
      </>
    );
  }

  return (
    <article>
      <header className="container-site pt-10 md:pt-16">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 pb-4">
          <p className="label">
            <span className="font-medium">
              <Decode>{project.code}</Decode>
            </span>
            {kind && <span className="text-muted"> · {kind}</span>}
          </p>
          <span className="ml-auto">
            <StatusBadge status={project.status} lang={lang} />
          </span>
        </div>
        <Rule />

        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:gap-10">
          <SnTile
            {...tileProps(project)}
            size={128}
            decorative
            className="size-24 shrink-0 md:size-32"
          />
          <RevealLines
            as="h1"
            className="text-[clamp(2.5rem,8vw,6rem)] leading-[0.95]"
          >
            {project.name}
          </RevealLines>
        </div>

        {summary && (
          <Reveal
            as="p"
            index={2}
            className="mt-8 max-w-3xl text-xl md:text-2xl"
          >
            {summary}
          </Reveal>
        )}
      </header>

      <div className="container-site mt-10 md:mt-14">
        <CoverTransition slug={project.slug}>
          <div className="border border-grid">
            <ProjectCover
              project={project}
              sizes="(min-width: 1184px) 1120px, 100vw"
              eager
            />
          </div>
        </CoverTransition>
      </div>

      <div className="container-site mt-12 grid gap-12 md:mt-20 md:grid-cols-12">
        {body && <div className="md:col-span-7">{body}</div>}
        <div
          className={body ? "md:col-span-4 md:col-start-9" : "md:col-span-8"}
        >
          {aside}
        </div>
      </div>

      <nav aria-label={t.ui.nextProject} className="container-site mt-20 md:mt-28">
        <Rule />
        <Link
          href={projectPath(lang, next.slug)}
          prefetch={true}
          className="group flex items-center justify-between gap-6 py-8"
        >
          <span>
            <span className="label block text-muted">
              {t.ui.nextProject} · {next.code}
            </span>
            <span className="mt-2 block text-3xl font-semibold tracking-[-0.02em] group-hover:text-cobalt md:text-5xl">
              {next.name}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="text-3xl transition-transform duration-300 group-hover:translate-x-2 group-hover:text-cobalt md:text-5xl"
          >
            →
          </span>
        </Link>
        <Rule />
      </nav>
    </article>
  );
}
