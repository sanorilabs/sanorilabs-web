/** Logotipo en texto: [sanori] labs, con los corchetes en cobalto. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-mono font-medium whitespace-nowrap ${className}`}>
      <span className="text-cobalt">[</span>
      sanori
      <span className="text-cobalt">]</span> labs
    </span>
  );
}
