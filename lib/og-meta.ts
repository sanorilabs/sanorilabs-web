import { getContent } from "@/content";
import type { Lang } from "@/content/types";

export const ogSize = { width: 1200, height: 630 };

export function ogAlt(lang: Lang): string {
  const t = getContent(lang);
  return `${t.meta.siteName} — ${t.hero.title}`;
}
