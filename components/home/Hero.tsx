import { Cursor } from "@/components/brand/Cursor";
import { Decode } from "@/components/motion/Decode";
import { Reveal } from "@/components/motion/Reveal";
import { RevealLines } from "@/components/motion/RevealLines";
import { Rule } from "@/components/motion/Rule";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getContent } from "@/content";
import type { Lang } from "@/content/types";
import { routes } from "@/lib/routes";

export function Hero({ lang }: { lang: Lang }) {
  const t = getContent(lang);
  const r = routes[lang];

  return (
    <section className="container-site pt-14 md:pt-24">
      <p className="label text-muted">
        <Decode>{t.hero.label}</Decode>
      </p>

      <RevealLines
        as="h1"
        className="mt-6 text-[clamp(2.75rem,10vw,7rem)] leading-[0.95]"
      >
        {t.hero.title}
        <Cursor />
      </RevealLines>

      <Reveal as="p" index={3} className="mt-8 max-w-2xl text-lg md:text-xl">
        {t.hero.subtitle}
      </Reveal>

      <Reveal index={4} className="mt-10 flex flex-wrap gap-4">
        <ButtonLink href={`${r.home}#${r.anchors.projects}`}>
          {t.hero.primaryCta}
        </ButtonLink>
        <ButtonLink
          href={`${r.about}#${r.anchors.contact}`}
          variant="secondary"
        >
          {t.hero.secondaryCta}
        </ButtonLink>
      </Reveal>

      <div className="mt-14 md:mt-20">
        <Rule />
        <ul className="label grid sm:grid-cols-3">
          {t.hero.stats.map((stat) => (
            <li
              key={stat}
              className="border-b border-grid py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0"
            >
              <Decode>{stat}</Decode>
            </li>
          ))}
        </ul>
        <Rule />
      </div>
    </section>
  );
}
