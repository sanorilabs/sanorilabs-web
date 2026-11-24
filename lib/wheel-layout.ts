import { wheel } from "./motion";

/** Proporción de las portadas (16:10), igual que en la grilla. */
export const COVER_RATIO = 1.6;

/** Distancia de la cámara. Su campo de visión se ajusta para que, en z = 0,
 *  una unidad de la escena sea un px de pantalla. */
export const CAMERA_Z = 1200;

export interface WheelLayout {
  /** Tamaño en px de la portada activa. */
  coverW: number;
  coverH: number;
  /** Radios del anillo (una elipse), en px desde el centro del escenario. */
  rx: number;
  ry: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Geometría de la rueda para un escenario de width × height px. La usan el
 * canvas (para colocar las portadas) y el DOM (para saber dónde está la
 * portada activa al empezar la transición de página).
 */
export function wheelLayout(width: number, height: number): WheelLayout {
  const coverW = clamp(width * 0.27, 240, 400);
  const coverH = coverW / COVER_RATIO;
  const smallH = coverH * wheel.inactiveScale;

  return {
    coverW,
    coverH,
    // La activa queda pegada al lado derecho, con margen.
    rx: Math.min(width / 2 - coverW / 2 - 40, 560),
    // Las de arriba y abajo quedan dentro del escenario, lejos del centro.
    ry: Math.max(height / 2 - smallH / 2 - 28, smallH),
  };
}

/** Rectángulo (en px del escenario) de la portada activa en reposo. */
export function activeCoverRect(width: number, height: number) {
  const { coverW, coverH, rx } = wheelLayout(width, height);
  return {
    left: width / 2 + rx - coverW / 2,
    top: height / 2 - coverH / 2,
    width: coverW,
    height: coverH,
  };
}
