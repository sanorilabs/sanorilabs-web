import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { projectPath, routes } from "@/lib/routes";
import { siteUrl } from "@/lib/site";

function absolute(path: string): string {
  return `${siteUrl}${path === "/" ? "" : path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Cada par es la misma página en español y en inglés.
  const pairs: [string, string][] = [
    [routes.es.home, routes.en.home],
    ...projects.map((project): [string, string] => [
      projectPath("es", project.slug),
      projectPath("en", project.slug),
    ]),
    [routes.es.about, routes.en.about],
  ];

  return pairs.flatMap(([es, en]) => {
    const languages = { es: absolute(es), en: absolute(en) };
    return [
      { url: absolute(es), alternates: { languages } },
      { url: absolute(en), alternates: { languages } },
    ];
  });
}
