import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { notFound } from "next/navigation";
import { ProjectView } from "@/components/project/ProjectView";
import { getProject, projects } from "@/content/projects";
import { projectDescription } from "@/lib/projects";
import { projectPath } from "@/lib/routes";
import { pageMetadata } from "@/lib/site";

type Props = PageProps<"/en/projects/[slug]">;

// El contenido depende del slug, así que no hay un cascarón común que mostrar
// antes. Los enlaces a estas páginas usan prefetch completo (prefetch={true}),
// por eso la navegación sigue siendo inmediata.
export const instant = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return pageMetadata({
    lang: "en",
    path: projectPath("en", project.slug),
    altPath: projectPath("es", project.slug),
    title: project.name,
    description: projectDescription("en", project),
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <PageTransition>
      <ProjectView lang="en" project={project} />
    </PageTransition>
  );
}
