import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { RootShell } from "@/components/layout/RootShell";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

// Todo el sitio es estático: ninguna ruta se renderiza por petición.
// Así una URL que no existe responde 404 real con su página completa.
export const ensureStatic = "navigation";

export const viewport: Viewport = {
  themeColor: "#f2f1ec",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <RootShell lang="es">{children}</RootShell>;
}
