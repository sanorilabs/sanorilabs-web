import { HomeView } from "@/components/home/HomeView";
import { PageTransition } from "@/components/layout/PageTransition";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  lang: "en",
  path: routes.en.home,
  altPath: routes.es.home,
});

export default function Page() {
  return (
    <PageTransition>
      <HomeView lang="en" />
    </PageTransition>
  );
}
