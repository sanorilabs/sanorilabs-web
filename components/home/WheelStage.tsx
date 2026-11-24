"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  ViewTransition,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { SnTile } from "@/components/brand/SnTile";
import { Magnetic } from "@/components/motion/Magnetic";
import { buttonClass } from "@/components/ui/ButtonLink";
import { ViewProjectLabel } from "@/components/ui/ViewProjectLabel";
import type { StatusKey } from "@/content/types";
import { getLenis } from "@/lib/lenis-store";
import { transition, wheel } from "@/lib/motion";
import { disableWheel, useViewMode } from "@/lib/view-mode";
import { activeCoverRect } from "@/lib/wheel-layout";
import { ViewToggle } from "./ViewToggle";

// three.js y React Three Fiber viven en este trozo aparte: no se descargan
// en celular, con movimiento reducido ni en la vista de grilla.
const WheelCanvas = dynamic(() => import("./WheelCanvas"), { ssr: false });

/** Alto del menú fijo, en px (h-16). La rueda se queda pegada debajo. */
const HEADER = 64;

export interface WheelItem {
  slug: string;
  href: string;
  type: "exp" | "cli";
  code: string;
  /** Giro del cliente (solo casos). */
  kind?: string;
  name: string;
  status: StatusKey;
  statusLabel: string;
  tile: { number?: string; code?: string; label: string };
  /** Portada ya optimizada, para la textura y la transición. */
  cover: string;
}

interface WheelStageProps {
  items: WheelItem[];
  /** Ancla del bloque de proyectos (#proyectos / #projects). */
  projectsAnchor: string;
  /** Ancla de los casos (#casos / #case-studies). */
  casesAnchor: string;
  labels: {
    title: string;
    exp: string;
    cli: string;
    viewProject: string;
    viewAsGrid: string;
    previous: string;
    next: string;
  };
}

const dotColor: Record<StatusKey, string> = {
  production: "text-status-green",
  validating: "text-cobalt",
  delivered: "text-muted",
  preparing: "text-muted",
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Rueda de proyectos: las portadas giran en un anillo 3D con el scroll o al
 * arrastrar, y en el centro aparece el proyecto activo. El texto y los
 * enlaces son HTML normal; el canvas solo dibuja las portadas.
 */
export function WheelStage({
  items,
  projectsAnchor,
  casesAnchor,
  labels,
}: WheelStageProps) {
  const mode = useViewMode();
  const router = useRouter();
  const enabled = mode === "wheel";
  const count = items.length;

  const wrapRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLImageElement>(null);
  const progress = useRef(0);
  const hidden = useRef(-1);
  const dragging = useRef(false);
  /** Posiciones de scroll de la rueda: inicio y px por proyecto. */
  const metrics = useRef({ start: 0, step: 1 });

  const [active, setActive] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const [inView, setInView] = useState(false);

  const covers = useMemo(() => items.map((item) => item.cover), [items]);
  const firstCase = Math.max(
    0,
    items.findIndex((item) => item.type === "cli"),
  );

  const scrollToY = useCallback((y: number, duration: number) => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(y, duration > 0 ? { duration } : { immediate: true });
    } else {
      window.scrollTo(0, y);
    }
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const target = Math.min(count - 1, Math.max(0, index));
      const { start, step } = metrics.current;
      scrollToY(start + target * step, wheel.jumpDuration);
    },
    [count, scrollToY],
  );

  // Coloca la imagen puente justo encima de la portada activa: es lo que la
  // transición de página expande hasta ser el encabezado del proyecto.
  const prepareGhost = useCallback((index: number) => {
    const sticky = stickyRef.current;
    const ghost = ghostRef.current;
    if (!sticky || !ghost) return;
    const rect = activeCoverRect(sticky.clientWidth, sticky.clientHeight);
    ghost.style.left = `${rect.left}px`;
    ghost.style.top = `${rect.top}px`;
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.opacity = "1";
    hidden.current = index;
  }, []);

  const pick = useCallback(
    (index: number) => {
      if (index !== active) {
        goTo(index);
        return;
      }
      prepareGhost(index);
      router.push(items[index].href);
    },
    [active, goTo, items, prepareGhost, router],
  );

  // Scroll → avance de la rueda, proyecto activo y ajuste al más cercano.
  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const sticky = stickyRef.current;
    if (!wrap || !sticky) return;

    let snapTimer = 0;

    function measure() {
      const top = wrap!.getBoundingClientRect().top + window.scrollY;
      const range = wrap!.offsetHeight - sticky!.offsetHeight;
      metrics.current = {
        start: top - HEADER,
        step: Math.max(1, range / (count - 1)),
      };
    }

    function snap() {
      if (dragging.current) return;
      // Si el scroll sigue en marcha (inercia, flechas, un salto a un ancla),
      // se espera a que termine: ajustar a media animación la interrumpe.
      if (getLenis()?.isScrolling) {
        snapTimer = window.setTimeout(snap, wheel.snapDelayMs);
        return;
      }
      const { start, step } = metrics.current;
      const position = (window.scrollY - start) / step;
      // Fuera de la rueda (antes o después) el scroll queda libre.
      if (position < -0.02 || position > count - 1 + 0.02) return;
      const nearest = Math.round(position);
      if (Math.abs(position - nearest) * step < 2) return;
      scrollToY(start + nearest * step, wheel.snapDuration);
    }

    function update() {
      const { start, step } = metrics.current;
      const position = (window.scrollY - start) / step;
      progress.current = clamp01(position / (count - 1));
      const index = Math.min(count - 1, Math.max(0, Math.round(position)));
      setActive((previous) => (previous === index ? previous : index));

      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(snap, wheel.snapDelayMs);
    }

    function onResize() {
      measure();
      update();
    }

    measure();
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(snapTimer);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
    };
  }, [enabled, count, scrollToY]);

  // El canvas se descarga cuando el navegador está libre y solo dibuja
  // mientras la rueda está en pantalla.
  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(() => setCanvasReady(true), {
            timeout: 1500,
          })
        : window.setTimeout(() => setCanvasReady(true), 300);

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "20% 0px" },
    );
    observer.observe(wrap);

    // Al volver de un proyecto la imagen puente sigue visible: cuando acaba
    // la transición de regreso, vuelve a dibujarse la portada del canvas.
    const restore = window.setTimeout(() => {
      hidden.current = -1;
      if (ghostRef.current) ghostRef.current.style.opacity = "0";
    }, transition.morphMs + 150);

    return () => {
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idle);
      }
      window.clearTimeout(idle);
      window.clearTimeout(restore);
      observer.disconnect();
      setInView(false);
    };
  }, [enabled]);

  // Arrastrar la rueda mueve el scroll, así scroll y arrastre nunca difieren.
  const drag = useRef({ id: -1, x: 0, y: 0 });

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !(event.target instanceof HTMLCanvasElement)) {
      return;
    }
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (state.id !== event.pointerId) return;
    const delta = event.clientX - state.x + (event.clientY - state.y);
    if (!dragging.current && Math.abs(delta) < 6) return;
    dragging.current = true;
    state.x = event.clientX;
    state.y = event.clientY;

    const { start, step } = metrics.current;
    const next = Math.min(
      start + (count - 1) * step,
      Math.max(start, window.scrollY - delta * wheel.dragFactor),
    );
    scrollToY(next, 0);
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (drag.current.id !== event.pointerId) return;
    drag.current.id = -1;
    if (!dragging.current) return;
    dragging.current = false;
    // Un scroll de 0px reactiva el ajuste al proyecto más cercano.
    window.dispatchEvent(new Event("scroll"));
  }

  const current = items[active];

  return (
    <section
      ref={wrapRef}
      aria-label={labels.title}
      className="wheel-stage relative"
      style={{
        height: `calc(100vh - ${HEADER}px + ${(count - 1) * wheel.stepVh}vh)`,
      }}
    >
      {/* Posición del primer caso de estudio dentro del scroll de la rueda. */}
      <span
        data-anchor={casesAnchor}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 h-px w-px"
        style={{ top: `calc(${firstCase * wheel.stepVh}vh + 24px)` }}
      />

      <div
        ref={stickyRef}
        className="sticky top-16 h-[calc(100vh-4rem)] cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        <div aria-hidden="true" className="absolute inset-0">
          {enabled && canvasReady && (
            <WheelCanvas
              covers={covers}
              progress={progress}
              hidden={hidden}
              running={inView}
              onPick={pick}
              onError={disableWheel}
            />
          )}
        </div>

        {/* Imagen puente entre la portada 3D y el encabezado del proyecto. */}
        {enabled && (
          <ViewTransition
            name={`cover-${current.slug}`}
            share="cover-morph"
            default="none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- la misma URL optimizada que usa la textura */}
            <img
              ref={ghostRef}
              src={current.cover}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute object-cover opacity-0 outline outline-1 outline-grid"
            />
          </ViewTransition>
        )}

        <div className="container-site pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between pt-8">
          <h2 className="label">
            <span className="font-medium text-cobalt">
              {current.type === "exp" ? "EXP" : "CLI"}
            </span>
            <span className="text-muted">
              {" "}
              · {current.type === "exp" ? labels.exp : labels.cli}
            </span>
          </h2>
          <span className="pointer-events-auto">
            <ViewToggle
              to="grid"
              label={labels.viewAsGrid}
              anchor={projectsAnchor}
            />
          </span>
        </div>

        <ul className="pointer-events-none absolute inset-0">
          {items.map((item, index) => {
            const isActive = index === active;
            return (
              <li
                key={item.slug}
                aria-hidden={isActive ? undefined : true}
                className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
                style={{
                  opacity: isActive ? 1 : 0,
                  visibility: isActive ? "visible" : "hidden",
                  transform: isActive ? "none" : "translateY(12px)",
                  transition: `opacity ${wheel.labelMs}ms ease, transform ${wheel.labelMs}ms ease, visibility 0s linear ${isActive ? 0 : wheel.labelMs}ms`,
                }}
              >
                <SnTile {...item.tile} size={80} decorative />
                <p className="label mt-5">
                  <span className="font-medium">{item.code}</span>
                  {item.kind && (
                    <span className="text-muted"> · {item.kind}</span>
                  )}
                </p>
                <h3 className="mt-2 max-w-[20rem] text-4xl">{item.name}</h3>
                <p
                  className={`label mt-3 inline-flex items-center gap-2 ${
                    item.status === "delivered" ? "text-muted" : "text-ink"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`text-[0.7em] ${dotColor[item.status]}`}
                  >
                    ●
                  </span>
                  {item.statusLabel}
                </p>
                <div className="pointer-events-auto mt-6">
                  <Magnetic>
                    <Link
                      href={item.href}
                      prefetch={true}
                      className={buttonClass("primary")}
                      onClick={() => prepareGhost(index)}
                    >
                      <ViewProjectLabel text={labels.viewProject} />
                    </Link>
                  </Magnetic>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="container-site pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between pb-8">
          <p className="label text-muted">
            <span className="text-ink">
              {String(active + 1).padStart(2, "0")}
            </span>{" "}
            / {String(count).padStart(2, "0")}
          </p>
          <div className="pointer-events-auto flex gap-2">
            <button
              type="button"
              aria-label={labels.previous}
              disabled={active === 0}
              onClick={() => goTo(active - 1)}
              className="flex size-10 cursor-pointer items-center justify-center border border-ink font-mono transition-colors duration-200 hover:bg-ink hover:text-paper disabled:cursor-default disabled:border-grid disabled:text-muted disabled:hover:bg-transparent disabled:hover:text-muted"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              aria-label={labels.next}
              disabled={active === count - 1}
              onClick={() => goTo(active + 1)}
              className="flex size-10 cursor-pointer items-center justify-center border border-ink font-mono transition-colors duration-200 hover:bg-ink hover:text-paper disabled:cursor-default disabled:border-grid disabled:text-muted disabled:hover:bg-transparent disabled:hover:text-muted"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
