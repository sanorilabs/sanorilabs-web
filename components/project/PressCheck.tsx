"use client";

import { useEffect, useRef } from "react";
import { press } from "@/lib/motion";
import {
  afterIntro,
  gsap,
  motionEnabled,
  registerMotion,
  ScrollTrigger,
} from "@/lib/motion-client";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * "Qué hice" como press check: cada paso se palomea cuando pasa por el
 * viewport y un contador lleva la cuenta. El estado visual está en
 * globals.css (.press-check); aquí solo se marca cada <li> con data-checked.
 * Sin JavaScript o con movimiento reducido, todos salen ya palomeados.
 */
export function PressCheck({ items }: { items: string[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const total = items.length;

  useEffect(() => {
    const list = listRef.current;
    const count = countRef.current;
    if (!list || !count || !motionEnabled()) return;
    registerMotion();

    const steps = Array.from(list.children) as HTMLElement[];
    let done = 0;
    count.textContent = pad(done);

    let ctx: gsap.Context | undefined;
    const cancel = afterIntro(() => {
      ctx = gsap.context(() => {
        steps.forEach((step) => {
          ScrollTrigger.create({
            trigger: step,
            start: press.start,
            once: true,
            onEnter: () => {
              step.dataset.checked = "";
              done += 1;
              count.textContent = pad(done);
            },
          });
        });
      }, list);
    });

    return () => {
      cancel();
      ctx?.revert();
      steps.forEach((step) => delete step.dataset.checked);
      count.textContent = pad(total);
    };
  }, [total]);

  return (
    <div className="press-check">
      <p
        aria-hidden="true"
        className="flex justify-end border-t border-grid py-2 font-mono text-xs tracking-[0.08em] text-muted"
      >
        <span ref={countRef} className="text-ink">
          {pad(total)}
        </span>
        &nbsp;/ {pad(total)}
      </p>
      <ol ref={listRef} className="border-t border-grid">
        {items.map((item, index) => (
          <li
            key={item}
            className="flex items-start gap-4 border-b border-grid py-4"
          >
            <span
              aria-hidden="true"
              className="press-box mt-1 flex size-5 shrink-0 items-center justify-center"
            >
              <svg viewBox="0 0 12 12" className="size-3" fill="none">
                <path
                  className="press-tick"
                  d="M2 6.5 5 9.5 10 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  pathLength={1}
                />
              </svg>
            </span>
            <span
              aria-hidden="true"
              className="mt-1 font-mono text-xs leading-5 text-muted"
            >
              {pad(index + 1)}
            </span>
            <span className="press-text">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
