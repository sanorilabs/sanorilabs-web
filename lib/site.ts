import type { Metadata } from "next";
import { getContent } from "@/content";
import type { Lang } from "@/content/types";
import { ogAlt, ogSize } from "@/lib/og-meta";

export const siteUrl = "https://sanorilabs.com";

const ogLocale: Record<Lang, string> = { es: "es_MX", en: "en_US" };

interface PageMeta {
  lang: Lang;
  /** Ruta de esta página, con "/" inicial. */
  path: string;
  /** La misma página en el otro idioma. */
  altPath: string;
  /** Sin título = el título general del sitio. */
  title?: string;
  description?: string;
  noindex?: boolean;
}

/** Metadata de una página: canonical, hreflang y Open Graph. */
export function pageMetadata({
  lang,
  path,
  altPath,
  title,
  description,
  noindex,
}: PageMeta): Metadata {
  const t = getContent(lang);
  const other: Lang = lang === "es" ? "en" : "es";
  const fullTitle = title ? `${title} — ${t.meta.siteName}` : t.meta.title;
  const fullDescription = description ?? t.meta.description;
  const esPath = lang === "es" ? path : altPath;
  // La misma imagen para todas las páginas de un idioma (app/og/*.png).
  const image = { url: `/og/${lang}.png`, ...ogSize, alt: ogAlt(lang) };

  return {
    title: fullTitle,
    description: fullDescription,
    alternates: {
      canonical: path,
      languages: {
        [lang]: path,
        [other]: altPath,
        "x-default": esPath,
      },
    },
    openGraph: {
      type: "website",
      siteName: t.meta.siteName,
      title: fullTitle,
      description: fullDescription,
      url: path,
      locale: ogLocale[lang],
      alternateLocale: ogLocale[other],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [image],
    },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
