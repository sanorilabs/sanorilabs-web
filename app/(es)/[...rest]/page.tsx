import { notFound } from "next/navigation";

// Cualquier ruta que no exista en este idioma cae aquí y muestra su 404.
// El sitio es estático, así que la ruta necesita al menos un ejemplo.
export function generateStaticParams() {
  return [{ rest: ["404"] }];
}

export default function CatchAll() {
  notFound();
}
