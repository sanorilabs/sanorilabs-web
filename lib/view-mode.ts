import { useSyncExternalStore } from "react";

/**
 * Vista de los proyectos en la home: rueda 3D o grilla.
 *
 * MotionScript decide antes del primer pintado y lo deja en <html>:
 *   data-wheel="ok"   → este equipo puede mostrar la rueda
 *   data-view="wheel" → vista elegida ("grid" si el usuario lo guardó)
 * El CSS de globals.css muestra una u otra a partir de 1024px.
 */
export type ViewMode = "wheel" | "grid";

const STORAGE_KEY = "sn-view";
const DESKTOP = "(min-width: 64rem)";
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const media = window.matchMedia(DESKTOP);
  media.addEventListener("change", listener);
  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", listener);
  };
}

function wheelCapable(): boolean {
  return (
    document.documentElement.dataset.wheel === "ok" &&
    window.matchMedia(DESKTOP).matches
  );
}

function currentMode(): ViewMode {
  return wheelCapable() && document.documentElement.dataset.view === "wheel"
    ? "wheel"
    : "grid";
}

/** Cambia la vista y la recuerda para la próxima visita. */
export function setViewMode(mode: ViewMode) {
  document.documentElement.dataset.view = mode;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Sin almacenamiento (modo privado): la elección dura esta visita.
  }
  emit();
}

/** Este equipo no puede con la rueda (sin WebGL): grilla y sin botón. */
export function disableWheel() {
  delete document.documentElement.dataset.wheel;
  document.documentElement.dataset.view = "grid";
  emit();
}

/** Vista actual. En el servidor y sin JavaScript siempre es "grid". */
export function useViewMode(): ViewMode {
  return useSyncExternalStore<ViewMode>(subscribe, currentMode, () => "grid");
}
