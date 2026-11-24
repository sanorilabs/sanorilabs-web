import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { SnTile } from "@/components/brand/SnTile";
import type { ProjectMeta } from "@/content/projects";
import { tileProps } from "@/lib/projects";

interface ProjectCoverProps {
  project: ProjectMeta;
  /** Anchos para next/image. */
  sizes: string;
  /** true en el encabezado de la página del proyecto. */
  eager?: boolean;
}

/**
 * Portada 16:10 del proyecto. Si el archivo no existe en /public,
 * se dibuja la casilla Sn en su lugar.
 */
export function ProjectCover({
  project,
  sizes,
  eager = false,
}: ProjectCoverProps) {
  const hasFile = existsSync(join(process.cwd(), "public", project.cover));

  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-paper">
      {hasFile ? (
        <Image
          src={project.cover}
          alt=""
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <SnTile {...tileProps(project)} size={160} decorative />
        </div>
      )}
    </div>
  );
}
