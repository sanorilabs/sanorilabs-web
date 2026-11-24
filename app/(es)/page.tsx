import { HomeView } from "@/components/home/HomeView";
import { PageTransition } from "@/components/layout/PageTransition";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  lang: "es",
  path: routes.es.home,
  altPath: routes.en.home,
});

export default function Page() {
  return (
    <PageTransition>
      <HomeView lang="es" />
    </PageTransition>
  );
}
