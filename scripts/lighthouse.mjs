// Lighthouse móvil sobre el build de producción, como primera visita.
//
//   npm run build
//   npm run start -- -p 3100      (en otra terminal)
//   npm run lighthouse
//
// Mide cada página dos veces: "con loader" (primera página de la sesión) y
// "sin loader" (la sesión ya tenía una visita). De cada caso corre varias
// pasadas y se queda con la mediana, porque Lighthouse varía entre pasadas.
//
// Variables: LH_BASE (por defecto http://localhost:3100), LH_RUNS (3),
// LH_PAGES (rutas separadas por coma), LH_THROTTLING (simulate | devtools),
// LH_OUT (carpeta de informes).
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Launcher } from "chrome-launcher";
import lighthouse from "lighthouse";
import puppeteer from "puppeteer-core";

const BASE = process.env.LH_BASE ?? "http://localhost:3100";
const RUNS = Number(process.env.LH_RUNS ?? 3);
const PAGES = (process.env.LH_PAGES ?? "/,/proyectos/casora,/sobre-mi").split(",");
const MODES = [
  { name: "con loader", skipLoader: false },
  { name: "sin loader", skipLoader: true },
];
// "simulate" (por defecto en Lighthouse) calcula los tiempos a partir de una
// carga sin límite; "devtools" limita de verdad la red y la CPU mientras carga.
const THROTTLING = process.env.LH_THROTTLING ?? "simulate";
// Debe coincidir con loader.sessionKey en lib/motion.ts.
const LOADER_KEY = "sn-loader";

const outDir =
  process.env.LH_OUT ??
  join(dirname(fileURLToPath(import.meta.url)), "..", "lighthouse-reports");
const chromePath = Launcher.getInstallations()[0];
if (!chromePath) throw new Error("No encontré Chrome instalado.");

async function runOnce(url, skipLoader) {
  // Navegador y perfil nuevos en cada pasada: sin caché ni sesión previa.
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-first-run", "--no-default-browser-check"],
  });
  try {
    const page = await browser.newPage();
    if (skipLoader) {
      // Deja la sesión como "ya visitada" sin descargar nada del sitio:
      // robots.txt es del mismo origen y no trae CSS, fuentes ni scripts,
      // así que la caché sigue vacía como en una primera visita.
      await page.goto(new URL("/robots.txt", url).href);
      await page.evaluate((key) => {
        window.sessionStorage.setItem(key, "1");
      }, LOADER_KEY);
    }
    // Configuración por defecto de Lighthouse: móvil, red y CPU simuladas.
    const result = await lighthouse(
      url,
      {
        logLevel: "error",
        onlyCategories: ["performance", "accessibility"],
        throttlingMethod: THROTTLING,
        // Sin esto Lighthouse borraría la marca de sesión recién puesta.
        disableStorageReset: skipLoader,
      },
      undefined,
      page,
    );
    return result.lhr;
  } finally {
    await browser.close();
  }
}

const ms = (lhr, id) => Math.round(lhr.audits[id].numericValue);

function summarize(lhr) {
  const a11y = lhr.categories.accessibility;
  return {
    performance: Math.round(lhr.categories.performance.score * 100),
    accessibility: Math.round(a11y.score * 100),
    fcp: ms(lhr, "first-contentful-paint"),
    lcp: ms(lhr, "largest-contentful-paint"),
    tbt: ms(lhr, "total-blocking-time"),
    cls: Number(lhr.audits["cumulative-layout-shift"].numericValue.toFixed(3)),
    si: ms(lhr, "speed-index"),
    a11yFailures: a11y.auditRefs
      .filter((ref) => lhr.audits[ref.id].score !== null && lhr.audits[ref.id].score < 1)
      .map((ref) => ref.id),
  };
}

await mkdir(outDir, { recursive: true });
const rows = [];

for (const path of PAGES) {
  for (const mode of MODES) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) {
      const lhr = await runOnce(BASE + path, mode.skipLoader);
      runs.push({ lhr, summary: summarize(lhr) });
      process.stdout.write(
        `  ${path} · ${mode.name} · pasada ${i + 1}/${RUNS}: ` +
          `Performance ${runs[i].summary.performance}, LCP ${runs[i].summary.lcp} ms\n`,
      );
    }
    // Mediana por puntuación de Performance.
    runs.sort((a, b) => a.summary.performance - b.summary.performance);
    const median = runs[Math.floor(runs.length / 2)];
    const slug = `${path === "/" ? "home" : path.slice(1).replaceAll("/", "-")}-${mode.name.replace(" ", "-")}`;
    await writeFile(join(outDir, `${slug}.json`), JSON.stringify(median.lhr));
    rows.push({
      page: path,
      mode: mode.name,
      ...median.summary,
      allPerformance: runs.map((run) => run.summary.performance),
    });
  }
}

await writeFile(join(outDir, "summary.json"), JSON.stringify(rows, null, 2));

console.log("\nPágina | Caso | Performance | Accesibilidad | FCP | LCP | TBT | CLS | Speed Index");
for (const row of rows) {
  console.log(
    `${row.page} | ${row.mode} | ${row.performance} (${row.allPerformance.join(", ")}) | ` +
      `${row.accessibility} | ${row.fcp} ms | ${row.lcp} ms | ${row.tbt} ms | ${row.cls} | ${row.si} ms` +
      (row.a11yFailures.length ? ` | falla: ${row.a11yFailures.join(", ")}` : ""),
  );
}
console.log(`\nInformes completos (mediana de cada caso) en ${outDir}`);
