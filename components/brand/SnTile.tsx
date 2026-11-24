interface SnTileProps {
  /** Número de la casilla: "00", "01"... Solo proyectos propios. */
  number?: string;
  /** Código de cliente ("CLI-01"). Ocupa el lugar del número. */
  code?: string;
  /** Texto bajo el símbolo. */
  label: string;
  /** Lado en px. El borde y el texto escalan con el tamaño. */
  size?: number;
  /** true cuando el nombre ya aparece escrito al lado. */
  decorative?: boolean;
  className?: string;
}

const sans = { fontFamily: "var(--font-plex-sans), sans-serif" };
const mono = { fontFamily: "var(--font-plex-mono), monospace" };

/**
 * Casilla de tabla periódica. Se dibuja sobre una retícula de 100×100,
 * así el borde de 4px y los textos son proporcionales al tamaño.
 * Por debajo de 56px solo quedan la esquina y el símbolo.
 */
export function SnTile({
  number,
  code,
  label,
  size = 96,
  decorative = false,
  className,
}: SnTileProps) {
  const corner = code ?? number ?? "";
  const compact = size < 56;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : `Sn ${corner} ${label}`.trim()}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    >
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
    </svg>
  );
}
