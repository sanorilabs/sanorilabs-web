import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getContent } from "@/content";
import type { Lang } from "@/content/types";
import { ogSize } from "@/lib/og-meta";


const color = {
  paper: "#F2F1EC",
  ink: "#111111",
  cobalt: "#1F3DFF",
  grid: "#D9D7CF",
  muted: "#4A4A46",
};

// next/og no puede usar next/font: lee los .woff de los paquetes @fontsource.
function loadFont(family: "sans" | "mono", weight: 400 | 500 | 600) {
  return readFile(
    join(
      process.cwd(),
      "node_modules/@fontsource",
      `ibm-plex-${family}`,
      "files",
      `ibm-plex-${family}-latin-${weight}-normal.woff`,
    ),
  );
}

// Se leen una vez al cargar el módulo: así la imagen se genera en el build.
const [sans600, mono400, mono500] = await Promise.all([
  loadFont("sans", 600),
  loadFont("mono", 400),
  loadFont("mono", 500),
]);

/** Imagen para compartir: casilla Sn 00 y el lema, sobre papel. */
export function renderOg(lang: Lang) {
  const t = getContent(lang);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: color.paper,
          color: color.ink,
          fontFamily: "Plex Sans",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <div
            style={{
              width: 320,
              height: 320,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "18px 24px 20px",
              border: `13px solid ${color.ink}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "Plex Mono",
                fontSize: 30,
              }}
            >
              <div style={{ color: color.cobalt, fontWeight: 500 }}>00</div>
              <div>LABS</div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: 136,
                fontWeight: 600,
                letterSpacing: -3,
                lineHeight: 1,
              }}
            >
              Sn
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontFamily: "Plex Mono",
                fontSize: 30,
              }}
            >
              Sanori
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              width: 688,
              marginLeft: 64,
              fontSize: 84,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.02,
            }}
          >
            {t.hero.title.split(" ").map((word, index) => (
              <div key={index} style={{ display: "flex", marginRight: 24 }}>
                {word}
              </div>
            ))}
            <div
              style={{
                width: 40,
                height: 66,
                marginBottom: 9,
                marginLeft: -12,
                background: color.cobalt,
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: `2px solid ${color.grid}`,
            fontFamily: "Plex Mono",
            fontSize: 26,
          }}
        >
          <div style={{ display: "flex", fontWeight: 500 }}>
            <div style={{ color: color.cobalt }}>[</div>
            <div>sanori</div>
            <div style={{ color: color.cobalt }}>]</div>
            <div style={{ marginLeft: 16 }}>labs</div>
          </div>
          <div style={{ color: color.muted }}>sanorilabs.com</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Plex Sans", data: sans600, weight: 600, style: "normal" },
        { name: "Plex Mono", data: mono400, weight: 400, style: "normal" },
        { name: "Plex Mono", data: mono500, weight: 500, style: "normal" },
      ],
    },
  );
}
