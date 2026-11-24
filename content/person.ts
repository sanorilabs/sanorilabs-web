import { links } from "./links";

/**
 * Quién está detrás del sitio, tal como se declara a los buscadores (datos
 * estructurados de tipo Person, ver components/layout/PersonJsonLd.tsx).
 * No se muestra en pantalla.
 */
export const person = {
  name: "Sebastián Noriega",
  jobTitle: "Software engineering student & founder",
  alumniOf: "Tecnológico de Monterrey",
  url: "https://sanorilabs.com",
  /** Perfiles que son de la misma persona, se enlacen o no en el sitio. */
  sameAs: [
    links.github,
    links.linkedin,
    "https://www.instagram.com/sanorilabs/",
  ],
};
