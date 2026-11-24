/**
 * Texto de "Ver proyecto" / "View project", siempre con su flecha.
 * La flecha es adorno: los lectores de pantalla solo leen el texto.
 * El espacio es de no separación para que no se pierda dentro de un botón
 * (un contenedor flex se come el espacio normal al final de un texto).
 */
export function ViewProjectLabel({ text }: { text: string }) {
  return (
    <>
      {text}
      {" "}
      <span aria-hidden="true">→</span>
    </>
  );
}
