"use client";

import { useLayoutEffect, useRef } from "react";
import { duration, ease } from "@/lib/motion";
import {
  afterIntro,
  enterTrigger,
  gsap,
  motionEnabled,
  registerMotion,
  shouldEnter,
} from "@/lib/motion-client";

/**
 * Línea divisoria de 1px que se dibuja de izquierda a derecha.
 * Ver shouldEnter para cuándo se anima.
 */
export function Rule({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !motionEnabled() || !shouldEnter(el)) return;
    registerMotion();

    let ctx: gsap.Context | undefined;
    const cancel = afterIntro(() => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: duration.draw,
            ease: ease.draw,
            scrollTrigger: enterTrigger(el),
          },
        );
      }, el);
    });

    return () => {
      cancel();
      ctx?.revert();
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`block h-px w-full origin-left bg-grid ${className}`}
    />
  );
}
