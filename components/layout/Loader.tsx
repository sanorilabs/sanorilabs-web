const sans = { fontFamily: "var(--font-plex-sans), sans-serif" };
const mono = { fontFamily: "var(--font-plex-mono), monospace" };

/**
 * Loader de primera visita: se dibuja la casilla Sn 00 y un contador va de
 * 00 a 100. Es solo HTML y CSS (globals.css): MotionScript lo enciende con
 * <html data-loader="on"> y el propio CSS lo retira al acabar, así que no
 * puede quedarse pegado aunque falle el JavaScript. Sin la marca no existe.
 */
export function Loader() {
  return (
    <div className="site-loader" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="loader-tile" focusable="false">
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
        <text
          className="loader-step loader-step-1"
          x="11"
          y="21"
          fontSize="10"
          fontWeight="500"
          fill="var(--color-cobalt)"
          style={mono}
        >
          00
        </text>
        <text
          className="loader-step loader-step-1"
          x="89"
          y="21"
          fontSize="10"
          textAnchor="end"
          fill="currentColor"
          style={mono}
        >
          LABS
        </text>
        <text
          className="loader-step loader-step-2"
          x="50"
          y="66"
          fontSize="42"
          fontWeight="600"
          textAnchor="middle"
          letterSpacing="-0.84"
          fill="currentColor"
          style={sans}
        >
          Sn
        </text>
        <text
          className="loader-step loader-step-3"
          x="50"
          y="88"
          fontSize="10"
          textAnchor="middle"
          fill="currentColor"
          style={mono}
        >
          Sanori
        </text>
      </svg>
      {/* El número lo escribe el CSS con un contador animado. */}
      <p className="loader-count" />
    </div>
  );
}
