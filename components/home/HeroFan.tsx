import Image from "next/image";
import type { CSSProperties } from "react";
import { projects } from "@/content/projects";
import type { Lang } from "@/content/types";
import { coverAlt } from "@/lib/projects";

/**
 * Las cuatro portadas apiladas en abanico, a la derecha del hero. Al pasar
 * el ratón se separan un poco (CSS en globals.css, .hero-fan). Solo existe
 * en escritorio: en celular no se muestra ni se descargan sus imágenes.
 */
export function HeroFan({ lang }: { lang: Lang }) {
  return (
    <div className="hero-fan">
      {projects.map((project, index) => (
        <div
          key={project.slug}
          className="hero-fan-card"
          style={
            {
              "--i": index,
              zIndex: projects.length - index,
            } as CSSProperties
          }
        >
          <Image
            src={project.cover}
            alt={coverAlt(lang, project)}
            width={1600}
            height={1000}
            // Fuera de escritorio el abanico no se pinta: con carga diferida
            // el navegador ni siquiera pide estas imágenes.
            loading="lazy"
            sizes="(min-width: 1024px) 340px, 1px"
          />
        </div>
      ))}
    </div>
  );
}
