"use client";

import { getLenis } from "@/lib/lenis-store";
import { ScrollTrigger } from "@/lib/motion-client";
import { setViewMode, type ViewMode } from "@/lib/view-mode";

interface ViewToggleProps {
  /** Vista a la que cambia este botón. */
  to: ViewMode;
  label: string;
  /** id del bloque de proyectos, para dejar el scroll en su inicio. */
  anchor?: string;
}

/**
 * "Ver como grilla" / "Ver como rueda". Solo se ve donde la rueda es posible
 * (clase view-toggle en globals.css): escritorio, con ratón y con movimiento.
 */
export function ViewToggle({ to, label, anchor }: ViewToggleProps) {
  function onClick() {
    setViewMode(to);
    // La página cambia de alto: se recalcula todo y se vuelve al inicio
    // del bloque para no dejar al usuario en medio de otra sección.
    requestAnimationFrame(() => {
      const lenis = getLenis();
      lenis?.resize();
      ScrollTrigger.refresh();
      const target = anchor ? document.getElementById(anchor) : null;
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { immediate: true });
      else target.scrollIntoView();
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="view-toggle label h-9 cursor-pointer items-center border border-ink px-3 font-medium transition-colors duration-200 hover:bg-ink hover:text-paper"
    >
      {label}
    </button>
  );
}
