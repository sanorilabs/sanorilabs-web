"use client";

import { useSyncExternalStore } from "react";

// Un solo intervalo para todos los relojes de la página.
const listeners = new Set<() => void>();
let timer = 0;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    timer = window.setInterval(() => {
      listeners.forEach((notify) => notify());
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.clearInterval(timer);
      timer = 0;
    }
  };
}

const seconds = () => Math.floor(Date.now() / 1000);

const monterrey = new Intl.DateTimeFormat("es-MX", {
  timeZone: "America/Monterrey",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

/**
 * Hora local de Monterrey, en vivo. En el servidor y sin JavaScript no
 * pinta nada: al lado queda el texto fijo ("UTC−6").
 */
export function LiveClock() {
  const now = useSyncExternalStore<number | null>(
    subscribe,
    seconds,
    () => null,
  );
  if (now === null) return null;

  return (
    <span className="mr-2 tabular-nums">
      {monterrey.format(new Date(now * 1000))}
    </span>
  );
}
