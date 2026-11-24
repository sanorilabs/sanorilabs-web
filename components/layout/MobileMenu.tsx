"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

/**
 * Menú colapsable para celular. Es un <details>, así que abre y cierra
 * aunque falle el JavaScript; el script solo lo cierra al elegir un enlace.
 */
export function MobileMenu({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  function closeOnLink(event: MouseEvent<HTMLDetailsElement>) {
    if ((event.target as HTMLElement).closest("a")) {
      ref.current?.removeAttribute("open");
    }
  }

  return (
    <details ref={ref} className="group md:hidden" onClick={closeOnLink}>
      <summary className="label flex h-10 cursor-pointer list-none items-center border border-ink px-3 font-medium group-open:bg-ink group-open:text-paper">
        {label}
      </summary>
      <div className="absolute inset-x-0 top-full border-b border-grid bg-paper">
        {children}
      </div>
    </details>
  );
}
