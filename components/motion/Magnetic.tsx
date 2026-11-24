"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { distance, duration, ease } from "@/lib/motion";
import { gsap, motionEnabled, registerMotion } from "@/lib/motion-client";

/**
 * Efecto magnético sutil: el contenido se acerca un poco al puntero y
 * vuelve a su lugar al salir. Solo con ratón o trackpad.
 */
export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionEnabled()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    registerMotion();

    const follow = { duration: duration.magnetIn, ease: ease.magnetIn };
    const xTo = gsap.quickTo(el, "x", follow);
    const yTo = gsap.quickTo(el, "y", follow);

    function onMove(event: PointerEvent) {
      const box = el!.getBoundingClientRect();
      xTo((event.clientX - (box.left + box.width / 2)) * distance.magnet);
      yTo((event.clientY - (box.top + box.height / 2)) * distance.magnet);
    }

    function onLeave() {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: duration.magnetOut,
        ease: ease.magnetOut,
        overwrite: true,
      });
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "transform" });
    };
  }, []);

  return (
    <span ref={ref} className="inline-flex">
      {children}
    </span>
  );
}
