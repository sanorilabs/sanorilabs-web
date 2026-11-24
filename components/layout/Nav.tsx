import Link from "next/link";
import { Suspense } from "react";
import { SnTile } from "@/components/brand/SnTile";
import { Wordmark } from "@/components/brand/Wordmark";
import { getContent } from "@/content";
import type { Lang } from "@/content/types";
import { routes } from "@/lib/routes";
import { LangLinks } from "./LangLinks";
import { LangSwitch } from "./LangSwitch";
import { MobileMenu } from "./MobileMenu";

export function Nav({ lang }: { lang: Lang }) {
  const t = getContent(lang);
  const r = routes[lang];
  const other: Lang = lang === "es" ? "en" : "es";

  const items = [
    { label: t.nav.projects, href: `${r.home}#${r.anchors.projects}` },
    { label: t.nav.cases, href: `${r.home}#${r.anchors.cases}` },
    { label: t.nav.about, href: r.about },
    { label: t.nav.contact, href: `${r.about}#${r.anchors.contact}` },
  ];

  // Mientras no se conoce la ruta, el ES/EN apunta a la home del otro idioma.
  const langSwitch = (
    <Suspense
      fallback={
        <LangLinks
          lang={lang}
          href={routes[other].home}
          label={t.nav.switchLang}
        />
      }
    >
      <LangSwitch lang={lang} label={t.nav.switchLang} />
    </Suspense>
  );

  return (
    <header
      className="sticky top-0 z-40 border-b border-grid bg-paper"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="container-site relative flex h-16 items-center justify-between gap-6">
        <Link href={r.home} className="flex items-center gap-3">
          <SnTile number="00" label="Sanori" size={40} decorative />
          <Wordmark className="text-sm" />
        </Link>

        <nav aria-label={t.nav.menu} className="hidden md:block">
          <ul className="flex items-center gap-8">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="label underline-offset-4 hover:text-cobalt hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>{langSwitch}</li>
          </ul>
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          {langSwitch}
          <MobileMenu label={t.nav.menu}>
            <nav aria-label={t.nav.menu} className="container-site">
              <ul>
                {items.map((item) => (
                  <li
                    key={item.href}
                    className="border-b border-grid last:border-b-0"
                  >
                    <Link href={item.href} className="label block py-4">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
