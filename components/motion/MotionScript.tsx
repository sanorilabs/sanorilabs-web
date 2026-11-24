import { failsafeMs, loader } from "@/lib/motion";

/**
 * Script mínimo que corre antes del primer pintado. Con movimiento permitido:
 *  - marca <html data-motion="on"> para que el CSS oculte lo que va a animarse;
 *  - en escritorio con ratón marca data-wheel="ok" y data-view="wheel" (o
 *    "grid" si el usuario eligió la grilla) para mostrar la rueda sin parpadeo;
 *  - en la primera página de la sesión marca data-loader="on" y anota en
 *    window.__snIntroAt cuándo debe empezar a animarse la página.
 * Con prefers-reduced-motion no marca nada: sin loader, estática y en grilla.
 * Si el resto del JavaScript no arranca a tiempo, quita las marcas y el
 * contenido se muestra completo, en grilla y sin animación.
 */
const script = `(function(){try{var d=document.documentElement,s=d.dataset;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;s.motion="on";if(matchMedia("(min-width: 64rem) and (hover: hover) and (pointer: fine)").matches){var v=null;try{v=localStorage.getItem("sn-view")}catch(e){}s.wheel="ok";s.view=v==="grid"?"grid":"wheel"}try{if(!sessionStorage.getItem("${loader.sessionKey}")){sessionStorage.setItem("${loader.sessionKey}","1");s.loader="on";window.__snIntroAt=performance.now()+${loader.totalMs - loader.exitMs + loader.introOverlapMs}}}catch(e){}setTimeout(function(){if(!window.__snMotion){delete s.motion;delete s.wheel;delete s.view}},${failsafeMs})}catch(e){}})()`;

export function MotionScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
