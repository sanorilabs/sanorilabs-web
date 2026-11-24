/**
 * Enlaces de contacto y perfiles. Un enlace vacío ("") no se muestra en el
 * sitio.
 */
export const links = {
  email: "sanorilabs@gmail.com",
  /** Solo dígitos, con lada de país. Ejemplo: "528112345678". */
  whatsapp: "",
  /** URL completa. Ejemplo: "https://instagram.com/usuario". */
  instagram: "",
  linkedin: "https://www.linkedin.com/in/sebastianoriegao",
  github: "https://github.com/sebonorai",
};

/** A dónde lleva "Cotiza tu sitio": WhatsApp si hay número; si no, correo. */
export function quoteHref(): string {
  return links.whatsapp
    ? `https://wa.me/${links.whatsapp}`
    : `mailto:${links.email}`;
}

export type ProfileId = "github" | "linkedin";

/**
 * Perfiles profesionales, en el orden en que se muestran: en el footer, en
 * Sobre mí (como botones) y, el de GitHub, en el menú.
 */
export function profileLinks(): { id: ProfileId; label: string; href: string }[] {
  const all: { id: ProfileId; label: string; href: string }[] = [
    { id: "github", label: "GitHub", href: links.github },
    { id: "linkedin", label: "LinkedIn", href: links.linkedin },
  ];
  return all.filter((link) => link.href !== "");
}

/** Otros enlaces de contacto con valor: la lista bajo el correo en Sobre mí. */
export function contactLinks(): { label: string; href: string }[] {
  const all = [
    {
      label: "WhatsApp",
      href: links.whatsapp ? `https://wa.me/${links.whatsapp}` : "",
    },
    { label: "Instagram", href: links.instagram },
  ];
  return all.filter((link) => link.href !== "");
}
