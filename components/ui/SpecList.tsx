import type { ReactNode } from "react";
import { Decode } from "@/components/motion/Decode";

interface SpecListProps {
  items: { label: string; value: ReactNode }[];
  /** rows: etiqueta y valor lado a lado. stacked: valor debajo (textos largos). */
  layout?: "rows" | "stacked";
  className?: string;
}

/** Ficha en mono: etiqueta, valor y una línea de 1px entre filas. */
export function SpecList({
  items,
  layout = "rows",
  className = "",
}: SpecListProps) {
  const row =
    layout === "rows"
      ? "grid grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)] gap-4"
      : "flex flex-col gap-1";

  return (
    <dl className={`border-t border-grid font-mono text-sm ${className}`}>
      {items.map((item) => (
        <div key={item.label} className={`${row} border-b border-grid py-3`}>
          <dt className="text-xs uppercase leading-6 tracking-[0.08em] text-muted">
            <Decode>{item.label}</Decode>
          </dt>
          <dd className="leading-6">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
