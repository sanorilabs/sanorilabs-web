"use client";

import { usePathname } from "next/navigation";
import type { Lang } from "@/content/types";
import { alternatePath } from "@/lib/routes";
import { LangLinks } from "./LangLinks";

/** ES/EN que apunta a la misma página en el otro idioma. */
export function LangSwitch({ lang, label }: { lang: Lang; label: string }) {
  const pathname = usePathname();
  return (
    <LangLinks lang={lang} href={alternatePath(pathname, lang)} label={label} />
  );
}
