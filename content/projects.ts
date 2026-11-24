import type { StatusKey } from "./types";

/**
 * Datos de cada proyecto que no cambian con el idioma:
 * código, casilla, estado, marca, portada y enlaces.
 * Los textos viven en es.ts y en.ts.
 *
 * Sanori Labs es neutro (papel, tinta, cobalto); el color lo pone cada
 * proyecto con su marca. Tras cambiar un color, un logo o un sitio, corre
 * `node scripts/generate-covers.mjs` para rehacer las portadas.
 */

/** Negocios propios. */
export type ExpSlug = "casora" | "nola";
/** Sitios para clientes. */
export type CliSlug = "pl-grupo-comercial" | "permil";
export type Slug = ExpSlug | CliSlug;

interface BaseMeta {
  /** Código que se muestra en la grilla, la rueda y la página. */
  code: string;
  /** Texto bajo el "Sn" de la casilla. */
  tileLabel: string;
  name: string;
  status: StatusKey;
  /** Marca del proyecto: de aquí sale todo el color del sitio. */
  brand: {
    /** Color principal: fondo de la portada y tinte de la rueda. */
    color: string;
    /** Logo en /public (SVG o PNG transparente). */
    logo: string;
    /** Proporción del logo (ancho / alto), para reservar su espacio. */
    logoRatio: number;
    /** Si el logo no se lee sobre `color`, va sobre una placa de este color. */
    logoPlate?: string;
  };
  /** Portada en /public (1600×1000). La genera scripts/generate-covers.mjs. */
  cover: string;
  /** Imagen para compartir (1200×630). La genera el mismo script. */
  og: string;
  /** El primero es el sitio del proyecto. Sin label = "Ver sitio". */
  links: { label?: string; href: string }[];
}

export type ProjectMeta =
  | (BaseMeta & {
      type: "exp";
      slug: ExpSlug;
      /** Número de la casilla Sn. Sn 03 queda reservado. */
      tileNumber: string;
    })
  | (BaseMeta & {
      /** La casilla de un cliente muestra su código en lugar del número. */
      type: "cli";
      slug: CliSlug;
    });

export const projects: ProjectMeta[] = [
  {
    slug: "casora",
    type: "exp",
    code: "EXP-01",
    tileNumber: "01",
    tileLabel: "Casora",
    name: "Casora",
    status: "production",
    brand: {
      color: "#C9622E",
      logo: "/projects/logos/casora.png",
      logoRatio: 1165 / 279,
    },
    cover: "/projects/casora.webp",
    og: "/projects/og/casora.jpg",
    links: [
      { label: "casoramx.com", href: "https://casoramx.com" },
      { label: "App Store", href: "https://apps.apple.com/mx/app/id6810853902" },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.casoramx.app",
      },
    ],
  },
  {
    slug: "nola",
    type: "exp",
    code: "EXP-02",
    tileNumber: "02",
    tileLabel: "Nola",
    name: "Nola",
    status: "validating",
    brand: {
      color: "#0A0A0A",
      logo: "/projects/logos/nola.png",
      logoRatio: 748 / 334,
    },
    cover: "/projects/nola.webp",
    og: "/projects/og/nola.jpg",
    links: [{ label: "nolamx.com", href: "https://www.nolamx.com/" }],
  },
  {
    slug: "pl-grupo-comercial",
    type: "cli",
    code: "CLI-01",
    tileLabel: "P&L",
    name: "P&L Grupo Comercial",
    status: "delivered",
    brand: {
      color: "#FE6F02",
      logo: "/projects/logos/pl-grupo-comercial.png",
      logoRatio: 1200 / 482,
      // El "&" del logo es naranja: sobre el naranja de marca desaparece.
      logoPlate: "#0B0B0C",
    },
    cover: "/projects/pl-grupo-comercial.webp",
    og: "/projects/og/pl-grupo-comercial.jpg",
    links: [{ href: "https://plgrupocomercial.com.mx" }],
  },
  {
    slug: "permil",
    type: "cli",
    code: "CLI-02",
    tileLabel: "Permil",
    name: "Permil",
    status: "delivered",
    brand: {
      color: "#1E3866",
      logo: "/projects/logos/permil.png",
      logoRatio: 1000 / 336,
    },
    cover: "/projects/permil.webp",
    og: "/projects/og/permil.jpg",
    links: [{ href: "https://permil.com.mx" }],
  },
];

export function getProject(slug: string): ProjectMeta | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: Slug): ProjectMeta {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}
