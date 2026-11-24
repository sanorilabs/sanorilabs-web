import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";

interface ButtonLinkProps {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
}

const base =
  "inline-flex h-12 items-center justify-center px-6 font-mono text-sm font-medium uppercase tracking-[0.06em] transition-colors duration-200";

const variants = {
  primary: "bg-cobalt text-white hover:bg-ink",
  secondary: "border border-ink text-ink hover:bg-ink hover:text-paper",
};

/** Clases de un botón, para enlaces que necesitan su propio onClick. */
export function buttonClass(variant: "primary" | "secondary"): string {
  return `${base} ${variants[variant]}`;
}

/**
 * Botón de esquinas rectas con efecto magnético.
 * Rutas internas con Link; lo demás con <a>.
 */
export function ButtonLink({
  href,
  variant = "primary",
  children,
}: ButtonLinkProps) {
  const className = buttonClass(variant);

  if (href.startsWith("/")) {
    return (
      <Magnetic>
        <Link href={href} className={className}>
          {children}
        </Link>
      </Magnetic>
    );
  }

  const external = href.startsWith("http");
  return (
    <Magnetic>
      <a
        href={href}
        className={className}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    </Magnetic>
  );
}
