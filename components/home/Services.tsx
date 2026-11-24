import { Reveal } from "@/components/motion/Reveal";
import { RevealLines } from "@/components/motion/RevealLines";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getContent } from "@/content";
import { quoteHref } from "@/content/links";
import type { Lang } from "@/content/types";

export function Services({ lang }: { lang: Lang }) {
  const t = getContent(lang);

  return (
    <section className="container-site mt-24 md:mt-32">
      <RevealLines className="max-w-3xl text-4xl md:text-5xl">
        {t.services.title}
      </RevealLines>

      <ul className="mt-10 grid border-l border-t border-grid md:grid-cols-2">
        {t.services.cards.map((card, index) => (
          <Reveal
            as="li"
            key={card.title}
            index={index}
            className="flex flex-col border-b border-r border-grid bg-white p-6 md:p-8"
          >
            <h3 className="text-2xl">{card.title}</h3>
            <p className="mt-3 text-lg">{card.body}</p>
            <p className="mt-auto pt-8 font-mono text-sm text-muted">
              {card.example}
            </p>
          </Reveal>
        ))}
      </ul>

      <div className="mt-8">
        <ButtonLink href={quoteHref()}>{t.services.cta}</ButtonLink>
      </div>
    </section>
  );
}
