import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { notFound } from "next/navigation";
import { ProjectView } from "@/components/project/ProjectView";
import { getProject, projects } from "@/content/projects";
import { coverAlt, projectDescription } from "@/lib/projects";
import { projectPath } from "@/lib/routes";
import { pageMetadata } from "@/lib/site";

type Props = PageProps<"/proyectos/[slug]">;

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
    lang: "es",
    path: projectPath("es", project.slug),
    altPath: projectPath("en", project.slug),
    title: project.name,
    description: projectDescription("es", project),
    image: { url: project.og, alt: coverAlt("es", project) },
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <PageTransition>
      <ProjectView lang="es" project={project} />
    </PageTransition>
  );
}
