"use client";

import { ViewTransition, type ReactNode } from "react";
import { useViewMode } from "@/lib/view-mode";

interface CoverTransitionProps {
  slug: string;
  /** "grid" = miniatura de la grilla de la home. Sin valor = encabezado. */
  source?: "grid";
  children: ReactNode;
}

/**
 * Une la portada de un proyecto entre dos páginas: la miniatura (o la
 * portada activa de la rueda) se expande hasta ser el encabezado del
 * proyecto. Las dos puntas comparten el nombre cover-<slug>.
 */
export function CoverTransition({
  slug,
  source,
  children,
}: CoverTransitionProps) {
  const mode = useViewMode();

  // Con la rueda a la vista, quien lleva el nombre es su imagen puente:
  // un nombre no puede estar dos veces en la misma página.
  if (source === "grid" && mode !== "grid") return <>{children}</>;

  return (
    <ViewTransition name={`cover-${slug}`} share="cover-morph" default="none">
      {children}
    </ViewTransition>
  );
}
