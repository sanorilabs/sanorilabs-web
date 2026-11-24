/** Proporción de las portadas (16:10), igual que en la grilla. */
export const COVER_RATIO = 1.6;

/** Distancia de la cámara. Su campo de visión se ajusta para que, en z = 0,
 *  una unidad de la escena sea un px de pantalla. */
export const CAMERA_Z = 1200;

/**
 * Ancho de la portada activa. La misma fórmula está en el CSS de la rueda
 * (.wheel-columns en globals.css) para que el texto ocupe justo el resto.
 */
const COVER_VW = 0.39;
const COVER_MIN = 380;
const COVER_MAX = 560;

/** Ancho máximo del contenido y su margen lateral, como en container-site. */
const CONTENT_MAX = 1120;
const CONTENT_PADDING = 32;

export interface WheelLayout {
  /** Tamaño en px de la portada activa. */
  coverW: number;
  coverH: number;
  /** Radio del anillo, en px. Gira en vertical: arriba y abajo de la activa. */
  radius: number;
  /** Del centro del escenario al centro del anillo, en px (hacia la derecha). */
  centerX: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Geometría de la rueda para un escenario de `width` px de ancho. La usan el
 * canvas (para colocar las portadas) y el DOM (para saber dónde está la
 * portada activa al empezar la transición de página).
 *
 * La portada activa queda centrada en vertical y pegada al borde derecho del
 * contenido; el texto del proyecto ocupa la columna izquierda.
 */
export function wheelLayout(width: number): WheelLayout {
  const coverW = clamp(width * COVER_VW, COVER_MIN, COVER_MAX);
  const coverH = coverW / COVER_RATIO;
  const contentRight =
    width / 2 +
    Math.min(width, CONTENT_MAX + CONTENT_PADDING * 2) / 2 -
    CONTENT_PADDING;

  return {
    coverW,
    coverH,
    radius: coverH * 0.9,
    centerX: contentRight - coverW / 2 - width / 2,
  };
}

/** Rectángulo (en px del escenario) de la portada activa en reposo. */
export function activeCoverRect(width: number, height: number) {
  const { coverW, coverH, centerX } = wheelLayout(width);
  return {
    left: width / 2 + centerX - coverW / 2,
    top: height / 2 - coverH / 2,
    width: coverW,
    height: coverH,
  };
}
