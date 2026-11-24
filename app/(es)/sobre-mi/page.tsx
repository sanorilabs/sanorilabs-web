import { AboutView } from "@/components/about/AboutView";
import { PageTransition } from "@/components/layout/PageTransition";
import { getContent } from "@/content";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  lang: "es",
  path: routes.es.about,
  altPath: routes.en.about,
  title: getContent("es").about.title,
});

export default function Page() {
  return (
    <PageTransition>
      <AboutView lang="es" />
    </PageTransition>
  );
}
