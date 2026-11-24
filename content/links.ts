/**
 * Enlaces de contacto. Un enlace vacío ("") no se muestra en el sitio.
 */
export const links = {
  email: "sanorilabs@gmail.com",
  /** Solo dígitos, con lada de país. Ejemplo: "528112345678". */
  whatsapp: "",
  /** URL completa. Ejemplo: "https://instagram.com/usuario". */
  instagram: "",
  linkedin: "",
  github: "",
};

/** A dónde lleva "Cotiza tu sitio": WhatsApp si hay número; si no, correo. */
export function quoteHref(): string {
  return links.whatsapp
    ? `https://wa.me/${links.whatsapp}`
    : `mailto:${links.email}`;
}

/** Enlaces de contacto con valor, en el orden en que se muestran. */
export function contactLinks(): { label: string; href: string }[] {
  const all = [
    {
      label: "WhatsApp",
      href: links.whatsapp ? `https://wa.me/${links.whatsapp}` : "",
    },
    { label: "Instagram", href: links.instagram },
    { label: "LinkedIn", href: links.linkedin },
    { label: "GitHub", href: links.github },
  ];
  return all.filter((link) => link.href !== "");
}
