"use client";

import { useLayoutEffect, useRef } from "react";
import { decode, duration, ease, stagger } from "@/lib/motion";
import {
  afterIntro,
  enterTrigger,
  gsap,
  motionEnabled,
  registerMotion,
  shouldEnter,
} from "@/lib/motion-client";

interface DecodeProps {
  /** Solo texto plano: es lo que se baraja y se vuelve a escribir. */
  children: string;
  /** Posición entre hermanos: cada uno empieza un poco después. */
  index?: number;
  className?: string;
}

/**
 * Etiqueta en mono que se "descifra": caracteres barajados que se resuelven
 * de izquierda a derecha. El texto real está siempre en el HTML.
 * Ver shouldEnter para cuándo se anima.
 */
export function Decode({ children, index = 0, className }: DecodeProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !motionEnabled() || !shouldEnter(el)) return;
    registerMotion();

    let ctx: gsap.Context | undefined;
    const cancel = afterIntro(() => {
      ctx = gsap.context(() => {
        gsap.to(el, {
          duration: duration.decode,
          ease: ease.decode,
          delay: index * stagger.items,
          scrambleText: {
            text: children,
            chars: decode.chars,
            speed: decode.speed,
          },
          scrollTrigger: enterTrigger(el),
        });
      }, el);
    });

    return () => {
      cancel();
      ctx?.revert();
      // Deja el texto real aunque la animación se corte a medias.
      el.textContent = children;
    };
  }, [children, index]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
