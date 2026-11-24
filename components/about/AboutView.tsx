import { Reveal } from "@/components/motion/Reveal";
import { RevealLines } from "@/components/motion/RevealLines";
import { Rule } from "@/components/motion/Rule";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getContent } from "@/content";
import { contactLinks, links, profileLinks } from "@/content/links";
import type { Lang, Rich } from "@/content/types";
import { routes } from "@/lib/routes";
import { Telemetry } from "./Telemetry";

function RichText({ parts }: { parts: Rich }) {
  return (
    <>
      {parts.map((part, index) =>
        typeof part === "string" ? (
          part
        ) : (
          <span key={index} className="font-semibold text-cobalt">
            {part.hl}
          </span>
        ),
      )}
    </>
  );
}

/** Sobre mí: texto, ficha en mono y contacto. */
export function AboutView({ lang }: { lang: Lang }) {
  const t = getContent(lang);
  const social = contactLinks();
  const profiles = profileLinks();

  return (
    <>
      <section className="container-site pt-10 md:pt-16">
        <RevealLines
          as="h1"
          className="text-[clamp(2.5rem,8vw,6rem)] leading-[0.95]"
        >
          {t.about.title}
        </RevealLines>

        <div className="mt-10 grid gap-12 md:mt-14 md:grid-cols-12">
          <div className="space-y-6 text-lg md:col-span-7 md:text-xl">
            {t.about.paragraphs.map((paragraph, index) => (
              <Reveal as="p" key={index} index={index + 1}>
                <RichText parts={paragraph} />
              </Reveal>
            ))}
          </div>

          <div className="md:col-span-5">
            <Telemetry lang={lang} />
          </div>
        </div>
      </section>

      <section
        id={routes[lang].anchors.contact}
        className="container-site mt-24 md:mt-32"
      >
        <Rule />
        <div className="pt-10 md:pt-14">
          <RevealLines className="max-w-4xl text-4xl md:text-6xl">
            {t.contact.title}
          </RevealLines>

          <p className="label mt-10 text-muted">{t.contact.email}</p>
          <a
            href={`mailto:${links.email}`}
            className="mt-2 inline-block break-all font-mono text-xl underline decoration-cobalt decoration-2 underline-offset-8 hover:text-cobalt md:text-3xl"
          >
            {links.email}
          </a>

          {profiles.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-4">
              {profiles.map((profile) => (
                <li key={profile.id}>
                  <ButtonLink href={profile.href} variant="secondary">
                    {profile.label}
                    <span aria-hidden="true">&nbsp;↗</span>
                  </ButtonLink>
                </li>
              ))}
            </ul>
          )}

          {social.length > 0 && (
            <ul className="label mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-cobalt"
                  >
                    {link.label}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
