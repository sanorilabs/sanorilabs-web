import type { Content } from "./types";

export const es: Content = {
  meta: {
    title: "Sanori Labs — Sebastián Noriega | Productos y sitios web",
    description:
      "Sanori Labs es el estudio de Sebastián Noriega: construyo negocios propios como Casora y Nola, y sitios web para empresas en México.",
    siteName: "Sanori Labs",
  },

  nav: {
    projects: "Proyectos",
    cases: "Casos",
    about: "Sobre mí",
    contact: "Contacto",
    menu: "Menú",
    skip: "Saltar al contenido",
    switchLang: "English",
  },

  hero: {
    label: "Sn 00 · SANORI LABS · MONTERREY, MX",
    title: "Construir, probar, lanzar.",
    subtitle:
      "Soy Sebastián Noriega. En Sanori Labs construyo mis propios negocios y hago sitios web para empresas en México. Cada proyecto es un experimento con estado real.",
    primaryCta: "Ver proyectos",
    secondaryCta: "Escríbeme",
    stats: ["2 negocios propios", "2 sitios para clientes", "León y Monterrey"],
  },

  status: {
    production: "en producción",
    validating: "en validación",
    delivered: "entregado",
    preparing: "en preparación",
  },

  ui: {
    viewProject: "Ver proyecto",
    viewSite: "Ver sitio",
    nextProject: "Siguiente proyecto",
    viewAsGrid: "Ver como grilla",
    viewAsWheel: "Ver como rueda",
    coverAlt: "Sitio de {name} en escritorio y celular",
    previous: "Anterior",
    next: "Siguiente",
    links: "Enlaces",
  },

  home: {
    projectsTitle: "Proyectos",
    projectsIntro:
      "Negocios propios. Cada uno lleva su número y su estado actual.",
    casesTitle: "Casos de estudio",
    casesIntro:
      "Sitios web para empresas: qué necesitaban, qué hice y cómo quedó.",
  },

  projects: {
    casora: {
      lead: "Marketplace de muebles nuevos y usados en León, Guanajuato, en web y apps para iOS y Android.",
      blocks: [],
      specs: [
        { label: "Desde", value: "septiembre de 2025" },
        { label: "Mi rol", value: "fundador; producto y desarrollo" },
        { label: "Stack", value: "Next.js, Firebase, Mercado Pago" },
      ],
    },
    nola: {
      lead: "Publicidad que refresca. Las marcas patrocinan latas de agua que se regalan en cafeterías, gyms, coworkings y universidades de Monterrey.",
      blocks: [
        {
          label: "Cómo funciona",
          text: "La marca paga su publicidad en la lata, la gente recibe agua gratis y el lugar recibe producto gratis.",
        },
        {
          label: "Impacto",
          text: "Al llegar a ciertos hitos de producción, Nola dona latas a TECHO México.",
        },
      ],
      specs: [
        {
          label: "Mi rol",
          value:
            "cofundador con Sebastian Huerta. Marca y landing, campaña de Instagram, ventas y proveedores.",
        },
        {
          label: "Estado",
          value: "preventa, con la primera venta cerrada.",
        },
      ],
    },
  },

  cases: {
    "pl-grupo-comercial": {
      kind: "Servicio automotriz",
      client:
        "P&L Grupo Comercial, en León: distribución multimarca de llantas y rines, mantenimiento rápido, servicio móvil a domicilio y atención a flotillas.",
      challenge:
        "Su sitio era una plantilla genérica de tienda en línea, con productos de ejemplo y datos de contacto de relleno. No mostraba lo que la empresa hace ni daba una forma clara de cotizar.",
      steps: [
        "Reemplacé la plantilla por un sitio informativo, rápido y adaptado a celular.",
        "Con inicio, servicios, ubicación y la cotización por WhatsApp como acción principal.",
        "Registré el dominio a nombre del cliente.",
        "Lo publiqué en Cloudflare.",
      ],
      result: "Entregado en 4 a 6 días hábiles y aprobado por el cliente.",
      stack:
        "HTML, CSS y JavaScript sin framework (sitio estático) · Cloudflare",
    },
    permil: {
      kind: "Grúas",
      client:
        "Grúas para vehículos ligeros y pesados; atiende a aseguradoras, agencias y público en general.",
      challenge:
        "Los datos de contacto estaban desactualizados y el sitio estaba bloqueado para Google, así que no aparecía en búsquedas.",
      steps: [
        "Actualicé su sitio de WordPress con fotos y textos nuevos.",
        "Corregí WhatsApp y contacto.",
        "Quité el bloqueo a Google.",
        "Conservé las ciudades y el cotizador que ya funcionaban.",
      ],
      result: "Publicado una semana después del pago y abierto a Google.",
      stack: "WordPress",
    },
  },

  caseLabels: {
    client: "Cliente",
    challenge: "Reto",
    done: "Qué hice",
    result: "Resultado",
    stack: "Stack",
  },

  services: {
    title: "¿Tu negocio necesita sitio web?",
    cards: [
      {
        title: "Sitio nuevo",
        body: "Diseño, desarrollo, dominio, adaptado a celular, WhatsApp y publicación.",
        example: "Ejemplo: P&L Grupo Comercial, en 4 a 6 días hábiles.",
      },
      {
        title: "Actualización",
        body: "Textos, fotos, datos de contacto y visibilidad en Google sobre tu sitio actual.",
        example: "Ejemplo: Permil, en una semana.",
      },
    ],
    cta: "Cotiza tu sitio",
  },

  about: {
    title: "Sobre mí",
    paragraphs: [
      [
        "Soy Sebastián Noriega Olavarrieta, estudiante de Ingeniería en Tecnologías Computacionales en el Tec de Monterrey. Soy de León, Guanajuato, y vivo en Monterrey.",
      ],
      [
        "Sanori Labs es la marca con la que firmo todo lo que construyo. El nombre sale de mi nombre: ",
        { hl: "S" },
        "eb",
        { hl: "a" },
        "stián ",
        { hl: "Nori" },
        "ega → Sanori. El símbolo es una casilla de la tabla periódica: Sn.",
      ],
      [
        "Cada proyecto empieza como un experimento: lo lanzo, veo qué pasa y decido si crece.",
      ],
      [
        "He viajado a más de 50 países. Ver cómo se resuelven los mismos problemas en lugares tan distintos me dejó una costumbre: buscar lo que ya funciona afuera y preguntarme cómo funcionaría en México.",
      ],
    ],
    panelLabel: "Ficha",
    panel: [
      { label: "ubicación", value: "Monterrey, MX" },
      { label: "coordenadas", value: "25.67° N, 100.31° W" },
      { label: "hora local", value: "UTC−6", live: "time" },
      { label: "estudios", value: "ITC, Tec de Monterrey" },
      { label: "idiomas", value: "español, inglés" },
      { label: "países visitados", value: "50+", stat: true },
      { label: "proyectos activos", value: "2", stat: true },
      { label: "sitios entregados", value: "2", stat: true },
    ],
  },

  contact: {
    title: "¿Tienes una idea o un negocio que necesita sitio web? Escríbeme.",
    email: "Correo",
  },

  profiles: {
    github: "GitHub de Sebastián Noriega",
    linkedin: "LinkedIn de Sebastián Noriega",
  },

  footer: {
    tagline: "Construir, probar, lanzar.",
    copyright: "© 2026 Sanori Labs",
    made: "Hecho en Monterrey",
  },

  notFound: {
    title: "Página no encontrada",
    cta: "Volver al inicio",
  },

  journal: {
    title: "Bitácora",
  },
};
