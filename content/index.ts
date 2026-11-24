import { en } from "./en";
import { es } from "./es";
import type { Content, Lang } from "./types";

const content: Record<Lang, Content> = { es, en };

export function getContent(lang: Lang): Content {
  return content[lang];
}
