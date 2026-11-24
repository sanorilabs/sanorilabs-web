"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import { resolveAnchor, setLenis } from "@/lib/lenis-store";
import { duration, loader, scroll, transition } from "@/lib/motion";
import {
  gsap,
  markNavigated,
  motionEnabled,
  registerMotion,
  ScrollTrigger,
} from "@/lib/motion-client";

/** true si el navegador anima los cambios de página por su cuenta. */
function supportsViewTransitions(): boolean {
  return typeof document.startViewTransition === "function";
}

/**
 * Arranque del movimiento, una vez por documento: avisa que el JavaScript
 * cargó, enciende el scroll suave (Lenis) y lo sincroniza con ScrollTrigger.
 * También hace de respaldo de la transición de página: donde no hay View
 * Transitions, una cortinilla color papel tapa el cambio.
 * Con prefers-reduced-motion no hace nada.
 */
export function MotionRoot() {
  const pathname = usePathname();
  const router = useRouter();
  const lenisRef = useRef<Lenis | null>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  /** true mientras la cortinilla tapa la pantalla. */
  const covered = useRef(false);
  const firstPath = useRef(pathname);

  // Va en un layout effect y antes que <main> en el árbol: así la página
  // nueva ya sabe, al montar sus animaciones, que el usuario navegó.
  useLayoutEffect(() => {
    if (pathname !== firstPath.current) markNavigated();
  }, [pathname]);

  useEffect(() => {
    window.__snMotion = true;
    if (!motionEnabled()) return;
    registerMotion();

    // El loader ya se ocultó solo (CSS); aquí se quita del todo.
    const loaderTimer = window.setTimeout(() => {
      delete document.documentElement.dataset.loader;
    }, loader.totalMs + 100);

    const lenis = new Lenis({ lerp: scroll.lerp, autoRaf: false });
    lenisRef.current = lenis;
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") {
        return;
      }
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      // Otra página del sitio.
      if (url.pathname !== window.location.pathname) {
        // ES/EN recarga el documento entero; el navegador con View
        // Transitions ya anima solo.
        if (supportsViewTransitions() || link.hasAttribute("hreflang")) return;
        const curtain = curtainRef.current;
        if (!curtain) return;

        event.preventDefault();
        covered.current = true;
        gsap.fromTo(
          curtain,
          { yPercent: 100, autoAlpha: 1 },
          {
            yPercent: 0,
            duration: transition.curtainIn,
            ease: transition.curtainEase,
            overwrite: true,
            onComplete: () => router.push(url.pathname + url.search + url.hash),
          },
        );
        return;
      }

      // Un ancla de esta misma página: scroll suave en vez de salto.
      if (url.hash.length < 2) return;
      const target = resolveAnchor(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;

      event.preventDefault();
      window.history.pushState(null, "", url.hash);
      lenis.scrollTo(target, { duration: duration.anchor });
      // Como se canceló el salto nativo, el foco se mueve a mano al destino
      // (así funciona "Saltar al contenido" con el teclado).
      if (!target.dataset.anchor) {
        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1");
        }
        target.focus({ preventScroll: true });
      }
    }
    document.addEventListener("click", onClick, true);

    return () => {
      window.clearTimeout(loaderTimer);
      document.removeEventListener("click", onClick, true);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [router]);

  // Al cambiar de página (y al cargar): Lenis suelta la posición anterior,
  // se recalculan los disparadores y se levanta la cortinilla si estaba.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.stop();
    lenis.start();
    lenis.resize();
    ScrollTrigger.refresh();

    // Anclas que solo existen como marcador (los casos dentro de la rueda):
    // el navegador no las encuentra, así que el salto se hace aquí.
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id ? resolveAnchor(id) : null;
    if (target?.dataset.anchor) lenis.scrollTo(target, { immediate: true });

    const curtain = curtainRef.current;
    if (curtain && covered.current) {
      covered.current = false;
      gsap.to(curtain, {
        autoAlpha: 0,
        duration: transition.curtainOut,
        ease: transition.curtainEase,
        overwrite: true,
      });
    }
  }, [pathname]);

  return (
    <div
      ref={curtainRef}
      aria-hidden="true"
      className="pointer-events-none invisible fixed inset-0 z-50 bg-paper"
    />
  );
}
