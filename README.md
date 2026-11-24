# Sanori Labs · sanorilabs.com

Sitio de Sanori Labs, la marca con la que Sebastián Noriega firma sus proyectos: negocios propios (Casora, Nola) y sitios web para clientes. Está en español (`/`) y en inglés (`/en`).

Hecho con Next.js (App Router), TypeScript y Tailwind CSS. Es un sitio estático, sin base de datos ni backend, y se despliega en Vercel.

## Desarrollo

Requiere Node.js 20 o más reciente.

```bash
npm install
npm run dev
```

El sitio queda en http://localhost:3000. Antes de publicar:

```bash
npm run build
npm run lint
```

## Tests

```bash
npm test
```

Construye el sitio, lo levanta en el puerto 3100 y corre los tests de `tests/` con Playwright y axe: rutas, celular, rueda, movimiento reducido, sin JavaScript, teclado, accesibilidad, enlaces, textos y loader. Usa el Chrome instalado en el equipo; no descarga navegadores.

## Lighthouse

Con el build de producción levantado en el puerto 3100:

```bash
npm run build
npm run start -- -p 3100
```

y en otra terminal:

```bash
npm run lighthouse
```

Mide `/`, `/proyectos/casora` y `/sobre-mi` en móvil, con loader y sin loader, y guarda los informes en `lighthouse-reports/`.

## Dónde se edita cada cosa

| Qué | Dónde |
| --- | --- |
| Textos en español | `content/es.ts` |
| Textos en inglés | `content/en.ts` (misma estructura que `es.ts`) |
| Proyectos: código, casilla, estado, portada y sus enlaces | `content/projects.ts` |
| Correo, WhatsApp, Instagram, LinkedIn y GitHub | `content/links.ts` |
| Portadas de los proyectos | `public/projects/` (PNG de 1600×1000) |
| Duraciones y easings de las animaciones | `lib/motion.ts` |
| Colores de la identidad | `app/globals.css` |

En `content/links.ts`, un enlace vacío (`""`) no se muestra. Mientras no haya número de WhatsApp, el botón "Cotiza tu sitio" abre el correo.

Para cambiar una portada, reemplaza su PNG en `public/projects/` con el mismo nombre. `node scripts/generate-covers.mjs` vuelve a crear las portadas de muestra.
