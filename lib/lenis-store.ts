import type Lenis from "lenis";

/** La instancia de Lenis que crea MotionRoot, para quien necesite mover el scroll. */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Elemento al que apunta un ancla (#casos...). Si hay un marcador visible
 * con data-anchor, gana: así la rueda puede tener sus propias posiciones.
 */
export function resolveAnchor(id: string): HTMLElement | null {
  const markers = document.querySelectorAll<HTMLElement>(
    `[data-anchor="${CSS.escape(id)}"]`,
  );
  for (const marker of markers) {
    if (marker.checkVisibility()) return marker;
  }
  return document.getElementById(id);
}
