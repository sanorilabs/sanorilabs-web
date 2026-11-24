interface SnTileProps {
  /** Número de la casilla: "00", "01"... Solo proyectos propios. */
  number?: string;
  /** Código de cliente ("CLI-01"). Ocupa el lugar del número. */
  code?: string;
  /** Texto bajo el símbolo. */
  label: string;
  /** Lado en px. El borde y el texto escalan con el tamaño. */
  size?: number;
  /**
   * true cuando la casilla va junto a un texto que ya nombra el proyecto
   * (menú, tarjetas, encabezados): los lectores de pantalla la ignoran.
   * Sin esta marca la casilla va sola y se anuncia como una imagen.
   */
  decorative?: boolean;
  /** Nombre que se anuncia cuando va sola. Por defecto, `label`. */
  name?: string;
  className?: string;
}

const sans = { fontFamily: "var(--font-plex-sans), sans-serif" };
const mono = { fontFamily: "var(--font-plex-mono), monospace" };

/**
 * Casilla de tabla periódica. Se dibuja sobre una retícula de 100×100,
 * así el borde de 4px y los textos son proporcionales al tamaño.
 * Por debajo de 56px solo quedan la esquina y el símbolo.
 *
 * Accesibilidad: sus letras (número, LABS, Sn, nombre) son dibujo, no
 * texto para leer. Decorativa → aria-hidden. Sola → role="img" con un
 * nombre como "Sn 01, Casora".
 */
export function SnTile({
  number,
  code,
  label,
  size = 96,
  decorative = false,
  name,
  className,
}: SnTileProps) {
  const corner = code ?? number ?? "";
  const compact = size < 56;
  const accessibleName = `Sn ${corner}, ${name ?? label}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : accessibleName}
      aria-hidden={decorative ? "true" : undefined}
      focusable="false"
    >
      {/* Con role="img" lo de dentro ya no se lee; aria-hidden lo refuerza
          en lectores que aun así recorren el texto de un SVG. */}
      <g aria-hidden="true">
        <rect
          x="2"
          y="2"
          width="96"
          height="96"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
        <text
          x="11"
          y={compact ? 25 : 21}
          fontSize={compact ? 15 : 10}
          fontWeight="500"
          fill="var(--color-cobalt)"
          style={mono}
        >
          {corner}
        </text>
        {!compact && (
          <text
            x="89"
            y="21"
            fontSize="10"
            fontWeight="400"
            textAnchor="end"
            fill="currentColor"
            style={mono}
          >
            LABS
          </text>
        )}
        <text
          x="50"
          y={compact ? 76 : 66}
          fontSize={compact ? 46 : 42}
          fontWeight="600"
          textAnchor="middle"
          letterSpacing="-0.84"
          fill="currentColor"
          style={sans}
        >
          Sn
        </text>
        {!compact && (
          <text
            x="50"
            y="88"
            fontSize="10"
            fontWeight="400"
            textAnchor="middle"
            fill="currentColor"
            style={mono}
          >
            {label}
          </text>
        )}
      </g>
    </svg>
  );
}
