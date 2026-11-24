import { renderOg } from "@/lib/og";

// Imagen para compartir en inglés. URL fija: /og/en.png
export function GET() {
  return renderOg("en");
}
