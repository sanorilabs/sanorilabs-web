import { Decode } from "@/components/motion/Decode";
import { getContent } from "@/content";
import type { Lang, StatusKey } from "@/content/types";

const dotColor: Record<StatusKey, string> = {
  production: "text-status-green",
  validating: "text-cobalt",
  delivered: "text-muted",
  preparing: "text-muted",
};

/**
 * Estado del proyecto: punto de color más texto. El color va solo en el
 * punto; el texto queda en tinta para mantener el contraste de 4.5:1.
 */
export function StatusBadge({
  status,
  lang,
}: {
  status: StatusKey;
  lang: Lang;
}) {
  const muted = status === "delivered" || status === "preparing";
  return (
    <span
      className={`label inline-flex items-center gap-2 whitespace-nowrap ${
        muted ? "text-muted" : "text-ink"
      }`}
    >
      <span aria-hidden="true" className={`text-[0.7em] ${dotColor[status]}`}>
        ●
      </span>
      <Decode>{getContent(lang).status[status]}</Decode>
    </span>
  );
}
