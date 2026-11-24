import { defineConfig, devices } from "@playwright/test";

/**
 * Tests del sitio. Corren contra el build de producción:
 *
 *   npm test
 *
 * Playwright construye el sitio y lo levanta en el puerto 3100 (no choca con
 * `npm run dev`). Usa el Chrome instalado en el equipo, así que no hace falta
 * descargar navegadores. Con PW_REUSE=1 reutiliza un servidor ya levantado
 * en ese puerto (útil mientras se corrige algo).
 */
const PORT = 3100;

// El iPhone 14 se emula en Chrome (tamaño, pantalla táctil y user agent);
// su navegador por defecto, WebKit, habría que descargarlo aparte.
const { defaultBrowserType: _webkit, ...iPhone14 } = devices["iPhone 14"];
void _webkit;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  timeout: 45_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: "chrome",
    // WebGL por software: la rueda carga igual en equipos sin GPU.
    launchOptions: {
      args: ["--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
    },
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "escritorio",
      testIgnore: /celular\.spec\.ts/,
      use: { viewport: { width: 1280, height: 800 } },
    },
    {
      name: "iphone-14",
      testMatch: /celular\.spec\.ts/,
      use: { ...iPhone14, browserName: "chromium" },
    },
    {
      name: "pixel-7",
      testMatch: /celular\.spec\.ts/,
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !!process.env.PW_REUSE,
    timeout: 240_000,
  },
});
