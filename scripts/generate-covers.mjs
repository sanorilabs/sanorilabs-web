// Portadas de los proyectos: fondo con el color de marca, logo arriba a la
// izquierda, captura de escritorio en un marco de navegador y la de celular
// encimada al lado. También arma la imagen para compartir (OG) de cada uno.
//
//   node scripts/generate-covers.mjs              compone con las capturas guardadas
//   node scripts/generate-covers.mjs --capture    vuelve a capturar los sitios antes
//
// Qué lee:
//   content/projects.ts            color de marca, logo y URL de cada proyecto
//   public/projects/logos/         logos (SVG o PNG transparente)
//   scripts/covers/captures/       capturas (las crea --capture)
// Qué escribe:
//   public/projects/<slug>.webp    portada 1600×1000 (rueda, grilla, página)
//   public/projects/og/<slug>.jpg  imagen para compartir 1200×630
//
// Pruebas sin tocar el sitio: COVERS_OUT=<carpeta> escribe en otra carpeta y
// COVERS_OVERRIDES='{"casora":{"color":"#123456"}}' cambia color, logo o placa.
import { access, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { projects } from "../content/projects.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CAPTURES = process.env.COVERS_CAPTURES ?? join(root, "scripts/covers/captures");
const OUT = process.env.COVERS_OUT ?? join(root, "public/projects");
const overrides = JSON.parse(process.env.COVERS_OVERRIDES ?? "{}");

const PAPER = "#F2F1EC";
const INK = "#111111";

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

const exists = (path) =>
  access(path).then(
    () => true,
    () => false,
  );

/** true si el color es oscuro (para elegir el contorno de los marcos). */
function isDark(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 110;
}

const svg = (width, height, body) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${body}</svg>`,
  );

/** Captura cada sitio en escritorio y celular. */
async function capture(list) {
  const { chromium } = await import("@playwright/test");
  await mkdir(CAPTURES, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome" });

  for (const project of list) {
    for (const [name, viewport, scale] of [
      ["desktop", DESKTOP, 1],
      ["mobile", MOBILE, 2],
    ]) {
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: scale,
        isMobile: name === "mobile",
        hasTouch: name === "mobile",
        reducedMotion: "reduce",
        locale: "es-MX",
      });
      const page = await context.newPage();
      await page.goto(project.url, { waitUntil: "load", timeout: 45_000 });
      await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
      await page.waitForTimeout(2500);
      const png = await page.screenshot();
      await sharp(png)
        .webp({ quality: 92 })
        .toFile(join(CAPTURES, `${project.slug}-${name}.webp`));
      await context.close();
      console.log(`capturado ${project.slug} (${name})`);
    }
  }
  await browser.close();
}

/** Captura de escritorio dentro de un marco de navegador simple. */
async function desktopFrame(file, width, dark) {
  const bar = Math.round(width * 0.031);
  const shotHeight = Math.round((width * DESKTOP.height) / DESKTOP.width);
  const shot = await sharp(file).resize(width, shotHeight).png().toBuffer();
  const dot = Math.round(bar * 0.26);
  const gap = Math.round(dot * 0.9);
  const dots = [0, 1, 2]
    .map(
      (i) =>
        `<rect x="${Math.round(bar * 0.45) + i * (dot + gap)}" y="${Math.round((bar - dot) / 2)}" width="${dot}" height="${dot}" fill="${INK}"/>`,
    )
    .join("");
  const height = bar + shotHeight;
  const outline = dark ? "rgba(255,255,255,0.28)" : "rgba(17,17,17,0.35)";

  const image = await sharp({
    create: { width, height, channels: 4, background: PAPER },
  })
    .composite([
      { input: svg(width, bar, dots), left: 0, top: 0 },
      { input: shot, left: 0, top: bar },
      {
        input: svg(
          width,
          height,
          `<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="${outline}"/>` +
            `<rect x="0" y="${bar - 1}" width="${width}" height="1" fill="rgba(17,17,17,0.18)"/>`,
        ),
        left: 0,
        top: 0,
      },
    ])
    .png()
    .toBuffer();
  return { image, width, height };
}

/** Captura de celular dentro de un marco oscuro. */
async function mobileFrame(file, shotWidth, dark) {
  const border = Math.round(shotWidth * 0.036);
  const shotHeight = Math.round((shotWidth * MOBILE.height) / MOBILE.width);
  const shot = await sharp(file).resize(shotWidth, shotHeight).png().toBuffer();
  const width = shotWidth + border * 2;
  const height = shotHeight + border * 2;
  const outline = dark ? "rgba(255,255,255,0.35)" : "rgba(17,17,17,0)";

  const image = await sharp({
    create: { width, height, channels: 4, background: INK },
  })
    .composite([
      { input: shot, left: border, top: border },
      {
        input: svg(
          width,
          height,
          `<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="${outline}"/>`,
        ),
        left: 0,
        top: 0,
      },
    ])
    .png()
    .toBuffer();
  return { image, width, height };
}

/** Logo ajustado a una caja; con `plate`, sobre una placa de ese color. */
async function logoBlock(file, maxWidth, maxHeight, plate) {
  const logo = await sharp(file, { density: 300 })
    .resize({ width: maxWidth, height: maxHeight, fit: "inside" })
    .png()
    .toBuffer();
  if (!plate) return logo;
  const meta = await sharp(logo).metadata();
  const pad = Math.round(maxHeight * 0.3);
  return sharp({
    create: {
      width: meta.width + pad * 2,
      height: meta.height + pad * 2,
      channels: 4,
      background: plate,
    },
  })
    .composite([{ input: logo, left: pad, top: pad }])
    .png()
    .toBuffer();
}

/** Recorta lo que se sale del lienzo (sharp no admite capas que lo desborden). */
async function clip(layer, canvas) {
  const meta = await sharp(layer.input).metadata();
  const width = Math.min(meta.width, canvas.width - layer.left);
  const height = Math.min(meta.height, canvas.height - layer.top);
  if (width === meta.width && height === meta.height) return layer;
  return {
    ...layer,
    input: await sharp(layer.input).extract({ left: 0, top: 0, width, height }).toBuffer(),
  };
}

async function compose(project) {
  const custom = overrides[project.slug] ?? {};
  const color = custom.color ?? project.brand?.color;
  const logoFile = custom.logo ?? (project.brand?.logo ? join(root, "public", project.brand.logo) : null);
  const plate = custom.plate ?? project.brand?.logoPlate;
  if (!color) throw new Error(`${project.slug}: falta brand.color en content/projects.ts`);

  const desktopFile = join(CAPTURES, `${project.slug}-desktop.webp`);
  const mobileFile = join(CAPTURES, `${project.slug}-mobile.webp`);
  for (const file of [desktopFile, mobileFile]) {
    if (!(await exists(file))) {
      throw new Error(`Falta ${file}. Corre el script con --capture.`);
    }
  }
  const dark = isDark(color);
  const hasLogo = logoFile && (await exists(logoFile));
  if (!hasLogo) console.warn(`aviso: ${project.slug} no tiene logo; la portada sale sin él`);

  // Portada 1600×1000.
  {
    const canvas = { width: 1600, height: 1000 };
    const desktop = await desktopFrame(desktopFile, 1180, dark);
    const mobile = await mobileFrame(mobileFile, 280, dark);
    const layers = [
      { input: desktop.image, left: 72, top: 176 },
      { input: mobile.image, left: canvas.width - 72 - mobile.width, top: canvas.height - 40 - mobile.height },
    ];
    if (hasLogo) {
      const logo = await logoBlock(logoFile, 360, 76, plate);
      const meta = await sharp(logo).metadata();
      layers.push({ input: logo, left: 72, top: Math.round((176 - meta.height) / 2) });
    }
    await mkdir(OUT, { recursive: true });
    await sharp({ create: { ...canvas, channels: 3, background: color } })
      .composite(await Promise.all(layers.map((layer) => clip(layer, canvas))))
      .webp({ quality: 84 })
      .toFile(join(OUT, `${project.slug}.webp`));
  }

  // Imagen para compartir 1200×630: mismo arreglo, recortado por abajo.
  {
    const canvas = { width: 1200, height: 630 };
    const desktop = await desktopFrame(desktopFile, 860, dark);
    const mobile = await mobileFrame(mobileFile, 196, dark);
    const layers = [
      { input: desktop.image, left: 56, top: 146 },
      { input: mobile.image, left: canvas.width - 56 - mobile.width, top: 220 },
    ];
    if (hasLogo) {
      const logo = await logoBlock(logoFile, 300, 62, plate);
      const meta = await sharp(logo).metadata();
      layers.push({ input: logo, left: 56, top: Math.round((146 - meta.height) / 2) });
    }
    await mkdir(join(OUT, "og"), { recursive: true });
    await sharp({ create: { ...canvas, channels: 3, background: color } })
      .composite(await Promise.all(layers.map((layer) => clip(layer, canvas))))
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(join(OUT, "og", `${project.slug}.jpg`));
  }

  console.log(`portada de ${project.slug} lista (${color})`);
}

const list = projects.map((project) => ({
  ...project,
  // La primera URL del proyecto es su sitio.
  url: project.links[0].href,
}));

if (process.argv.includes("--capture")) await capture(list);
for (const project of list) await compose(project);
