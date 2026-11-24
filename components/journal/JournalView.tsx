import { StatusBadge } from "@/components/ui/StatusBadge";
import { RevealLines } from "@/components/motion/RevealLines";
import { getContent } from "@/content";
import type { Lang } from "@/content/types";

/** Bitácora: ruta preparada para la fase 2. Sin enlace en el menú. */
export function JournalView({ lang }: { lang: Lang }) {
  const t = getContent(lang);

  return (
    <section className="container-site py-24 md:py-32">
      <StatusBadge status="preparing" lang={lang} />
      <RevealLines
        as="h1"
        className="mt-4 text-[clamp(2.5rem,8vw,6rem)] leading-[0.95]"
      >
        {t.journal.title}
      </RevealLines>
    </section>
  );
}
