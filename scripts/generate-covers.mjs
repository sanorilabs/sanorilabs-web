// Genera las portadas placeholder de /public/projects: la casilla Sn grande
// de cada proyecto sobre papel. Para usar una captura real, reemplaza el PNG
// con el mismo nombre (1600×1000). Este script vuelve a crear los placeholders.
//
//   node scripts/generate-covers.mjs
//
// Los códigos y nombres deben coincidir con content/projects.ts.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const covers = [
  { file: "casora", code: "EXP-01", corner: "01", label: "Casora", name: "Casora" },
  { file: "nola", code: "EXP-02", corner: "02", label: "Nola", name: "Nola" },
  { file: "pl-grupo-comercial", code: "CLI-01", corner: "CLI-01", label: "P&L", name: "P&L Grupo Comercial" },
  { file: "permil", code: "CLI-02", corner: "CLI-02", label: "Permil", name: "Permil" },
];

const color = {
  paper: "#F2F1EC",
  ink: "#111111",
  cobalt: "#1F3DFF",
  grid: "#D9D7CF",
  muted: "#4A4A46",
};

const font = (family, weight) =>
  readFile(
    join(
      root,
      "node_modules/@fontsource",
      `ibm-plex-${family}`,
      "files",
      `ibm-plex-${family}-latin-${weight}-normal.woff`,
    ),
  );

// Elemento sin JSX: h("div", estilo, ...hijos).
const h = (type, style, ...children) => ({
  type,
  props: {
    style: { display: "flex", ...style },
    children: children.length === 1 ? children[0] : children,
  },
});

function cover({ code, corner, label, name }) {
  const mono = { fontFamily: "Plex Mono", fontSize: 30, letterSpacing: 2 };

  const tile = h(
    "div",
    {
      width: 520,
      height: 520,
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "30px 40px 34px",
      border: `21px solid ${color.ink}`,
      background: color.paper,
    },
    h(
      "div",
      { justifyContent: "space-between", fontFamily: "Plex Mono", fontSize: 48 },
      h("div", { color: color.cobalt, fontWeight: 500 }, corner),
      h("div", {}, "LABS"),
    ),
    h(
      "div",
      {
        justifyContent: "center",
        fontSize: 220,
        fontWeight: 600,
        letterSpacing: -4,
        lineHeight: 1,
      },
      "Sn",
    ),
    h("div", { justifyContent: "center", fontFamily: "Plex Mono", fontSize: 48 }, label),
  );

  return h(
    "div",
    {
      width: "100%",
      height: "100%",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: 56,
      background: color.paper,
      color: color.ink,
      fontFamily: "Plex Sans",
    },
    h(
      "div",
      { ...mono, justifyContent: "space-between", paddingBottom: 24, borderBottom: `2px solid ${color.grid}` },
      h("div", { fontWeight: 500 }, code),
      h("div", { color: color.muted }, "SANORI LABS"),
    ),
    h("div", { justifyContent: "center", alignItems: "center", flexGrow: 1 }, tile),
    h(
      "div",
      { ...mono, justifyContent: "space-between", paddingTop: 24, borderTop: `2px solid ${color.grid}` },
      h("div", {}, name.toUpperCase()),
      h("div", { color: color.cobalt }, "Sn"),
    ),
  );
}

const fonts = [
  { name: "Plex Sans", data: await font("sans", 600), weight: 600, style: "normal" },
  { name: "Plex Mono", data: await font("mono", 400), weight: 400, style: "normal" },
  { name: "Plex Mono", data: await font("mono", 500), weight: 500, style: "normal" },
];

const outDir = join(root, "public/projects");
await mkdir(outDir, { recursive: true });

for (const item of covers) {
  const image = new ImageResponse(cover(item), { width: 1600, height: 1000, fonts });
  const out = join(outDir, `${item.file}.png`);
  await writeFile(out, Buffer.from(await image.arrayBuffer()));
  console.log(`creado ${out}`);
}
