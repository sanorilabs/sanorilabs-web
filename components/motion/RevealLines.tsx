"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { duration, ease, stagger } from "@/lib/motion";
import {
  afterIntro,
  enterTrigger,
  gsap,
  motionEnabled,
  registerMotion,
  shouldEnter,
  SplitText,
} from "@/lib/motion-client";

interface RevealLinesProps {
  as?: "h1" | "h2";
  className?: string;
  children: ReactNode;
}

/**
 * Título que entra línea por línea desde detrás de una máscara (solo con
 * transform y recorte, nunca con opacidad). En el HTML es un título normal
 * y visible; ver shouldEnter para cuándo se anima.
 */
export function RevealLines({
  as: Tag = "h2",
  className,
  children,
}: RevealLinesProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !motionEnabled() || !shouldEnter(el)) return;
    registerMotion();

    let ctx: gsap.Context | undefined;
    const cancel = afterIntro(() => {
      ctx = gsap.context(() => {
        // autoSplit recalcula las líneas cuando cargan las fuentes o cambia el
        // ancho; la animación devuelta conserva su avance.
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "reveal-line",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 115,
              duration: duration.line,
              ease: ease.line,
              stagger: stagger.lines,
              scrollTrigger: enterTrigger(el),
            });
          },
        });
      }, el);
    });

    return () => {
      cancel();
      ctx?.revert();
    };
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
