import type { Lang } from "@/content/types";

interface LangLinksProps {
  lang: Lang;
  /** Ruta de esta misma página en el otro idioma. */
  href: string;
  /** Nombre del otro idioma, para lectores de pantalla ("English"). */
  label: string;
}

/**
 * Botón ES/EN. El idioma actual va en tinta; el otro es el enlace.
 * Es un <a> normal: cada idioma tiene su propio layout raíz.
 */
export function LangLinks({ lang, href, label }: LangLinksProps) {
  const other: Lang = lang === "es" ? "en" : "es";
  const current = (
    <span aria-current="true" className="font-medium text-ink">
      {lang.toUpperCase()}
    </span>
  );
  const link = (
    <a
      href={href}
      hrefLang={other}
      lang={other}
      className="text-muted underline-offset-4 hover:text-cobalt hover:underline"
    >
      {other.toUpperCase()}
      <span className="sr-only"> · {label}</span>
    </a>
  );

  return (
    <span className="label inline-flex items-center gap-1.5">
      {lang === "es" ? current : link}
      <span aria-hidden="true" className="text-muted">
        /
      </span>
      {lang === "es" ? link : current}
    </span>
  );
}
