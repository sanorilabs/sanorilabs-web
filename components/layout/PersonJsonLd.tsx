import { person } from "@/content/person";

/**
 * Datos estructurados (JSON-LD, schema.org/Person): le dicen a los buscadores
 * quién está detrás del sitio y cuáles son sus perfiles. No pinta nada.
 * Los valores salen de content/person.ts.
 */
export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.jobTitle,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: person.alumniOf,
    },
    url: person.url,
    sameAs: person.sameAs.filter((url) => url !== ""),
  };

  return (
    <script
      type="application/ld+json"
      // "<" escapado: ningún valor puede cerrar la etiqueta <script>.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
