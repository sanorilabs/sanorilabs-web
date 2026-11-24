// Genera app/favicon.ico (48×48) con el mismo dibujo que app/icon.svg:
// cuadrado tinta con "Sn" en papel. Es el respaldo para navegadores que
// no usan favicons SVG.
//
//   node scripts/generate-favicon.mjs
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const size = 48;

const sans600 = await readFile(
  join(
    root,
    "node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff",
  ),
);

const image = new ImageResponse(
  {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111111",
        color: "#F2F1EC",
        fontFamily: "Plex Sans",
        fontSize: 26,
        fontWeight: 600,
        letterSpacing: -0.5,
      },
      children: "Sn",
    },
  },
  {
    width: size,
    height: size,
    fonts: [{ name: "Plex Sans", data: sans600, weight: 600, style: "normal" }],
  },
);
const png = Buffer.from(await image.arrayBuffer());

// Contenedor ICO con una sola imagen PNG.
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reservado
header.writeUInt16LE(1, 2); // tipo: icono
header.writeUInt16LE(1, 4); // número de imágenes
header.writeUInt8(size, 6); // ancho
header.writeUInt8(size, 7); // alto
header.writeUInt8(0, 8); // paleta
header.writeUInt8(0, 9); // reservado
header.writeUInt16LE(1, 10); // planos
header.writeUInt16LE(32, 12); // bits por pixel
header.writeUInt32LE(png.length, 14); // tamaño del PNG
header.writeUInt32LE(22, 18); // dónde empieza

const out = join(root, "app/favicon.ico");
await writeFile(out, Buffer.concat([header, png]));
console.log(`creado ${out}`);
