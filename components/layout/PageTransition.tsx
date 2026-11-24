import { ViewTransition, type ReactNode } from "react";

/**
 * Envuelve el contenido de cada página: al navegar, la que sale se
 * desvanece y la que entra aparece (clases page-exit y page-enter en
 * globals.css). Va en cada page.tsx, no en el layout, porque el layout
 * no se desmonta al cambiar de página.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
