import { SnTile } from "@/components/brand/SnTile";
import { Wordmark } from "@/components/brand/Wordmark";
import { Rule } from "@/components/motion/Rule";
import { getContent } from "@/content";
import type { Lang } from "@/content/types";

export function Footer({ lang }: { lang: Lang }) {
  const t = getContent(lang);

  return (
    <footer className="mt-24 md:mt-32">
      <div className="container-site">
        <Rule />
      </div>
      <div className="container-site flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <SnTile number="00" label="Sanori" size={48} decorative />
          <div>
            <Wordmark className="text-sm" />
            <p className="label mt-1 text-muted">{t.footer.tagline}</p>
          </div>
        </div>
        <p className="label text-muted">
          {t.footer.copyright}
          <span aria-hidden="true"> · </span>
          {t.footer.made}
        </p>
      </div>
    </footer>
  );
}
