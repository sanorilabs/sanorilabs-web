/**
 * Loader de primera visita: se dibuja la casilla Sn 00 y un contador va de
 * 00 a 100. Es solo HTML y CSS (globals.css): MotionScript lo enciende con
 * <html data-loader="on"> y el propio CSS lo retira al acabar, así que no
 * puede quedarse pegado aunque falle el JavaScript. Sin la marca no existe.
 *
 * Es decoración pura, así que no deja texto en la página: las letras de la
 * casilla y el contador los escribe el CSS (::before con data-text). Ni un
 * lector de pantalla ni una herramienta que lea el texto del HTML encuentran
 * aquí un "00LABSSnSanori".
 */
export function Loader() {
  return (
    <div className="site-loader" aria-hidden="true">
      <div className="loader-tile">
        <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <rect
            className="loader-frame"
            x="2"
            y="2"
            width="96"
            height="96"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            pathLength={100}
          />
        </svg>
        <span className="loader-step loader-step-1 loader-number" data-text="00" />
        <span className="loader-step loader-step-1 loader-labs" data-text="LABS" />
        <span className="loader-step loader-step-2 loader-symbol" data-text="Sn" />
        <span className="loader-step loader-step-3 loader-name" data-text="Sanori" />
      </div>
      <p className="loader-count" />
    </div>
  );
}
