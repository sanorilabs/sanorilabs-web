import type { StatusKey } from "./types";

/**
 * Datos de cada proyecto que no cambian con el idioma:
 * código, casilla, estado, portada y enlaces.
 * Los textos viven en es.ts y en.ts.
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
  /** Portada en /public. Reemplaza el archivo para cambiarla. */
  cover: string;
  /** Sin label = se muestra como "Ver sitio". */
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
    cover: "/projects/casora.png",
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
    cover: "/projects/nola.png",
    links: [{ label: "nolamx.com", href: "https://www.nolamx.com/" }],
  },
  {
    slug: "pl-grupo-comercial",
    type: "cli",
    code: "CLI-01",
    tileLabel: "P&L",
    name: "P&L Grupo Comercial",
    status: "delivered",
    cover: "/projects/pl-grupo-comercial.png",
    links: [{ href: "https://plgrupocomercial.com.mx" }],
  },
  {
    slug: "permil",
    type: "cli",
    code: "CLI-02",
    tileLabel: "Permil",
    name: "Permil",
    status: "delivered",
    cover: "/projects/permil.png",
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
