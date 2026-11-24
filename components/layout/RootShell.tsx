import { Suspense, type CSSProperties, type ReactNode } from "react";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { MotionScript } from "@/components/motion/MotionScript";
import { getContent } from "@/content";
import type { Lang } from "@/content/types";
import { plexMono, plexSans } from "@/lib/fonts";
import { fan, loader, press, transition } from "@/lib/motion";
import { Footer } from "./Footer";
import { Loader } from "./Loader";
import { Nav } from "./Nav";
import { PersonJsonLd } from "./PersonJsonLd";

// Las duraciones del loader, la transición de página y el press check
// viven en lib/motion.ts; aquí pasan al CSS, que es quien anima.
const transitionVars = {
  "--loader-count": `${loader.totalMs - loader.exitMs}ms`,
  "--loader-exit": `${loader.exitMs}ms`,
  "--press-check": `${press.checkMs}ms`,
  "--fan-spread": `${fan.spreadMs}ms`,
  "--vt-morph": `${transition.morphMs}ms`,
  "--vt-morph-ease": transition.morphEase,
  "--vt-page-out": `${transition.pageOutMs}ms`,
  "--vt-page-in": `${transition.pageInMs}ms`,
} as CSSProperties;

/** Documento completo de un idioma: lo usan los dos layouts raíz. */
export function RootShell({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  const t = getContent(lang);

  return (
    <html
      lang={lang}
      className={`${plexSans.variable} ${plexMono.variable}`}
      style={transitionVars}
      // Al cambiar de página Next salta arriba sin animar el scroll.
      data-scroll-behavior="smooth"
      // MotionScript añade data-motion a <html> antes de hidratar.
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <MotionScript />
        <Loader />
        <Suspense fallback={null}>
          <MotionRoot />
        </Suspense>
        <a
          href="#main"
          className="label sr-only z-50 bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {t.nav.skip}
        </a>
        <Nav lang={lang} />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer lang={lang} />
        <PersonJsonLd />
      </body>
    </html>
  );
}
