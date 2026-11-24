import type { CliSlug, ExpSlug, Slug } from "./projects";

export type Lang = "es" | "en";

export type StatusKey = "production" | "validating" | "delivered" | "preparing";

/** Texto con partes resaltadas en cobalto: "normal" o { hl: "resaltado" }. */
export type Rich = (string | { hl: string })[];

export interface Block {
  label: string;
  text: string;
}

export interface Spec {
  label: string;
  value: string;
}

/** Texto de un negocio propio (EXP). */
export interface ProjectText {
  /** Descripción corta: grilla, rueda y encabezado de la página. */
  lead: string;
  /** Bloques de texto largos (cómo funciona, impacto...). */
  blocks: Block[];
  /** Ficha en mono (desde, mi rol, stack, estado...). */
  specs: Spec[];
}

/** Texto de un caso de estudio (CLI). */
export interface CaseText {
  /** Giro del cliente. */
  kind: string;
  /** Resumen de una línea. Opcional. */
  summary?: string;
  client: string;
  challenge: string;
  /** "Qué hice", paso por paso. */
  steps: string[];
  result: string;
  stack: string;
}

export interface Content {
  meta: {
    title: string;
    description: string;
    /** Sufijo del título en las páginas interiores. */
    siteName: string;
  };
  nav: {
    projects: string;
    cases: string;
    about: string;
    contact: string;
    menu: string;
    skip: string;
    /** Texto accesible del enlace al otro idioma. */
    switchLang: string;
  };
  hero: {
    label: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    stats: string[];
  };
  status: Record<StatusKey, string>;
  ui: {
    viewProject: string;
    viewSite: string;
    nextProject: string;
    viewAsGrid: string;
    viewAsWheel: string;
    previous: string;
    next: string;
    links: string;
  };
  home: {
    projectsTitle: string;
    projectsIntro: string;
    casesTitle: string;
    casesIntro: string;
  };
  projects: Record<ExpSlug, ProjectText>;
  cases: Record<CliSlug, CaseText>;
  caseLabels: {
    client: string;
    challenge: string;
    done: string;
    result: string;
    stack: string;
  };
  services: {
    title: string;
    cards: { title: string; body: string; example: string }[];
    cta: string;
  };
  about: {
    title: string;
    paragraphs: Rich[];
    /** Nombre accesible del panel de datos. */
    panelLabel: string;
    /**
     * live: "time" marca la fila con la hora de Monterrey en vivo.
     * stat: true muestra el valor como número grande al pie del panel.
     */
    panel: (Spec & { live?: "time"; stat?: boolean })[];
  };
  contact: {
    title: string;
    email: string;
  };
  footer: {
    tagline: string;
    copyright: string;
    made: string;
  };
  notFound: {
    title: string;
    cta: string;
  };
  journal: {
    title: string;
  };
}

export type { Slug };
