"use client";

import {
  useLayoutEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { distance, duration, ease, stagger } from "@/lib/motion";
import {
  afterIntro,
  enterTrigger,
  gsap,
  motionEnabled,
  registerMotion,
  shouldEnter,
} from "@/lib/motion-client";

interface RevealProps {
  as?: "div" | "p" | "li" | "ul";
  /** Posición entre hermanos: cada uno entra un poco después del anterior. */
  index?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Bloque que sube y aparece al entrar al viewport. Usa solo opacidad y
 * transform: sus enlaces siguen alcanzables con el teclado en todo momento.
 * Ver shouldEnter para cuándo se anima.
 */
export function Reveal({
  as = "div",
  index = 0,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  // Un solo tipo de ref para todas las etiquetas posibles.
  const Tag = as as "div";

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !motionEnabled() || !shouldEnter(el)) return;
    registerMotion();

    let ctx: gsap.Context | undefined;
    const cancel = afterIntro(() => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { opacity: 0, y: distance.reveal },
          {
            opacity: 1,
            y: 0,
            duration: duration.reveal,
            ease: ease.reveal,
            delay: index * stagger.items,
            scrollTrigger: enterTrigger(el),
          },
        );
      }, el);
    });

    return () => {
      cancel();
      ctx?.revert();
    };
  }, [index]);

  return (
    <Tag ref={ref as RefObject<HTMLDivElement | null>} className={className}>
      {children}
    </Tag>
  );
}
