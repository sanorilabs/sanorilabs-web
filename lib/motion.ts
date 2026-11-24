/**
 * Todas las duraciones (en segundos), easings y umbrales de las animaciones.
 * Cambia un valor aquí y cambia en todo el sitio.
 */

export const duration = {
  /** Cada línea de un título al entrar. */
  line: 1,
  /** Bloques que suben y aparecen (párrafos, tarjetas). */
  reveal: 0.8,
  /** Efecto decode de las etiquetas en mono. */
  decode: 0.9,
  /** Líneas divisorias al dibujarse. */
  draw: 1.2,
  /** Botón magnético siguiendo al puntero. */
  magnetIn: 0.4,
  /** Botón magnético al volver a su lugar. */
  magnetOut: 0.8,
  /** Scroll hacia un ancla (#proyectos, #contacto...). */
  anchor: 1.2,
};

export const ease = {
  line: "expo.out",
  reveal: "power3.out",
  decode: "none",
  draw: "expo.inOut",
  magnetIn: "power3.out",
  magnetOut: "elastic.out(1, 0.45)",
};

export const stagger = {
  /** Entre líneas de un mismo título. */
  lines: 0.09,
  /** Entre tarjetas o bloques hermanos. */
  items: 0.1,
};

export const distance = {
  /** Cuánto suben los bloques al aparecer, en px. */
  reveal: 24,
  /** Qué fracción del desplazamiento del puntero sigue un botón magnético. */
  magnet: 0.25,
};

export const scroll = {
  /** Una animación arranca cuando su elemento cruza esta línea del viewport. */
  start: "top 88%",
  /** Suavizado de Lenis: más bajo = más inercia. */
  lerp: 0.1,
};
// El espacio bajo el menú fijo al saltar a un ancla es scroll-padding-top,
// en app/globals.css: Lenis y el navegador leen el mismo valor.

export const decode = {
  /** Caracteres que se barajan antes de mostrar el texto real. */
  chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789[]/·",
  /** Cada cuánto cambian los caracteres barajados (más alto = más rápido). */
  speed: 0.6,
};

/** Rueda de proyectos de la home. */
export const wheel = {
  /** Scroll que dura cada proyecto, en % del alto de la ventana. */
  stepVh: 60,
  /** Qué tan rápido alcanza el anillo su posición (más alto = más rápido). */
  damping: 6,
  /** Tras este tiempo sin scroll (ms), la rueda se asienta en un proyecto. */
  snapDelayMs: 160,
  /** Duración del ajuste al proyecto más cercano. */
  snapDuration: 0.7,
  /** Duración al saltar con las flechas o al hacer clic en otra portada. */
  jumpDuration: 1,
  /** Px de arrastre que equivalen a un px de scroll. */
  dragFactor: 1.4,
  /** Tamaño y opacidad de las portadas que no están activas. */
  inactiveScale: 0.66,
  inactiveOpacity: 0.55,
  /** Giro 3D máximo de las portadas no activas, en radianes. */
  tilt: 0.5,
  /** Amplitud (px) y velocidad del flotado en reposo. */
  floatPx: 7,
  floatSpeed: 0.7,
  /** Cambio de texto del proyecto activo, en ms. */
  labelMs: 350,
};

/**
 * Transición entre páginas. Los valores en ms llegan al CSS como variables
 * (ver RootShell y globals.css); la cortinilla es el respaldo para
 * navegadores sin View Transitions.
 */
export const transition = {
  /** La portada que se expande hasta ser el encabezado del proyecto. */
  morphMs: 750,
  morphEase: "cubic-bezier(0.7, 0, 0.2, 1)",
  /** La página que sale y la que entra. */
  pageOutMs: 200,
  pageInMs: 350,
  /** Cortinilla color papel (respaldo). */
  curtainIn: 0.5,
  curtainOut: 0.6,
  curtainEase: "power3.inOut",
};

/** Loader de la primera página de cada sesión. Todo en ms. */
export const loader = {
  /** Duración completa. No debe pasar de 1200. */
  totalMs: 1200,
  /** Tramo final en que el loader sube y deja ver la página. */
  exitMs: 350,
  /** Cuánto después de empezar la salida arranca la animación del hero. */
  introOverlapMs: 100,
  /** Clave de sessionStorage: el loader se ve una vez por sesión. */
  sessionKey: "sn-loader",
};

/** Press check: la lista de "Qué hice" en las páginas de caso. */
export const press = {
  /** Un paso se palomea cuando cruza esta línea del viewport. */
  start: "top 72%",
  /** Duración de la palomita al dibujarse, en ms. */
  checkMs: 450,
};

/**
 * Si el JavaScript no arranca en este tiempo (ms), el contenido oculto a la
 * espera de animarse se muestra tal cual. Debe coincidir con MotionScript.
 */
export const failsafeMs = 3000;
