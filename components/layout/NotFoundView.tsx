import { ButtonLink } from "@/components/ui/ButtonLink";
import { RevealLines } from "@/components/motion/RevealLines";
import { getContent } from "@/content";
import type { Lang } from "@/content/types";
import { routes } from "@/lib/routes";

export function NotFoundView({ lang }: { lang: Lang }) {
  const t = getContent(lang);

  return (
    <section className="container-site py-24 md:py-32">
      {/* React sube este <title> al <head>. Va aquí y no en `metadata` porque
          el 404 se dibuja en el navegador, donde `metadata` no llega. */}
      <title>{`${t.notFound.title} — ${t.meta.siteName}`}</title>
      <p className="label font-medium text-cobalt">404</p>
      <RevealLines
        as="h1"
        className="mt-4 text-[clamp(2.5rem,8vw,6rem)] leading-[0.95]"
      >
        {t.notFound.title}
      </RevealLines>
      <div className="mt-10">
        <ButtonLink href={routes[lang].home} variant="secondary">
          {t.notFound.cta}
        </ButtonLink>
      </div>
    </section>
  );
}
