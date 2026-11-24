import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { scroll } from "./motion";

declare global {
  interface Window {
    /** Lo pone MotionRoot al hidratar: el JavaScript sí arrancó. */
    __snMotion?: boolean;
    /** Lo pone MotionScript si hay loader: cuándo empieza la página. */
    __snIntroAt?: number;
  }
}

let registered = false;

/** Registra los plugins de GSAP una sola vez. */
export function registerMotion() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);
  registered = true;
}

/**
 * true si hay que animar. MotionScript marca <html data-motion="on"> antes
 * del primer pintado, salvo con prefers-reduced-motion, y lo quita si el
 * JavaScript tarda demasiado. Sin la marca, todo se muestra estático.
 */
export function motionEnabled(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.dataset.motion === "on"
  );
}

/**
 * Dispara la animación una sola vez. Lo que ya se ve al cargar la página
 * arranca de inmediato; el resto, cuando cruza la línea de scroll.start.
 */
export function enterTrigger(trigger: Element): ScrollTrigger.Vars {
  return {
    trigger,
    start: () => {
      const top = trigger.getBoundingClientRect().top + window.scrollY;
      return top < window.innerHeight ? "top bottom" : scroll.start;
    },
    once: true,
  };
}

let navigated = false;

/** MotionRoot lo llama cuando el usuario cambia de página dentro del sitio. */
export function markNavigated() {
  navigated = true;
}

/**
 * ¿Debe animarse la entrada de este elemento?
 *
 * El HTML siempre llega con todo visible. Solo se anima lo que el usuario
 * no ha visto todavía:
 *  - con loader (primera página de la sesión), todo: el loader lo tapa;
 *  - al navegar dentro del sitio, todo: la página aún no se ha pintado;
 *  - en una carga normal, solo lo que queda fuera de pantalla. Lo que ya se
 *    pintó desde el HTML se queda quieto, sin ocultarse para volver a entrar.
 */
export function shouldEnter(el: Element): boolean {
  if (window.__snIntroAt !== undefined || navigated) return true;
  const rect = el.getBoundingClientRect();
  return rect.top >= window.innerHeight || rect.bottom <= 0;
}

/**
 * Ejecuta `run` cuando el loader deja ver la página; de inmediato si no
 * hay loader. Devuelve una función para cancelar la espera.
 */
export function afterIntro(run: () => void): () => void {
  const wait = (window.__snIntroAt ?? 0) - performance.now();
  if (wait <= 0) {
    run();
    return () => {};
  }
  const id = window.setTimeout(run, wait);
  return () => window.clearTimeout(id);
}

export { gsap, ScrollTrigger, SplitText };
