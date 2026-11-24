import { JournalView } from "@/components/journal/JournalView";
import { PageTransition } from "@/components/layout/PageTransition";
import { getContent } from "@/content";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/site";

// Fase 2: todavía sin artículos. Fuera del menú, del sitemap y de Google.
export const metadata = pageMetadata({
  lang: "es",
  path: routes.es.journal,
  altPath: routes.en.journal,
  title: getContent("es").journal.title,
  noindex: true,
});

export default function Page() {
  return (
    <PageTransition>
      <JournalView lang="es" />
    </PageTransition>
  );
}
