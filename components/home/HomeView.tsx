import type { Lang } from "@/content/types";
import { Hero } from "./Hero";
import { ProjectsArea } from "./ProjectsArea";
import { Services } from "./Services";

export function HomeView({ lang }: { lang: Lang }) {
  return (
    <>
      <Hero lang={lang} />
      <ProjectsArea lang={lang} />
      <Services lang={lang} />
    </>
  );
}
