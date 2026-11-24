import { renderOg } from "@/lib/og";

// Imagen para compartir en español. URL fija: /og/es.png
export function GET() {
  return renderOg("es");
}
