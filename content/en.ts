import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "Sanori Labs — Sebastián Noriega | Products & websites",
    description:
      "Sanori Labs is Sebastián Noriega's studio: I build my own businesses, like Casora and Nola, and websites for companies in Mexico.",
    siteName: "Sanori Labs",
  },

  nav: {
    projects: "Projects",
    cases: "Case studies",
    about: "About",
    contact: "Contact",
    menu: "Menu",
    skip: "Skip to content",
    switchLang: "Español",
  },

  hero: {
    label: "Sn 00 · SANORI LABS · MONTERREY, MX",
    title: "Build. Test. Ship.",
    subtitle:
      "I'm Sebastián Noriega. At Sanori Labs I build my own businesses and websites for companies in Mexico. Every project is an experiment with a real status.",
    primaryCta: "See projects",
    secondaryCta: "Get in touch",
    stats: ["2 own businesses", "2 client websites", "León & Monterrey"],
  },

  status: {
    production: "in production",
    validating: "validating",
    delivered: "delivered",
    preparing: "in preparation",
  },

  ui: {
    viewProject: "View project",
    viewSite: "View site",
    nextProject: "Next project",
    viewAsGrid: "View as grid",
    viewAsWheel: "View as wheel",
    coverAlt: "{name} website on desktop and mobile",
    previous: "Previous",
    next: "Next",
    links: "Links",
  },

  home: {
    projectsTitle: "Projects",
    projectsIntro:
      "My own businesses. Each one carries its number and its current status.",
    casesTitle: "Case studies",
    casesIntro:
      "Websites for companies: what they needed, what I did and how it turned out.",
  },

  projects: {
    casora: {
      lead: "Marketplace for new and used furniture in León, Guanajuato, on the web, iOS and Android.",
      blocks: [],
      specs: [
        { label: "Since", value: "September 2025" },
        { label: "My role", value: "founder; product and development" },
        { label: "Stack", value: "Next.js, Firebase, Mercado Pago" },
      ],
    },
    nola: {
      lead: "Advertising that refreshes: brands sponsor cans of water given away free at cafés, gyms, coworking spaces and universities in Monterrey.",
      blocks: [
        {
          label: "How it works",
          text: "The brand pays for its advertising on the can, people get free water and the venue gets free product.",
        },
        {
          label: "Impact",
          text: "When it reaches certain production milestones, Nola donates cans to TECHO México.",
        },
      ],
      specs: [
        {
          label: "My role",
          value:
            "co-founder with Sebastian Huerta. Brand and landing page, Instagram campaign, sales and suppliers.",
        },
        {
          label: "Status",
          value: "presale, with the first sale closed.",
        },
      ],
    },
  },

  cases: {
    "pl-grupo-comercial": {
      kind: "Auto service",
      summary:
        "Full website redesign for an auto service center, delivered in 4–6 business days.",
      client:
        "P&L Grupo Comercial, in León: multi-brand tire and wheel distribution, quick maintenance, mobile service at the customer's location and fleet service.",
      challenge:
        "Their site was a generic online-store template, with sample products and placeholder contact details. It didn't show what the company does or give a clear way to request a quote.",
      steps: [
        "Replaced the template with an informational site that is fast and mobile-friendly.",
        "With home, services, location and a WhatsApp quote as the main action.",
        "Registered the domain in the client's name.",
        "Published it on Cloudflare.",
      ],
      result: "Delivered in 4 to 6 business days and approved by the client.",
      stack:
        "HTML, CSS and JavaScript with no framework (static site) · Cloudflare",
    },
    permil: {
      kind: "Towing",
      summary:
        "Updated a towing company's WordPress site and opened it to Google search.",
      client:
        "Tow trucks for light and heavy vehicles; serves insurers, dealerships and the general public.",
      challenge:
        "The contact details were out of date and the site was blocked from Google, so it didn't show up in searches.",
      steps: [
        "Updated their WordPress site with new photos and copy.",
        "Fixed WhatsApp and contact details.",
        "Removed the block on Google.",
        "Kept the cities and the quote tool that already worked.",
      ],
      result: "Published one week after payment and open to Google.",
      stack: "WordPress",
    },
  },

  caseLabels: {
    client: "Client",
    challenge: "Challenge",
    done: "What I did",
    result: "Result",
    stack: "Stack",
  },

  services: {
    title: "Does your business need a website?",
    cards: [
      {
        title: "New site",
        body: "Design, development, domain, mobile-friendly, WhatsApp and publishing.",
        example: "Example: P&L Grupo Comercial, in 4 to 6 business days.",
      },
      {
        title: "Update",
        body: "Copy, photos, contact details and Google visibility on your current site.",
        example: "Example: Permil, in one week.",
      },
    ],
    cta: "Get a quote for your site",
  },

  about: {
    title: "About",
    paragraphs: [
      [
        "I'm Sebastián Noriega Olavarrieta, a Computer Science and Technology (ITC) student at Tec de Monterrey. I'm from León, Guanajuato, and I live in Monterrey.",
      ],
      [
        "Sanori Labs is the brand I sign everything I build with. The name comes from my own: ",
        { hl: "S" },
        "eb",
        { hl: "a" },
        "stián ",
        { hl: "Nori" },
        "ega → Sanori. The symbol is a periodic-table tile: Sn.",
      ],
      [
        "Every project starts as an experiment: I launch it, see what happens and decide whether it grows.",
      ],
      [
        "I've traveled to more than 50 countries. Seeing how the same problems get solved in such different places left me with a habit: looking for what already works abroad and asking how it would work in Mexico.",
      ],
    ],
    panelLabel: "Data sheet",
    panel: [
      { label: "location", value: "Monterrey, MX" },
      { label: "coordinates", value: "25.67° N, 100.31° W" },
      { label: "local time", value: "UTC−6", live: "time" },
      { label: "studies", value: "ITC, Tec de Monterrey" },
      { label: "languages", value: "Spanish, English" },
      { label: "countries visited", value: "50+", stat: true },
      { label: "active projects", value: "2", stat: true },
      { label: "sites delivered", value: "2", stat: true },
    ],
  },

  contact: {
    title: "Have an idea or a business that needs a website? Write to me.",
    email: "Email",
  },

  footer: {
    tagline: "Build. Test. Ship.",
    copyright: "© 2026 Sanori Labs",
    made: "Made in Monterrey",
  },

  notFound: {
    title: "Page not found",
    cta: "Back to home",
  },

  journal: {
    title: "Journal",
  },
};
